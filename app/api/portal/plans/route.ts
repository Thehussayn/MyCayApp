import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/db";
import { getConfig } from "@/lib/platform/config";
export function GET() {
  const session = getCurrentSession();
  const user = session && findUserById(session.userId);
  if (!session || !user)
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  return NextResponse.json({
    config: getConfig(),
    kycStatus: user.kycStatus || "NOT_STARTED",
    preview: !!session.preview,
  });
}
