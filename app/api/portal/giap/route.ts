import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const giapList = db.investmentsGiap.filter(
    (i) => i.userId === session.userId,
  );

  return NextResponse.json({
    investments: giapList,
    modelRules: {
      profitShareInvestor: 0.7,
      profitShareCompany: 0.3,
      modelDescription:
        "70% investor profit share upon completed strategic resale. Profit share is only realized once an actual resale transaction is completed.",
      typicalTimelineMonths: "18–36 months",
    },
  });
}
