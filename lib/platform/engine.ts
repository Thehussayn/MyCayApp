import crypto from "crypto";
import { headers } from "next/headers";
import { getDb, saveDb } from "@/lib/db";
import {
  DatabaseSchema,
  GiapInvestment,
  WealthStreamInvestment,
  User,
  StaffActionType,
  PayoutScheduleItem,
} from "@/lib/db/types";
import { PaymentIntent } from "./types";
import { defaults } from "./config";
export const uid = (prefix: string) => `${prefix}_${crypto.randomUUID()}`;
export const now = () => new Date().toISOString();
export function audit(
  db: DatabaseSchema,
  actor: User,
  action: StaffActionType,
  target: User,
  notes: string,
) {
  let ipAddress: string | undefined;
  try {
    ipAddress = headers().get("x-forwarded-for") || undefined;
  } catch {}
  db.auditLogs.unshift({
    ipAddress,
    id: uid("log"),
    timestamp: now(),
    actorId: actor.id,
    actorEmail: actor.email,
    actorRole: actor.role,
    targetUserId: target.id,
    targetUserEmail: target.email,
    action,
    notes,
  });
}
export function notify(
  db: DatabaseSchema,
  userId: string,
  title: string,
  message: string,
  actionUrl = "/portal/investments",
) {
  db.notifications.unshift({
    id: uid("notif"),
    userId,
    category: "INVESTMENT",
    title,
    message,
    timestamp: now(),
    isRead: false,
    actionUrl,
    actionLabel: "View investment",
  });
}
export function agreement(
  db: DatabaseSchema,
  investment: GiapInvestment | WealthStreamInvestment,
) {
  const existing = db.portalDocuments.find(
    (d) =>
      d.userId === investment.userId &&
      d.name.includes(investment.referenceId) &&
      d.category === "AGREEMENT",
  );
  const id = existing?.id || uid("doc");
  const record = {
    id,
    userId: investment.userId,
    name: `${"principal" in investment ? "WealthStream" : "GIAP"} agreement · ${investment.referenceId}`,
    category: "AGREEMENT" as const,
    uploadDate: now().slice(0, 10),
    status: "AVAILABLE" as const,
    fileSize: 0,
    fileType: "PDF",
    fileUrl: `/api/portal/files/${id}`,
  };
  if (existing) Object.assign(existing, record);
  else db.portalDocuments.unshift(record);
}
export function schedule(
  investment: WealthStreamInvestment,
  start = new Date(),
  count = 12,
  after = false,
): PayoutScheduleItem[] {
  const monthly = investment.payoutFrequency === "MONTHLY";
  const amount =
    Math.round(
      ((investment.principal * investment.annualRate) / (monthly ? 12 : 1)) *
        100,
    ) / 100;
  return Array.from({ length: count }, (_, i) => {
    const date = monthly
      ? new Date(
          Date.UTC(
            start.getUTCFullYear(),
            start.getUTCMonth() + i + 1 + (after ? 1 : 0),
            0,
          ),
        )
      : new Date(
          Date.UTC(
            start.getUTCFullYear() + i + 1,
            start.getUTCMonth(),
            Math.min(
              start.getUTCDate(),
              new Date(
                Date.UTC(
                  start.getUTCFullYear() + i + 1,
                  start.getUTCMonth() + 1,
                  0,
                ),
              ).getUTCDate(),
            ),
          ),
        );
    return {
      id: uid("ps"),
      investmentId: investment.id,
      userId: investment.userId,
      payoutDate: date.toISOString().slice(0, 10),
      amount,
      status: "SCHEDULED",
    };
  });
}
export function syncSchedule(db: DatabaseSchema, w: WealthStreamInvestment) {
  const items = db.payoutSchedules
    .filter((p) => p.investmentId === w.id)
    .sort((a, b) => a.payoutDate.localeCompare(b.payoutDate));
  w.payoutSchedule = items;
  const future = items.filter((p) => p.status !== "COMPLETED");
  w.nextPayoutDate = future[0]?.payoutDate || "";
  w.nextPayoutAmount = future[0]?.amount || 0;
  w.upcomingPayouts = future.slice(0, 3).map((p) => ({
    id: p.id,
    date: p.payoutDate,
    amount: p.amount,
    status: "SCHEDULED",
  }));
  w.payoutAmount = w.nextPayoutAmount;
}
export function completePayment(
  reference: string,
  amountKobo: number,
  currency: string,
) {
  const db = getDb();
  const intent = db.paymentIntents?.find((p) => p.id === reference);
  if (!intent) throw Error("Payment reference not found.");
  if (currency !== "NGN" || amountKobo !== Math.round(intent.capital * 100))
    throw Error("Payment amount does not match the investment.");
  if (intent.status === "COMPLETED")
    return {
      alreadyProcessed: true,
      investmentId: db.transactions.find((t) => t.reference === reference)
        ?.metadata?.investmentId,
    };
  const user = db.users.find((u) => u.id === intent.userId);
  if (!user) throw Error("Investor not found.");
  let investment: GiapInvestment | WealthStreamInvestment;
  if (intent.topUpId) {
    const w = db.investmentsWealthStream.find(
      (w) => w.id === intent.topUpId && w.userId === user.id,
    );
    if (!w || w.status !== "ACTIVE")
      throw Error("This investment cannot be topped up.");
    w.principal = Math.round((w.principal + intent.capital) * 100) / 100;
    w.capitalKobo = Math.round(w.principal * 100);
    for (const r of db.withdrawals || [])
      if (
        r.investmentId === w.id &&
        ["PENDING_REVIEW", "PENDING_INFORMATION"].includes(r.status)
      )
        r.principal = w.principal;
    const pending = db.payoutSchedules
      .filter((p) => p.investmentId === w.id && p.status !== "COMPLETED")
      .sort((a, b) => a.payoutDate.localeCompare(b.payoutDate));
    // Preserve the next payout already in the pipeline; use increased capital thereafter.
    pending
      .slice(1)
      .forEach(
        (p) =>
          (p.amount =
            Math.round(
              ((w.principal * w.annualRate) /
                (w.payoutFrequency === "MONTHLY" ? 12 : 1)) *
                100,
            ) / 100),
      );
    syncSchedule(db, w);
    investment = w;
  } else if (intent.plan === "GIAP") {
    const g: GiapInvestment = {
      id: uid("giap"),
      userId: user.id,
      referenceId: `GIAP-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
      capitalKobo: amountKobo,
      initialInvestment: intent.capital,
      investmentDate: now().slice(0, 10),
      paystackReference: reference,
      propertyId: "",
      linkedPropertyId: null,
      propertyTitle: "Awaiting property allocation",
      propertyLocation: "",
      propertyImage: "",
      ownershipStatus: "Pending allocation",
      currentEvaluation: intent.capital,
      resaleTarget: 0,
      projectedGrossProfit: 0,
      projectedInvestorShare: 0,
      isResaleCompleted: false,
      realizedInvestorProfit: 0,
      status: "FUNDED",
      milestones: [],
      documents: [],
    };
    db.investmentsGiap.push(g);
    investment = g;
  } else {
    const bio = db.biodata.find((b) => b.userId === user.id);
    const w: WealthStreamInvestment = {
      id: uid("wst"),
      userId: user.id,
      referenceId: `WS-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
      capitalKobo: amountKobo,
      principal: intent.capital,
      withdrawalNoticeDays: intent.noticeDays,
      annualRate: intent.annualRate,
      payoutFrequency: intent.frequency,
      payoutAmount: 0,
      startDate: now().slice(0, 10),
      nextPayoutDate: "",
      nextPayoutAmount: 0,
      totalPayoutsReceived: 0,
      paystackReference: reference,
      status: "ACTIVE",
      payoutAccount: {
        bankName: bio?.bankName || "",
        accountNumber: bio?.accountNumber || "",
        accountHolderName: bio?.accountHolderName || user.fullName,
      },
      upcomingPayouts: [],
    };
    db.investmentsWealthStream.push(w);
    db.payoutSchedules.push(
      ...schedule(w, new Date(), w.payoutFrequency === "MONTHLY" ? 12 : 2),
    );
    syncSchedule(db, w);
    investment = w;
  }
  intent.status = "COMPLETED";
  db.transactions.unshift({
    id: uid("txn"),
    userId: user.id,
    reference,
    type: "INVESTMENT_DEPOSIT",
    plan: intent.plan,
    title: intent.topUpId
      ? "WealthStream top-up"
      : `${intent.plan === "GIAP" ? "GIAP" : "WealthStream"} investment`,
    amount: intent.capital,
    direction: "DEBIT",
    date: now().slice(0, 10),
    status: "COMPLETED",
    receiptAvailable: true,
    metadata: { investmentId: investment.id },
  });
  agreement(db, investment);
  notify(
    db,
    user.id,
    intent.topUpId ? "Top-up received" : "Investment funded",
    intent.plan === "GIAP"
      ? "Your payment is confirmed. Finance will assign your property."
      : `Your payout schedule is ready. Next payout: ${"nextPayoutDate" in investment ? investment.nextPayoutDate : ""}.`,
  );
  audit(
    db,
    user,
    "PAYMENT_CONFIRMED",
    user,
    `Payment ${reference}: NGN ${intent.capital}. Investment ${investment.referenceId}.`,
  );
  saveDb(db);
  return { investmentId: investment.id };
}
export function validateIntent(
  user: User,
  body: any,
  preview: boolean,
): Omit<PaymentIntent, "id" | "status" | "createdAt"> {
  const db = getDb(),
    config = { ...defaults, ...db.platformConfig };
  if (
    user.disabled ||
    (!preview && user.kycStatus !== "APPROVED")
  )
    throw Error("Complete verification before investing.");
  if (body.acceptTerms !== true)
    throw Error("Accept the investment terms to continue.");
  const plan = body.plan;
  if (!["GIAP", "WEALTHSTREAM"].includes(plan))
    throw Error("Choose an investment plan.");
  const capital = Number(body.capital),
    min = plan === "GIAP" ? config.giapMin : config.wealthstreamMin,
    max = plan === "GIAP" ? config.giapMax : config.wealthstreamMax;
  if (
    !Number.isFinite(capital) ||
    capital < (body.topUpId ? 1 : min) ||
    capital > max ||
    !Number.isSafeInteger(Math.round(capital * 100)) ||
    Math.abs(capital * 100 - Math.round(capital * 100)) > 0.00001
  )
    throw Error(
      `Enter an amount between NGN ${body.topUpId ? 1 : min} and ${max}.`,
    );
  const active = [...db.investmentsGiap, ...db.investmentsWealthStream].filter(
    (i) =>
      i.userId === user.id &&
      !["CLOSED", "COMPLETED", "EXITED"].includes(i.status),
  );
  if (body.topUpId) {
    const w = db.investmentsWealthStream.find(
      (w) => w.id === body.topUpId && w.userId === user.id,
    );
    if (plan !== "WEALTHSTREAM" || !w || w.status !== "ACTIVE")
      throw Error("Only active WealthStream investments can be topped up.");
    if (
      (db.withdrawals || []).some(
        (r) =>
          r.investmentId === w.id &&
          !["REJECTED", "COMPLETED"].includes(r.status),
      )
    )
      throw Error("A withdrawal is being reviewed for this investment.");
    if (w.principal + capital > max)
      throw Error("Top-up exceeds the plan limit.");
    return {
      userId: user.id,
      plan,
      capital,
      frequency: w.payoutFrequency === "MONTHLY" ? "MONTHLY" : "ANNUALLY",
      annualRate: w.annualRate,
      topUpId: w.id,
      noticeDays: w.withdrawalNoticeDays ?? config.noticeDays,
    };
  }
  if (!config.allowMultipleInvestments && active.length)
    throw Error("Only one active investment is allowed.");
  if (
    !config.allowMultiplePlans &&
    active.some((i) => ("principal" in i ? "WEALTHSTREAM" : "GIAP") !== plan)
  )
    throw Error("Your account can hold one plan type at a time.");
  const frequency = body.payoutFrequency || "MONTHLY";
  if (!["MONTHLY", "ANNUALLY"].includes(frequency))
    throw Error("Choose monthly or annual payouts.");
  return {
    userId: user.id,
    plan,
    capital,
    frequency,
    noticeDays: config.noticeDays,
    annualRate:
      frequency === "MONTHLY" ? config.monthlyRate : config.annualRate,
  };
}
