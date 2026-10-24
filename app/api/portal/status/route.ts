import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/db";

export async function GET() {
  const session = getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = findUserById(session.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      country: user.country,
      role: user.role,
      status: user.status,
      referenceId: user.referenceId,
      createdAt: user.createdAt,
      staffInquiry: user.staffInquiry,
      declineReason: user.declineReason,
    },
  });
}
