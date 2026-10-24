import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { completePayment } from "@/lib/platform/engine";
export async function POST(req: NextRequest) {
  const session = getCurrentSession();
  if (!session)
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  try {
    const { reference } = await req.json();
    const intent = getDb().paymentIntents?.find(
      (p) => p.id === reference && p.userId === session.userId,
    );
    if (!intent)
      return NextResponse.json(
        { error: "Payment not found." },
        { status: 404 },
      );
    if (session.preview)
      return NextResponse.json({
        success: true,
        ...completePayment(reference, Math.round(intent.capital * 100), "NGN"),
      });
    if (!process.env.PAYSTACK_SECRET_KEY)
      return NextResponse.json(
        { error: "Payments are unavailable." },
        { status: 503 },
      );
    const r = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
        cache: "no-store",
      },
    );
    const d = await r.json();
    if (!r.ok || d.data?.status !== "success")
      throw Error("Payment has not been confirmed yet. You can retry.");
    return NextResponse.json({
      success: true,
      ...completePayment(reference, d.data.amount, d.data.currency),
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
