import { NextRequest, NextResponse } from "next/server";
import {
  findUserByEmail,
  createPasswordResetToken,
  recordAuditLog,
} from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 },
      );
    }

    const user = findUserByEmail(email);
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    if (user) {
      const { token } = createPasswordResetToken(user.id);
      await sendPasswordResetEmail(user.email, user.fullName, token);

      recordAuditLog({
        actorId: user.id,
        actorEmail: user.email,
        actorRole: user.role,
        targetUserId: user.id,
        targetUserEmail: user.email,
        action: "PASSWORD_RESET_REQUEST",
        notes: "Single-use 1-hour password reset link requested.",
        ipAddress: ip,
      });
    }

    // Always respond with a generic success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message:
        "If an account with that email address exists, password reset instructions have been sent to your inbox.",
    });
  } catch (err: any) {
    console.error("Forgot password error:", err);
    return NextResponse.json(
      { error: "Unable to process password reset request." },
      { status: 500 },
    );
  }
}
