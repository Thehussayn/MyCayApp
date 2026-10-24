import { NextResponse } from "next/server";
import { operator } from "@/lib/platform/access";
import { getDb } from "@/lib/db";
import { pdf } from "@/lib/platform/pdf";
export function GET() {
  if (!operator("finance"))
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  const db = getDb();
  const all = [...db.investmentsGiap, ...db.investmentsWealthStream];
  return new NextResponse(
    pdf("Investment report", [
      `Generated ${new Date().toISOString().slice(0, 10)}`,
      `Capital under management: NGN ${all
        .filter((i) => !["CLOSED", "COMPLETED", "EXITED"].includes(i.status))
        .reduce((s, i) => s + i.capitalKobo / 100, 0)
        .toLocaleString()}`,
      "",
      ...all.map(
        (i) =>
          `${i.referenceId} | ${db.users.find((u) => u.id === i.userId)?.fullName} | NGN ${(i.capitalKobo / 100).toLocaleString()} | ${i.status}`,
      ),
      "",
      "Completed payments:",
      ...db.transactions
        .filter((t) => t.direction === "CREDIT")
        .map(
          (t) =>
            `${t.date} | ${t.reference} | NGN ${t.amount.toLocaleString()} | ${t.type}`,
        ),
    ]),
    {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=investment-report.pdf",
        "Cache-Control": "private, no-store",
      },
    },
  );
}
