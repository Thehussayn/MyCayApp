import { isHostedDemo } from "@/lib/demo/state";
import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/db";

export async function GET() {
  const session = getCurrentSession();
  if (!session) {
    return NextResponse.json({ authenticated: false, hostedDemo: isHostedDemo() }, { status: 401 });
  }

  const user = findUserById(session.userId);
  if (!user || user.disabled) {
    return NextResponse.json({ authenticated: false, hostedDemo: isHostedDemo() }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    hostedDemo: isHostedDemo(),
    preview: !!session.preview,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      country: user.country,
      role: user.role,
      status: user.status,
      kycStatus: user.kycStatus || "NOT_STARTED",
      mustChangePassword: !!user.mustChangePassword,
      referenceId: user.referenceId,
      createdAt: user.createdAt,
      staffInquiry: user.staffInquiry,
      declineReason: user.declineReason,
    },
  });
}
