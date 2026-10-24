import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json(
    { error: "Use the preview workspace to explore the app." },
    { status: 410 },
  );
}
