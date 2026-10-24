import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { getDb, saveDb } from "@/lib/db";
import { audit, notify, uid, now } from "@/lib/platform/engine";
export function GET() {
  const session = getCurrentSession();
  if (!session)
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  return NextResponse.json({
    withdrawals: (getDb().withdrawals || []).filter(
      (w) => w.userId === session.userId,
    ),
  });
}
export async function POST(req: NextRequest) {
  const session = getCurrentSession();
  if (!session)
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  try {
    const body = await req.json(),
      db = getDb(),
      user = db.users.find((u) => u.id === session.userId);
    if (!user || user.disabled) throw Error("Account unavailable.");
    db.withdrawals ??= [];
    if (body.action === "REPLY") {
      const w = db.withdrawals.find(
        (w) => w.id === body.withdrawalId && w.userId === user.id,
      );
      if (!w || w.status !== "PENDING_INFORMATION" || !body.note?.trim())
        throw Error("A reply is required.");
      w.note = body.note.trim();
      w.status = "PENDING_REVIEW";
      audit(
        db,
        user,
        "WITHDRAWAL_REQUESTED",
        user,
        `Withdrawal clarification: ${w.note}`,
      );
      saveDb(db);
      return NextResponse.json({ success: true });
    }
    const w = db.investmentsWealthStream.find(
      (w) => w.id === body.investmentId && w.userId === user.id,
    );
    if (!w || w.status !== "ACTIVE")
      throw Error("Only active WealthStream investments can be withdrawn.");
    if (body.acceptTerms !== true || !body.reason?.trim())
      throw Error("Select a reason and accept the withdrawal terms.");
    if (
      db.withdrawals.some(
        (r) =>
          r.investmentId === w.id &&
          !["REJECTED", "COMPLETED"].includes(r.status),
      )
    )
      throw Error("A withdrawal request already exists.");
    db.withdrawals.push({
      id: uid("wd"),
      userId: user.id,
      investmentId: w.id,
      principal: w.principal,
      reason: body.reason.trim(),
      note: body.note?.trim() || "",
      status: "PENDING_REVIEW",
      requestedAt: now(),
    });
    audit(
      db,
      user,
      "WITHDRAWAL_REQUESTED",
      user,
      `Requested full principal withdrawal for ${w.referenceId}.`,
    );
    notify(
      db,
      user.id,
      "Withdrawal requested",
      "Finance will review your request.",
      `/portal/investments/${w.id}`,
    );
    saveDb(db);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
