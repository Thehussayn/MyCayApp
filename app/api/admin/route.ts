import { NextRequest, NextResponse } from "next/server";
import { biodataSteps } from "@/lib/kyc/fields";
import { validateNuban } from "@/lib/kyc/nuban";
import { operator } from "@/lib/platform/access";
import { getDb, saveDb, createBlankBiodata } from "@/lib/db";
import {
  can,
  Capability,
  capabilities,
  isOperator,
} from "@/lib/platform/permissions";
import { defaults } from "@/lib/platform/config";
import {
  audit,
  notify,
  agreement,
  syncSchedule,
  schedule,
  uid,
  now,
} from "@/lib/platform/engine";
import { hashPassword, isPasswordValid } from "@/lib/auth/password";
import { User, UserRole } from "@/lib/db/types";
const safe = (u: User) => ({
  id: u.id,
  fullName: u.fullName,
  email: u.email,
  phone: u.phone,
  country: u.country,
  role: u.role,
  status: u.status,
  kycStatus: u.kycStatus || "NOT_STARTED",
  referenceId: u.referenceId,
  createdAt: u.createdAt,
  lastLoginAt: u.lastLoginAt,
  disabled: !!u.disabled,
});
const scope: Record<string, Capability> = {
  investors: "investors",
  review: "review",
  finance: "finance",
  users: "users",
  audit: "audit",
  settings: "settings",
  content: "content",
};
export function GET(req: NextRequest) {
  const actor = operator();
  if (!actor)
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  const db = getDb(),
    config = { ...defaults, ...db.platformConfig },
    permissions = capabilities.filter((c) =>
      can(actor.role, c, config.permissions),
    );
  const section = req.nextUrl.searchParams.get("section") || "overview";
  if (
    section !== "overview" &&
    (!scope[section] || !permissions.includes(scope[section]))
  )
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  if (section === "overview")
    return NextResponse.json({
      user: safe(actor),
      permissions,
      counts: {
        investors: permissions.includes("investors")
          ? db.users.filter((u) => u.role === "INVESTOR").length
          : undefined,
        pending: permissions.includes("review")
          ? db.users.filter(
              (u) =>
                u.role === "INVESTOR" &&
                ["SUBMITTED", "BIODATA_SUBMITTED", "UNDER_REVIEW"].includes(
                    u.kycStatus || "",
                  ),
            ).length
          : undefined,
        capital: permissions.includes("finance")
          ? [...db.investmentsGiap, ...db.investmentsWealthStream]
              .filter(
                (i) => !["CLOSED", "COMPLETED", "EXITED"].includes(i.status),
              )
              .reduce((sum, i) => sum + i.capitalKobo / 100, 0)
          : undefined,
        withdrawals: permissions.includes("finance")
          ? (db.withdrawals || []).filter((w) => w.status === "PENDING_REVIEW")
              .length
          : undefined,
      },
    });
  if (section === "investors" || section === "review")
    return NextResponse.json({
      investors: db.users
        .filter((u) => u.role === "INVESTOR")
        .map((u) => ({
          ...safe(u),
          biodata: db.biodata.find((b) => b.userId === u.id),
          documents: db.kycDocuments.filter((d) => d.userId === u.id),
          investments: [
            ...db.investmentsGiap,
            ...db.investmentsWealthStream,
          ].filter((i) => i.userId === u.id),
          notes: (db.communications || []).filter((n) => n.userId === u.id),
          audit: db.auditLogs.filter((l) => l.targetUserId === u.id),
        })),
    });
  if (section === "finance")
    return NextResponse.json({
      investors: db.users
        .filter((u) => u.role === "INVESTOR")
        .map((u) => {
          const b = db.biodata.find((b) => b.userId === u.id);
          return {
            ...safe(u),
            payoutBank: b
              ? {
                  name: b.bankName,
                  accountNumber: b.accountNumber,
                  accountHolder: b.accountHolderName,
                }
              : null,
          };
        }),
      giap: db.investmentsGiap,
      wealthStream: db.investmentsWealthStream,
      payouts: db.payoutSchedules,
      withdrawals: db.withdrawals || [],
      transactions: db.transactions,
      ngnPerUsd: config.ngnPerUsd,
    });
  if (section === "users")
    return NextResponse.json({
      users: db.users.filter((u) => isOperator(u.role)).map(safe),
      canAssignRoles: actor.role === "SUPER_ADMIN",
    });
  if (section === "audit") return NextResponse.json({ logs: db.auditLogs });
  if (section === "settings") return NextResponse.json({ config });
  if (section === "content")
    return NextResponse.json({ articles: (db as any).articles || [] });
  return NextResponse.json({ error: "Unknown section." }, { status: 400 });
}
const actionScope: Record<string, Capability> = {
  DIRECT_PROFILE: "review",
  NOTE: "investors",
  REVIEW: "review",
  DOCUMENT: "review",
  SAVE_BIODATA: "review",
  CREATE_INVESTOR: "investors",
  NOTIFY: "investors",
  ALLOCATE: "finance",
  LIST_RESALE: "finance",
  SELL: "finance",
  PAY_PAYOUT: "finance",
  REVIEW_WITHDRAWAL: "finance",
  RETURN_PRINCIPAL: "finance",
  FX: "finance",
  CREATE_USER: "users",
  UPDATE_USER: "users",
  RESET_PASSWORD: "users",
  CONFIG: "settings",
  ARTICLE: "content",
};
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const capability = actionScope[body.action];
    const actor = capability && operator(capability);
    if (!actor)
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    const db = getDb(),
      config = { ...defaults, ...db.platformConfig };
    let target = db.users.find((u) => u.id === body.userId);
    const reason = typeof body.reason === "string" ? body.reason.trim() : "";
    if (body.action === "CONFIG") {
      if (actor.role !== "SUPER_ADMIN")
        throw Error("Only Super Admin can change system settings.");
      const c = body.config;
      for (const key of [
        "giapMin",
        "giapMax",
        "wealthstreamMin",
        "wealthstreamMax",
        "monthlyRate",
        "annualRate",
        "noticeDays",
        "ngnPerUsd",
      ]) {
        if (
          typeof c[key] !== "number" ||
          !Number.isFinite(c[key]) ||
          c[key] < 0
        )
          throw Error(`Invalid ${key}.`);
      }
      if (
        c.giapMin <= 0 ||
        c.wealthstreamMin <= 0 ||
        c.giapMax < c.giapMin ||
        c.wealthstreamMax < c.wealthstreamMin ||
        c.monthlyRate > 1 ||
        c.annualRate > 1 ||
        !Number.isInteger(c.noticeDays) ||
        c.noticeDays > 3650
      )
        throw Error("Check plan limits, rates, and notice period.");
      if (
        typeof c.allowMultipleInvestments !== "boolean" ||
        typeof c.allowMultiplePlans !== "boolean"
      )
        throw Error("Invalid plan rules.");
      const permissions: Partial<Record<UserRole, Capability[]>> = {};
      for (const role of ["STAFF", "FINANCE", "ADMIN"] as UserRole[]) {
        const list = c.permissions?.[role];
        if (list) {
          if (
            !Array.isArray(list) ||
            list.some((p: any) => !capabilities.includes(p))
          )
            throw Error("Invalid permissions.");
          permissions[role] = list;
        }
      }
      db.platformConfig = {
        giapMin: c.giapMin,
        giapMax: c.giapMax,
        wealthstreamMin: c.wealthstreamMin,
        wealthstreamMax: c.wealthstreamMax,
        monthlyRate: c.monthlyRate,
        annualRate: c.annualRate,
        noticeDays: c.noticeDays,
        ngnPerUsd: c.ngnPerUsd,
        allowMultipleInvestments: c.allowMultipleInvestments,
        allowMultiplePlans: c.allowMultiplePlans,
        permissions,
      };
      audit(
        db,
        actor,
        "SETTINGS_UPDATED",
        actor,
        `Plan settings and permissions updated. Previous: ${JSON.stringify(config)}. New: ${JSON.stringify(db.platformConfig)}`,
      );
    } else if (body.action === "FX") {
      const rate = Number(body.rate);
      if (!Number.isFinite(rate) || rate <= 0)
        throw Error("Enter a valid NGN per USD exchange rate.");
      db.platformConfig = { ...config, ngnPerUsd: rate };
      audit(
        db,
        actor,
        "SETTINGS_UPDATED",
        actor,
        `NGN/USD changed from ${config.ngnPerUsd} to ${rate}.`,
      );
    } else if (
      body.action === "CREATE_USER" ||
      body.action === "CREATE_INVESTOR"
    ) {
      const role: UserRole =
        body.action === "CREATE_INVESTOR" ? "INVESTOR" : body.role;
      if (
        !["INVESTOR", "STAFF", "FINANCE", "ADMIN", "SUPER_ADMIN"].includes(
          role,
        ) ||
        (!["INVESTOR", "STAFF"].includes(role) && actor.role !== "SUPER_ADMIN")
      )
        throw Error("Only Super Admin can assign roles.");
      if (
        !body.fullName?.trim() ||
        !/^\S+@\S+\.\S+$/.test(body.email) ||
        !isPasswordValid(body.password || "")
      )
        throw Error(
          "Enter a name, valid email, and a strong temporary password.",
        );
      if (
        db.users.some((u) => u.email.toLowerCase() === body.email.toLowerCase())
      )
        throw Error("Email is already registered.");
      const pw = hashPassword(body.password);
      target = {
        id: uid("user"),
        fullName: body.fullName.trim(),
        email: body.email.toLowerCase().trim(),
        phone: body.phone || "",
        country: body.country || "Nigeria",
        role,
        status: "APPROVED",
        kycStatus: "NOT_STARTED",
        passwordHash: pw.hash,
        salt: pw.salt,
        termsAccepted: false,
        privacyAccepted: false,
        createdAt: now(),
        updatedAt: now(),
        failedLoginAttempts: 0,
        referenceId: uid("JOP").slice(0, 17).toUpperCase(),
        mustChangePassword: true,
      };
      db.users.push(target);
      audit(
        db,
        actor,
        "USER_UPDATED",
        target,
        `Created ${role} account. Temporary password must be changed on first login.`,
      );
    } else if (body.action === "UPDATE_USER") {
      if (!target || !isOperator(target.role))
        throw Error("Staff account not found.");
      if (target.id === actor.id)
        throw Error("You cannot change your own access.");
      if (
        actor.role !== "SUPER_ADMIN" &&
        (target.role !== "STAFF" || body.role !== "STAFF")
      )
        throw Error(
          "Only Super Admin can change roles or manage privileged accounts.",
        );
      if (!["STAFF", "FINANCE", "ADMIN", "SUPER_ADMIN"].includes(body.role))
        throw Error("Invalid role.");
      if (
        target.role === "SUPER_ADMIN" &&
        (body.disabled || body.role !== "SUPER_ADMIN") &&
        db.users.filter((u) => u.role === "SUPER_ADMIN" && !u.disabled).length <
          2
      )
        throw Error("Keep at least one active Super Admin.");
      const before = `${target.role}, disabled=${!!target.disabled}`;
      target.role = body.role;
      target.disabled = !!body.disabled;
      audit(
        db,
        actor,
        "USER_UPDATED",
        target,
        `Access changed: ${before} → ${target.role}, disabled=${target.disabled}.`,
      );
    } else if (body.action === "RESET_PASSWORD") {
      if (!target || !isOperator(target.role) || target.id === actor.id)
        throw Error("Staff account not found.");
      if (actor.role !== "SUPER_ADMIN" && target.role !== "STAFF")
        throw Error("Only Super Admin can reset privileged accounts.");
      if (!isPasswordValid(body.password || ""))
        throw Error("Enter a strong temporary password.");
      const p = hashPassword(body.password);
      target.passwordHash = p.hash;
      target.salt = p.salt;
      target.mustChangePassword = true;
      target.updatedAt = now();
      audit(
        db,
        actor,
        "USER_UPDATED",
        target,
        "Temporary password reset; password change required.",
      );
    } else if (body.action === "NOTE" || body.action === "NOTIFY") {
      if (!target || target.role !== "INVESTOR" || reason.length < 3)
        throw Error("Select an investor and enter a message.");
      if (body.action === "NOTE") {
        db.communications ??= [];
        db.communications.unshift({
          id: uid("note"),
          userId: target.id,
          author: actor.fullName,
          note: reason,
          createdAt: now(),
        });
      } else
        notify(
          db,
          target.id,
          "Message from Jeje-Ola",
          reason,
          "/portal/notifications",
        );
      audit(db, actor, "NOTE_ADDED", target, `${body.action}: ${reason}`);
    } else if (body.action === "REVIEW") {
      if (!target || target.role !== "INVESTOR")
        throw Error("Investor not found.");
      if (!["APPROVED", "DECLINED", "INFO_REQUESTED"].includes(body.status))
        throw Error("Invalid decision.");
      if (body.status !== "APPROVED" && reason.length < 5)
        throw Error("Enter a reason of at least five characters.");
      const bio = db.biodata.find((b) => b.userId === target!.id);
      if (!bio?.isSubmitted || !["SUBMITTED", "BIODATA_SUBMITTED", "UNDER_REVIEW", "INFO_REQUESTED", "REJECTED"].includes(target.kycStatus || ""))
        throw Error("The investor must submit the seven-step KYC before review.");
      const docs = db.kycDocuments.filter((d) => d.userId === target!.id);
      if (body.status === "APPROVED" && !["GOVERNMENT_ID", "PROOF_OF_ADDRESS", "SPECIMEN_SIGNATURE"].every((type) => docs.some((d) => d.documentType === type && d.status === "APPROVED")))
        throw Error("Approve all required documents before approving KYC.");
      const before = target.kycStatus;
      target.kycStatus = body.status === "DECLINED" ? "REJECTED" : body.status;
      target.status = "APPROVED";
      target.staffInquiry = body.status === "INFO_REQUESTED" ? reason : undefined;
      target.declineReason = body.status === "DECLINED" ? reason : undefined;
      audit(db, actor, body.status === "APPROVED" ? "APPROVE" : body.status === "DECLINED" ? "DECLINE" : "REQUEST_INFO", target, `KYC ${before} → ${target.kycStatus}. ${reason}`);
      notify(db, target.id, "KYC update", body.status === "APPROVED" ? "Your KYC is approved. You can now invest." : reason, "/portal/verification");
    } else if (body.action === "DOCUMENT") {
      if (!target || target.role !== "INVESTOR")
        throw Error("Investor not found.");
      const doc = db.kycDocuments.find(
        (d) => d.id === body.documentId && d.userId === target!.id,
      );
      if (!doc) throw Error("Document not found.");
      if (!db.biodata.some((b) => b.userId === target!.id && b.isSubmitted)) throw Error("KYC must be submitted before document review.");
      if (!["APPROVED", "INFO_REQUESTED", "REJECTED"].includes(body.status))
        throw Error("Invalid document status.");
      if (body.status !== "APPROVED" && reason.length < 5)
        throw Error("Enter a clear reason.");
      doc.status = body.status;
      doc.rejectionReason = body.status !== "APPROVED" ? reason : undefined;
      doc.reviewedAt = now();
      doc.reviewedBy = actor.email;
      const docs = db.kycDocuments.filter((d) => d.userId === target!.id);
      const approved = [
        "GOVERNMENT_ID",
        "PROOF_OF_ADDRESS",
        "SPECIMEN_SIGNATURE",
      ].every((t) =>
        docs.some((d) => d.documentType === t && d.status === "APPROVED"),
      );
      target.kycStatus =
        target.kycStatus === "APPROVED" && approved
          ? "APPROVED"
          : body.status === "INFO_REQUESTED"
            ? "INFO_REQUESTED"
            : "UNDER_REVIEW";
      audit(
        db,
        actor,
        body.status === "APPROVED"
          ? "KYC_DOC_APPROVED"
          : "KYC_DOC_INFO_REQUESTED",
        target,
        `${doc.documentType}: ${body.status}. ${reason}`,
      );
      notify(
        db,
        target.id,
        "Verification update",
        target.kycStatus === "APPROVED"
          ? "Your verification is complete. You can now invest."
          : reason || "Your document review has been updated.",
        "/portal/verification",
      );
    } else if (body.action === "DIRECT_PROFILE") {
      if (!target || target.role !== "INVESTOR")
        throw Error("Investor not found.");
      const allowed = biodataSteps
        .flatMap((s) => s.fields.map((f) => f.key))
        .concat([
          "bankName",
          "digitalSignature",
          "acceptTerms",
          "acceptPrivacy",
        ]);
      const incoming = Object.fromEntries(
        Object.entries(body.data || {}).filter(([k]) => allowed.includes(k)),
      );
      const index = db.biodata.findIndex((b) => b.userId === target!.id);
      const bio = {
        ...(index < 0 ? createBlankBiodata(target) : db.biodata[index]),
        ...incoming,
        email: target.email,
        userId: target.id,
        updatedAt: now(),
      };
      if (body.submit) {
        const required = [
          "fullName",
          "dob",
          "gender",
          "nationality",
          "maritalStatus",
          "residentialAddress",
          "city",
          "stateProvince",
          "idType",
          "idNumber",
          "expiryDate",
          "employmentStatus",
          "nokFullName",
          "nokRelationship",
          "nokPhone",
          "nokAddress",
          "bankCode",
          "accountHolderName",
          "accountNumber",
          "accountType",
        ];
        if (required.some((k) => !String((bio as any)[k] || "").trim()))
          throw Error("Complete all required profile fields.");
        if (!validateNuban(bio.bankCode, bio.accountNumber).isValid)
          throw Error("Enter a valid bank account number.");
        if (
          new Date(bio.expiryDate) <= new Date() ||
          !Number.isFinite(new Date(bio.expiryDate).getTime())
        )
          throw Error("The ID must not be expired.");
        const age =
          (Date.now() - new Date(bio.dob).getTime()) / (365.25 * 86400000);
        if (!Number.isFinite(age) || age < 18)
          throw Error("Investor must be at least 18.");
        if (
          !bio.acceptTerms ||
          !bio.acceptPrivacy ||
          bio.digitalSignature.trim().toLowerCase() !==
            bio.fullName.trim().toLowerCase()
        )
          throw Error(
            "The investor must sign and accept the terms and privacy policy.",
          );
        if (
          !["GOVERNMENT_ID", "PROOF_OF_ADDRESS", "SPECIMEN_SIGNATURE"].every(
            (t) =>
              db.kycDocuments.some(
                (d) => d.userId === target!.id && d.documentType === t,
              ),
          )
        )
          throw Error("Upload all three verification documents.");
        bio.isSubmitted = true;
        bio.submittedAt = now();
        bio.signatureDate = now();
        bio.completedSteps = [1, 2, 3, 4, 5, 6, 7];
        bio.currentStep = 7;
        target.kycStatus = "SUBMITTED";
      }
      if (index < 0) db.biodata.push(bio);
      else db.biodata[index] = bio;
      audit(
        db,
        actor,
        "BIODATA_EDITED",
        target,
        body.submit
          ? "Submitted biodata on behalf of investor for review."
          : "Saved biodata draft on behalf of investor.",
      );
    } else if (body.action === "SAVE_BIODATA") {
      if (!target || target.role !== "INVESTOR")
        throw Error("Investor not found.");
      const bio = db.biodata.find((b) => b.userId === target!.id);
      if (!bio) throw Error("The investor has not started their profile.");
      const allowed = [
        "phone",
        "residentialAddress",
        "city",
        "stateProvince",
        "postalCode",
        "employmentStatus",
        "employerName",
        "jobTitle",
        "businessAddress",
        "nokFullName",
        "nokRelationship",
        "nokPhone",
        "nokAddress",
      ];
      for (const key of allowed) {
        if (typeof body.data?.[key] === "string")
          (bio as any)[key] = body.data[key];
      }
      bio.updatedAt = now();
      audit(
        db,
        actor,
        "BIODATA_EDITED",
        target,
        "Updated contact, occupation or next-of-kin details.",
      );
    } else if (["ALLOCATE", "LIST_RESALE", "SELL"].includes(body.action)) {
      const g = db.investmentsGiap.find((i) => i.id === body.investmentId);
      if (!g) throw Error("GIAP investment not found.");
      target = db.users.find((u) => u.id === g.userId)!;
      if (body.action === "ALLOCATE") {
        if (
          g.status !== "FUNDED" ||
          !body.propertyName?.trim() ||
          !body.location?.trim()
        )
          throw Error(
            "Select a funded investment and enter the property name and location.",
          );
        const valuation = Number(body.valuation);
        if (!Number.isFinite(valuation) || valuation <= 0)
          throw Error("Enter a valid valuation.");
        g.linkedPropertyId = uid("property");
        g.propertyId = g.linkedPropertyId;
        g.propertyTitle = body.propertyName.trim();
        g.propertyLocation = body.location.trim();
        g.currentEvaluation = valuation;
        g.projectedGrossProfit = valuation - g.initialInvestment;
        g.projectedInvestorShare = g.projectedGrossProfit * 0.7;
        g.ownershipStatus = "Assigned";
        g.status = "ACTIVE";
        g.milestones.push({
          id: uid("m"),
          title: "Property assigned",
          date: now().slice(0, 10),
          status: "COMPLETED",
          description: g.propertyTitle,
        });
        agreement(db, g);
      } else if (body.action === "LIST_RESALE") {
        if (g.status !== "ACTIVE")
          throw Error("Only an active investment can be listed.");
        g.status = "LISTED_FOR_RESALE";
        g.milestones.push({
          id: uid("m"),
          title: "Listed for resale",
          date: now().slice(0, 10),
          status: "COMPLETED",
          description: "",
        });
      } else {
        if (g.status !== "LISTED_FOR_RESALE")
          throw Error("List the property for resale first.");
        const price = Number(body.salePrice);
        if (!Number.isFinite(price) || price < g.initialInvestment)
          throw Error(
            "Sale price must cover the capital. Loss-making sales require a separate review.",
          );
        g.resaleTarget = price;
        g.currentEvaluation = price;
        g.realizedInvestorProfit =
          Math.round((price - g.initialInvestment) * 0.7 * 100) / 100;
        g.isResaleCompleted = true;
        g.status = "READY_FOR_PAYOUT";
        db.payoutSchedules.push({
          id: uid("ps"),
          investmentId: g.id,
          userId: g.userId,
          payoutDate: now().slice(0, 10),
          amount: g.initialInvestment + g.realizedInvestorProfit,
          status: "DUE",
        });
      }
      audit(
        db,
        actor,
        "INVESTMENT_UPDATED",
        target,
        `${g.referenceId}: ${body.action}, status ${g.status}.`,
      );
      notify(
        db,
        target.id,
        "GIAP update",
        `${g.referenceId}: ${g.status.replaceAll("_", " ").toLowerCase()}.`,
        `/portal/investments/${g.id}`,
      );
    } else if (body.action === "PAY_PAYOUT") {
      const p = db.payoutSchedules.find((p) => p.id === body.payoutId);
      if (!p || p.status === "COMPLETED")
        throw Error("Payout is unavailable or already completed.");
      if (p.payoutDate > now().slice(0, 10))
        throw Error("Payout is not due yet.");
      if (!body.reference?.trim())
        throw Error("Enter the completed transfer reference.");
      if (db.transactions.some((t) => t.reference === body.reference.trim()))
        throw Error("Transfer reference already exists.");
      const w = db.investmentsWealthStream.find((w) => w.id === p.investmentId),
        g = db.investmentsGiap.find((g) => g.id === p.investmentId);
      if (w && w.status !== "ACTIVE")
        throw Error("Payouts are paused for this investment.");
      if (g && g.status !== "READY_FOR_PAYOUT")
        throw Error("GIAP sale payout is not ready.");
      p.status = "COMPLETED";
      p.reference = body.reference.trim();
      p.paidAt = now();
      target = db.users.find((u) => u.id === p.userId)!;
      if (w) {
        w.totalPayoutsReceived =
          Math.round((w.totalPayoutsReceived + p.amount) * 100) / 100;
        const pending = db.payoutSchedules
          .filter((x) => x.investmentId === w.id && x.status !== "COMPLETED")
          .sort((a, b) => a.payoutDate.localeCompare(b.payoutDate));
        const last = pending[pending.length - 1];
        const start = new Date(`${last?.payoutDate || p.payoutDate}T00:00:00Z`);
        db.payoutSchedules.push(...schedule(w, start, 1, true));
        syncSchedule(db, w);
      }
      if (g) g.status = "CLOSED";
      const txn = {
        id: uid("txn"),
        userId: p.userId,
        reference: p.reference!,
        type: g ? ("PROFIT_SHARE" as const) : ("PAYOUT_DISTRIBUTION" as const),
        plan: g ? ("GIAP" as const) : ("WEALTHSTREAM" as const),
        title: g ? "GIAP resale payout" : "WealthStream payout",
        amount: p.amount,
        direction: "CREDIT" as const,
        date: now().slice(0, 10),
        status: "COMPLETED" as const,
        receiptAvailable: true,
        metadata: { investmentId: p.investmentId },
      };
      db.transactions.unshift(txn);
      audit(
        db,
        actor,
        "PAYOUT_COMPLETED",
        target,
        `Payout ${p.id}: NGN ${p.amount}; reference ${p.reference}.`,
      );
      notify(
        db,
        target.id,
        "Payout processed",
        `NGN ${p.amount.toLocaleString()} has been recorded as paid. Reference: ${p.reference}.`,
      );
    } else if (body.action === "REVIEW_WITHDRAWAL") {
      const r = db.withdrawals?.find((w) => w.id === body.withdrawalId);
      if (!r || !["PENDING_REVIEW", "PENDING_INFORMATION"].includes(r.status))
        throw Error("Withdrawal is not awaiting review.");
      const w = db.investmentsWealthStream.find((w) => w.id === r.investmentId);
      if (!w || w.status !== "ACTIVE")
        throw Error("Investment is unavailable.");
      target = db.users.find((u) => u.id === r.userId)!;
      if (!["APPROVE", "REJECT", "REQUEST_INFO"].includes(body.decision))
        throw Error("Choose a decision.");
      if (body.decision !== "APPROVE" && reason.length < 5)
        throw Error("Enter a clear reason.");
      if (body.decision === "APPROVE") {
        r.status = "IN_NOTICE_PERIOD";
        r.approvedAt = now();
        r.noticeEndDate = new Date(
          Date.now() + (w.withdrawalNoticeDays ?? config.noticeDays) * 86400000,
        ).toISOString();
        w.status = "IN_NOTICE_PERIOD";
        db.payoutSchedules = db.payoutSchedules.filter(
          (p) => p.investmentId !== w.id || p.status === "COMPLETED",
        );
        syncSchedule(db, w);
      } else
        r.status =
          body.decision === "REJECT" ? "REJECTED" : "PENDING_INFORMATION";
      r.reviewNote = reason;
      audit(
        db,
        actor,
        "WITHDRAWAL_REVIEWED",
        target,
        `${r.id}: ${body.decision}. ${reason}`,
      );
      notify(
        db,
        target.id,
        "Withdrawal update",
        body.decision === "APPROVE"
          ? `Your principal return is due ${r.noticeEndDate?.slice(0, 10)}. No further returns accrue.`
          : reason,
        `/portal/investments/${w.id}`,
      );
    } else if (body.action === "RETURN_PRINCIPAL") {
      const r = db.withdrawals?.find((w) => w.id === body.withdrawalId);
      if (
        !r ||
        r.status !== "IN_NOTICE_PERIOD" ||
        !r.noticeEndDate ||
        new Date(r.noticeEndDate) > new Date()
      )
        throw Error("The notice period has not ended.");
      if (
        !body.reference?.trim() ||
        db.transactions.some((t) => t.reference === body.reference.trim())
      )
        throw Error("Enter a unique completed transfer reference.");
      const w = db.investmentsWealthStream.find(
        (w) => w.id === r.investmentId,
      )!;
      target = db.users.find((u) => u.id === r.userId)!;
      r.status = "COMPLETED";
      r.reference = body.reference.trim();
      w.status = "CLOSED";
      db.transactions.unshift({
        id: uid("txn"),
        userId: r.userId,
        reference: r.reference!,
        type: "CAPITAL_RETURN",
        plan: "WEALTHSTREAM",
        title: "Principal returned",
        amount: r.principal,
        direction: "CREDIT",
        date: now().slice(0, 10),
        status: "COMPLETED",
        receiptAvailable: true,
        metadata: { investmentId: w.id },
      });
      audit(
        db,
        actor,
        "PAYOUT_COMPLETED",
        target,
        `Principal returned: NGN ${r.principal}; ${r.reference}.`,
      );
      notify(
        db,
        target.id,
        "Principal returned",
        `Your principal of NGN ${r.principal.toLocaleString()} has been returned. Reference: ${r.reference}.`,
      );
    } else if (body.action === "ARTICLE") {
      const article = body.article;
      if (
        !article?.title?.trim() ||
        !article.slug ||
        !/^[-a-z0-9]+$/.test(article.slug) ||
        !article.body?.trim() ||
        !["DRAFT", "PUBLISHED", "ARCHIVED"].includes(article.status)
      )
        throw Error("Enter a title, URL slug, article text, and status.");
      const articles = (db as any).articles || [];
      const record = {
        id: article.id || uid("article"),
        title: article.title.trim(),
        slug: article.slug,
        body: article.body,
        excerpt: article.excerpt || "",
        status: article.status,
        updatedAt: now(),
      };
      if (
        articles.some((a: any) => a.slug === record.slug && a.id !== record.id)
      )
        throw Error("This URL slug is already used.");
      const index = articles.findIndex((a: any) => a.id === record.id);
      if (index < 0) articles.unshift(record);
      else articles[index] = record;
      (db as any).articles = articles;
      audit(
        db,
        actor,
        "SETTINGS_UPDATED",
        actor,
        `Article ${record.slug}: ${record.status}.`,
      );
    } else throw Error("Unknown action.");
    saveDb(db);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
