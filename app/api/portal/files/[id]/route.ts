import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { operator } from "@/lib/platform/access";
import { getConfig } from "@/lib/platform/config";
import { pdf } from "@/lib/platform/pdf";
export function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = getCurrentSession();
  if (!session)
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const db = getDb();
  const doc = db.portalDocuments.find((d) => d.id === params.id);
  const txn = db.transactions.find((t) => t.id === params.id);
  const userId = doc?.userId || txn?.userId;
  if (!userId || (userId !== session.userId && !operator("finance")))
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  const user = db.users.find((u) => u.id === userId)!;
  let title = doc?.name || "Transaction receipt";
  const lines = [
    "Jeje-Ola Properties Nig. Ltd.",
    `Investor: ${user.fullName}`,
    `Reference: ${user.referenceId}`,
    `Generated: ${new Date().toISOString().slice(0, 10)}`,
    "",
  ];
  if (txn)
    lines.push(
      `Transaction: ${txn.reference}`,
      `Date: ${txn.date}`,
      `Plan: ${txn.plan}`,
      `Description: ${txn.title}`,
      `Amount: NGN ${txn.amount.toLocaleString()}`,
      `Status: ${txn.status}`,
    );
  else {
    const i = [...db.investmentsGiap, ...db.investmentsWealthStream].find((i) =>
      doc!.name.includes(i.referenceId),
    );
    if (!i)
      return NextResponse.json(
        { error: "Document source unavailable." },
        { status: 404 },
      );
    lines.push(
      `Investment: ${i.referenceId}`,
      `Capital: NGN ${(i.capitalKobo / 100).toLocaleString()}`,
      `Status: ${i.status}`,
    );
    const bio = db.biodata.find((b) => b.userId === userId);
    if (bio)
      lines.push(
        `Address: ${bio.residentialAddress}, ${bio.city}`,
        `Digital signature: ${bio.digitalSignature || "Not provided"}`,
        `Signature date: ${bio.signatureDate || "Not provided"}`,
      );
    if ("initialInvestment" in i)
      lines.push(
        "Plan: Global Investor Advantage Plan (GIAP)",
        "Profit split: 70% investor / 30% Jeje-Ola on resale.",
        `Linked property: ${i.linkedPropertyId ? i.propertyTitle : "TO BE ASSIGNED BY FINANCE TEAM"}`,
        `Location: ${i.propertyLocation || "Pending assignment"}`,
        "Exit occurs on property resale.",
      );
    else {
      lines.push(
        "Plan: WealthStream",
        `Annual return: ${i.annualRate * 100}%`,
        `Frequency: ${i.payoutFrequency}`,
        `Withdrawal: ${i.withdrawalNoticeDays ?? getConfig().noticeDays} days from approval; no ROI accrues during notice.`,
        "Full principal is returned at the end of the notice period.",
        "",
        "Payout schedule: Date | Amount (NGN) | Status",
      );
      db.payoutSchedules
        .filter((p) => p.investmentId === i.id)
        .forEach((p) =>
          lines.push(
            `${p.payoutDate} | ${p.amount.toLocaleString()} | ${p.status}`,
          ),
        );
    }
  }
  return new NextResponse(pdf(title, lines), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${txn ? "receipt" : "agreement"}-${params.id.replace(/[^a-zA-Z0-9_-]/g, "")}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
