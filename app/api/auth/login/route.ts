import crypto from "crypto";
import { POST as openPreview } from "@/app/api/preview/route";
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD, isDemoLoginEnabled } from "@/lib/demo/access";
import { isHostedDemo } from "@/lib/demo/state";
import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, updateUser, recordAuditLog } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { signSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    // Public demo access uses the existing isolated preview workspace only.
    if (typeof email === "string" && email.trim().toLowerCase() === DEMO_ADMIN_EMAIL) {
      if (!isDemoLoginEnabled() || password !== DEMO_ADMIN_PASSWORD) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }
      return openPreview(new NextRequest(req.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "SUPER_ADMIN" }),
      }));
    }

    const user = findUserByEmail(email);
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    if (!user || user.disabled) {
      // Avoid revealing whether the account exists
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    // Check lockout
    const now = new Date();
    if (user.lockUntil && new Date(user.lockUntil) > now) {
      const remainingMinutes = Math.ceil(
        (new Date(user.lockUntil).getTime() - now.getTime()) / 60000,
      );
      return NextResponse.json(
        {
          error: `Account temporarily locked due to multiple failed login attempts. Please try again in ${remainingMinutes} minute(s) or reset your password.`,
        },
        { status: 423 },
      );
    }

    // Verify password
    const isValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      const attempts = (user.failedLoginAttempts || 0) + 1;
      const updates: any = { failedLoginAttempts: attempts };

      if (attempts >= MAX_FAILED_ATTEMPTS) {
        const lockUntil = new Date(
          Date.now() + LOCKOUT_MINUTES * 60 * 1000,
        ).toISOString();
        updates.lockUntil = lockUntil;

        recordAuditLog({
          actorId: user.id,
          actorEmail: user.email,
          actorRole: user.role,
          targetUserId: user.id,
          targetUserEmail: user.email,
          action: "LOGIN_LOCKOUT",
          notes: `Account locked for ${LOCKOUT_MINUTES} minutes after ${attempts} consecutive failed attempts.`,
          ipAddress: ip,
        });

        updateUser(user.id, updates);
        return NextResponse.json(
          {
            error: `Maximum login attempts exceeded. Account is locked for ${LOCKOUT_MINUTES} minutes for your security.`,
          },
          { status: 423 },
        );
      }

      updateUser(user.id, updates);
      const remaining = MAX_FAILED_ATTEMPTS - attempts;
      return NextResponse.json(
        {
          error: `Invalid email or password. ${remaining} attempt(s) remaining before temporary lockout.`,
        },
        { status: 401 },
      );
    }

    // Reset failed attempts on success
    const updatedUser = updateUser(user.id, {
      failedLoginAttempts: 0,
      lockUntil: undefined,
      lastLoginAt: new Date().toISOString(),
    })!;

    // Log success
    recordAuditLog({
      actorId: updatedUser.id,
      actorEmail: updatedUser.email,
      actorRole: updatedUser.role,
      targetUserId: updatedUser.id,
      targetUserEmail: updatedUser.email,
      action: "LOGIN_SUCCESS",
      notes: "Investor authenticated successfully.",
      ipAddress: ip,
    });

    // Create session token
    const token = signSession(updatedUser, 7200, isHostedDemo(), isHostedDemo() ? crypto.randomUUID() : undefined);

    const response = NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        country: updatedUser.country,
        role: updatedUser.role,
        mustChangePassword: !!updatedUser.mustChangePassword,
        status: updatedUser.status,
        kycStatus: updatedUser.kycStatus || "NOT_STARTED",
        referenceId: updatedUser.referenceId,
      },
    });

    // Set secure cookie
    const isProduction = process.env.NODE_ENV === "production";
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 7200, // 2 hours
    });

    return response;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 },
    );
  }
}
