import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getInvestorInvestments } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const plan = searchParams.get("plan"); // ALL, GIAP, WEALTHSTREAM
  const status = searchParams.get("status"); // ALL, ACTIVE, COMPLETED

  const { giap, wealthStream } = getInvestorInvestments(session.userId);

  let filteredGiap = giap;
  let filteredWst = wealthStream;

  if (plan === "GIAP") {
    filteredWst = [];
  } else if (plan === "WEALTHSTREAM") {
    filteredGiap = [];
  }

  if (status && status !== "ALL") {
    filteredGiap = filteredGiap.filter((i) => i.status === status);
    filteredWst = filteredWst.filter((i) => i.status === status);
  }

  return NextResponse.json({
    giap: filteredGiap,
    wealthStream: filteredWst,
    totalCount: filteredGiap.length + filteredWst.length,
  });
}
