import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import {
  findUserById,
  updateUser,
  recordAdditionalInfo,
  recordAuditLog,
} from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = findUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.kycStatus !== "INFO_REQUESTED") {
      return NextResponse.json(
        {
          error:
            "Additional information is not currently requested for this account.",
        },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { response } = body;

    if (
      !response ||
      typeof response !== "string" ||
      response.trim().length < 5
    ) {
      return NextResponse.json(
        {
          error:
            "Please provide a clear and detailed explanation to address the inquiry.",
        },
        { status: 400 },
      );
    }

    // Record submission
    recordAdditionalInfo({
      userId: user.id,
      staffQuestion: user.staffInquiry || "Clarification requested",
      userResponse: response.trim(),
    });

    // Return submitted KYC to staff review without restricting portal access
    const updated = updateUser(user.id, {
      status: "APPROVED",
      kycStatus: "SUBMITTED",
      staffInquiry: undefined,
    })!;

    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    recordAuditLog({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      targetUserId: user.id,
      targetUserEmail: user.email,
      action: "RESUBMIT_INFO",
      beforeStatus: "INFO_REQUESTED",
      afterStatus: "SUBMITTED",
      notes: `Investor submitted requested clarification: "${response.trim().slice(0, 100)}..."`,
      ipAddress: ip,
    });

    return NextResponse.json({
      success: true,
      message:
        "Information submitted successfully. Your KYC has returned to staff review.",
      status: updated.status,
    });
  } catch (err: any) {
    console.error("Resubmit info error:", err);
    return NextResponse.json(
      { error: "Unable to submit response. Please try again." },
      { status: 500 },
    );
  }
}
