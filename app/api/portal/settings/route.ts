import { NextRequest, NextResponse } from "next/server";
import {
  getSession,
  signSession,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/session";
import {
  getInvestorSettings,
  updateInvestorSettings,
  findUserById,
  updateUserPassword,
  updateUser,
} from "@/lib/db";
import { verifyPassword, isPasswordValid } from "@/lib/auth/password";
export function GET() {
  const session = getSession();
  if (!session)
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  return NextResponse.json({ settings: getInvestorSettings(session.userId) });
}
export async function PATCH(req: NextRequest) {
  const session = getSession();
  if (!session)
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const body = await req.json();
  if (body.action === "PREFERENCES") {
    const p = body.preferences;
    const valid = ["emailAlerts", "smsAlerts", "quarterlyDigest"];
    if (!p || valid.some((k) => typeof p[k] !== "boolean"))
      return NextResponse.json(
        { error: "Invalid preferences." },
        { status: 400 },
      );
    return NextResponse.json({
      settings: updateInvestorSettings(session.userId, {
        emailAlerts: p.emailAlerts,
        smsAlerts: p.smsAlerts,
        quarterlyDigest: p.quarterlyDigest,
      }),
    });
  }
  if (body.action === "PASSWORD") {
    const user = findUserById(session.userId)!;
    const { currentPassword, newPassword } = body.passwordChange || {};
    if (!isPasswordValid(newPassword || ""))
      return NextResponse.json(
        {
          error:
            "Use at least 8 characters, an uppercase letter, a number, and a special character.",
        },
        { status: 400 },
      );
    if (!verifyPassword(currentPassword || "", user.passwordHash, user.salt))
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 },
      );
    updateUserPassword(user.id, newPassword);
    const updated = updateUser(user.id, { mustChangePassword: false })!;
    const response = NextResponse.json({ success: true });
    response.cookies.set(
      SESSION_COOKIE_NAME,
      signSession(updated, 7200, session.preview, session.workspace),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7200,
      },
    );
    return response;
  }
  return NextResponse.json({ error: "Invalid action." }, { status: 400 });
}
