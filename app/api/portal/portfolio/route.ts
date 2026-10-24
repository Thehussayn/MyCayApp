import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
  getInvestorPortfolio,
  findUserById,
  getBiodataByUserId,
} from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = findUserById(session.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const biodata = getBiodataByUserId(user.id);
  const portfolio = getInvestorPortfolio(user.id);

  // Status awareness milestones
  const milestones = {
    accountApproved: user.status === "APPROVED",
    biodataSubmitted: !!biodata?.isSubmitted,
    kycApproved: user.kycStatus === "APPROVED",
    kycStatus: user.kycStatus || "NOT_STARTED",
  };

  const isFullyOnboarded =
    milestones.accountApproved &&
    milestones.biodataSubmitted &&
    milestones.kycApproved;

  return NextResponse.json({
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      referenceId: user.referenceId,
      status: user.status,
      kycStatus: user.kycStatus,
    },
    milestones,
    isFullyOnboarded,
    portfolio: {
      totalInvested: portfolio.totalInvested,
      currentPortfolioValue: portfolio.currentPortfolioValue,
      totalPayoutsReceived: portfolio.totalPayoutsReceived,
      activeInvestmentsCount: portfolio.activeInvestmentsCount,
      giapInvestments: portfolio.giapInvestments,
      wealthStreamInvestments: portfolio.wealthStreamInvestments,
    },
  });
}
