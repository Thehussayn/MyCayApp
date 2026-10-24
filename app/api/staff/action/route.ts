import { NextResponse } from "next/server";
export function GET() {
  return NextResponse.json(
    { error: "Use the operations workspace." },
    { status: 410 },
  );
}
export function POST() {
  return NextResponse.json(
    { error: "Use the operations workspace." },
    { status: 410 },
  );
}
