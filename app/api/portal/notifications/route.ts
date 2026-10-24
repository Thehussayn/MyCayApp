import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
  getInvestorNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { notifications, unreadCount } = getInvestorNotifications(
    session.userId,
  );

  return NextResponse.json({
    notifications,
    unreadCount,
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { notificationId, markAll } = body;

  if (markAll) {
    const count = markAllNotificationsAsRead(session.userId);
    return NextResponse.json({ success: true, markedCount: count });
  }

  if (notificationId) {
    const success = markNotificationAsRead(session.userId, notificationId);
    return NextResponse.json({ success });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
