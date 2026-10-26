import { NextResponse } from "next/server";
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD, isDemoLoginEnabled } from "@/lib/demo/access";

export const dynamic = "force-dynamic";
export function GET() {
  if (!isDemoLoginEnabled()) return NextResponse.json({ enabled: false });
  return NextResponse.json({
    enabled: true,
    email: DEMO_ADMIN_EMAIL,
    password: DEMO_ADMIN_PASSWORD,
  }, { headers: { "Cache-Control": "no-store" } });
}
