import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { findUserById, getDb, saveDb } from "@/lib/db";
import { now, uid, validateIntent } from "@/lib/platform/engine";
export async function POST(req: NextRequest) {
  const session = getCurrentSession();
  const user = session && findUserById(session.userId);
  if (!session || !user)
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  try {
    const body = await req.json();
    const validated = validateIntent(user, body, !!session.preview);
    if (!session.preview && !process.env.PAYSTACK_SECRET_KEY)
      return NextResponse.json(
        { error: "Payments are not available yet. Please contact support." },
        { status: 503 },
      );
    const intent = {
      ...validated,
      id: uid("payment"),
      status: "PENDING" as const,
      createdAt: now(),
    };
    const db = getDb();
    db.paymentIntents ??= [];
    db.paymentIntents.push(intent);
    saveDb(db);
    if (session.preview)
      return NextResponse.json({
        preview: true,
        reference: intent.id,
        amount: intent.capital,
        plan: intent.plan,
      });
    const r = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: Math.round(intent.capital * 100),
        currency: "NGN",
        reference: intent.id,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin}/portal/investments?reference=${intent.id}`,
      }),
    });
    const d = await r.json();
    if (!r.ok || !d.status)
      throw Error("Unable to start payment. Please try again.");
    return NextResponse.json({
      authorizationUrl: d.data.authorization_url,
      reference: intent.id,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
