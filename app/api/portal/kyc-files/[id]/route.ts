import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { operator } from "@/lib/platform/access";
export function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = getCurrentSession();
  if (!session)
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const doc = getDb().kycDocuments.find((d) => d.id === params.id);
  if (!doc || (doc.userId !== session.userId && !operator("review")))
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  const match =
    /^data:(application\/pdf|image\/jpeg|image\/png);base64,([A-Za-z0-9+/=]+)$/.exec(
      doc.fileUrl,
    );
  if (!match)
    return NextResponse.json(
      { error: "File unavailable. Please upload it again." },
      { status: 404 },
    );
  return new NextResponse(Buffer.from(match[2], "base64"), {
    headers: {
      "Content-Type": match[1],
      "Content-Disposition": "inline",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
