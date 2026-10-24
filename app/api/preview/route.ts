import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getInitialDb, getDb, saveDb } from "@/lib/db";
import { isHostedDemo } from "@/lib/demo/state";
import {
  getCurrentSession,
  signSession,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/session";
import { User, UserRole } from "@/lib/db/types";
export async function POST(req: NextRequest) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_PREVIEW !== "true" && !isHostedDemo()
  )
    return NextResponse.json(
      { error: "Preview is disabled." },
      { status: 404 },
    );
  const { role = "INVESTOR" } = await req.json();
  if (!["INVESTOR", "STAFF", "FINANCE", "ADMIN", "SUPER_ADMIN"].includes(role))
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  const previous = getCurrentSession();
  const workspace = previous?.preview
    ? previous.workspace!
    : crypto.randomUUID();
  const filename = path.join(
    process.cwd(),
    "data",
    `preview-${workspace}.json`,
  );
  let db;
  if (isHostedDemo()) {
    db = getDb();
  } else if (fs.existsSync(filename))
    db = JSON.parse(fs.readFileSync(filename, "utf8"));
  else {
    db = getInitialDb();
    db.users = [];
    db.auditLogs = [];
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    fs.writeFileSync(filename, JSON.stringify(db, null, 2));
  }
    for (const r of [
      "INVESTOR",
      "STAFF",
      "FINANCE",
      "ADMIN",
      "SUPER_ADMIN",
    ] as UserRole[]) {
      if (db.users.some((u: User) => u.role === r)) continue;
      const user: User = {
        id: `preview_${r}`,
        fullName:
          r === "INVESTOR"
            ? "Alex Morgan"
            : `${r.replaceAll("_", " ").toLowerCase()} preview`,
        email: `${r.toLowerCase()}@preview.invalid`,
        phone: "",
        country: "Nigeria",
        role: r,
        status: "APPROVED",
        kycStatus: r === "INVESTOR" ? "NOT_STARTED" : "APPROVED",
        passwordHash: "",
        salt: "",
        termsAccepted: true,
        privacyAccepted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        failedLoginAttempts: 0,
        referenceId: `PREVIEW-${r}`,
      };
      db.users.push(user);
    }
  if (isHostedDemo()) saveDb(db);
  else fs.writeFileSync(filename, JSON.stringify(db, null, 2));
  const user = db.users.find((u: User) => u.role === role)!;
  const response = NextResponse.json({
    redirect: role === "INVESTOR" ? "/portal/dashboard" : "/admin",
  });
  response.cookies.set(
    SESSION_COOKIE_NAME,
    signSession(user, 7200, true, workspace),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7200,
    },
  );
  return response;
}
