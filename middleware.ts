import { NextResponse, NextRequest } from "next/server";
async function decode(token: string) {
  try {
    if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET)
      return null;
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;
    const bytes = (s: string) =>
      Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) =>
        c.charCodeAt(0),
      );
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(
        process.env.SESSION_SECRET || "development-only-my-cay-app-session-key",
      ),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    if (
      !(await crypto.subtle.verify(
        "HMAC",
        key,
        bytes(signature),
        new TextEncoder().encode(payload),
      ))
    )
      return null;
    const session = JSON.parse(new TextDecoder().decode(bytes(payload)));
    if (session.exp <= Date.now() / 1000) return null;
    if (
      session.preview &&
      process.env.NODE_ENV === "production" &&
      process.env.ENABLE_PREVIEW !== "true"
    )
      return null;
    return session;
  } catch {
    return null;
  }
}
export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname,
    token = req.cookies.get("mycayapp_session")?.value,
    session = token ? await decode(token) : null;
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/staff") ||
    pathname.startsWith("/portal")
  ) {
    if (!session) {
      const url = new URL("/login", req.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    if (
      (pathname.startsWith("/admin") || pathname.startsWith("/staff")) &&
      !["STAFF", "FINANCE", "ADMIN", "SUPER_ADMIN"].includes(session.role)
    )
      return NextResponse.redirect(new URL("/portal/dashboard", req.url));

  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/portal/:path*", "/admin/:path*", "/staff/:path*"],
};
