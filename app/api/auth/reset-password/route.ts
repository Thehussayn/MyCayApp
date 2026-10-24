import { NextRequest, NextResponse } from "next/server";
import {
  verifyPasswordResetToken,
  markTokenUsed,
  updateUser,
  recordAuditLog,
  findUserById,
} from "@/lib/db";
import { hashPassword, isPasswordValid } from "@/lib/auth/password";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { valid: false, reason: "Missing reset token." },
      { status: 400 },
    );
  }

  const result = verifyPasswordResetToken(token);
  if (!result.valid) {
    return NextResponse.json(
      { valid: false, reason: result.reason },
      { status: 400 },
    );
  }

  return NextResponse.json({ valid: true });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password, confirmPassword } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Missing or invalid reset token." },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match." },
        { status: 400 },
      );
    }

    if (!isPasswordValid(password)) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.",
        },
        { status: 400 },
      );
    }

    const verification = verifyPasswordResetToken(token);
    if (!verification.valid || !verification.userId || !verification.recordId) {
      return NextResponse.json(
        {
          error:
            verification.reason || "Reset token has expired or is invalid.",
        },
        { status: 400 },
      );
    }

    const user = findUserById(verification.userId);
    if (!user) {
      return NextResponse.json(
        { error: "User account not found." },
        { status: 404 },
      );
    }

    // Hash new password
    const { hash, salt } = hashPassword(password);
    updateUser(user.id, {
      passwordHash: hash,
      salt,
      failedLoginAttempts: 0,
      lockUntil: undefined,
    });

    // Mark token as used
    markTokenUsed(verification.recordId);

    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    recordAuditLog({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      targetUserId: user.id,
      targetUserEmail: user.email,
      action: "PASSWORD_RESET_SUCCESS",
      notes: "Password reset completed successfully via one-time secure link.",
      ipAddress: ip,
    });

    return NextResponse.json({
      success: true,
      message:
        "Your password has been successfully reset. You can now sign in.",
    });
  } catch (err: any) {
    console.error("Reset password error:", err);
    return NextResponse.json(
      { error: "Unable to reset password. Please try again." },
      { status: 500 },
    );
  }
}
