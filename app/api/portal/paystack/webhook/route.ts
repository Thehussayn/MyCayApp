import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { completePayment } from "@/lib/platform/engine";
export async function POST(req: NextRequest) {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key)
    return NextResponse.json(
      { error: "Payments are unavailable." },
      { status: 503 },
    );
  const raw = await req.text(),
    signature = req.headers.get("x-paystack-signature") || "",
    expected = crypto.createHmac("sha512", key).update(raw).digest("hex");
  if (
    signature.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  )
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  try {
    const event = JSON.parse(raw);
    if (event.event === "charge.success")
      completePayment(
        event.data.reference,
        event.data.amount,
        event.data.currency,
      );
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to process event." },
      { status: 400 },
    );
  }
}
