import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getInvestorTransactions } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "ALL";
  const status = searchParams.get("status") || "ALL";
  const search = searchParams.get("search") || "";

  const txns = getInvestorTransactions(session.userId, {
    type,
    status,
    search,
  });

  return NextResponse.json({
    transactions: txns,
    count: txns.length,
  });
}
