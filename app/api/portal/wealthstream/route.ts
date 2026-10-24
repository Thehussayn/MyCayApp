import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getConfig } from "@/lib/platform/config";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const wstList = db.investmentsWealthStream.filter(
    (i) => i.userId === session.userId,
  );

  return NextResponse.json({
    investments: wstList,
    modelRules: {
      annualLumpSumRate: getConfig().annualRate,
      monthlyDividendRate: getConfig().monthlyRate,
      exitNoticePeriodDays: getConfig().noticeDays,
    },
  });
}
