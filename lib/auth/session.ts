import crypto from "crypto";
import { findUserById } from "@/lib/db";
import { cookies } from "next/headers";
import { UserRole, AccountStatus, KycStatus, User } from "@/lib/db/types";

const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  (process.env.NODE_ENV !== "production"
    ? "development-only-my-cay-app-session-key"
    : "");
export const SESSION_COOKIE_NAME = "mycayapp_session";

export interface SessionPayload {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: AccountStatus;
  kycStatus?: KycStatus;
  referenceId: string;
  credentialVersion?: string;
  preview?: boolean;
  workspace?: string;
  exp: number; // unix timestamp in seconds
}

export function signSession(
  user: User,
  durationSeconds = 7200,
  preview = false,
  workspace?: string,
): string {
  if (!SESSION_SECRET) throw new Error("Set SESSION_SECRET before signing in.");
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    status: user.status,
    kycStatus: user.kycStatus || "NOT_STARTED",
    referenceId: user.referenceId,
    credentialVersion: crypto
      .createHash("sha256")
      .update(user.passwordHash)
      .digest("hex")
      .slice(0, 16),
    preview,
    workspace,
    exp: Math.floor(Date.now() / 1000) + durationSeconds,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString(
    "base64url",
  );
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    if (!SESSION_SECRET) return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payloadBase64, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(payloadBase64)
      .digest("base64url");

    if (
      signature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature),
      )
    ) {
      return null;
    }

    const payloadJson = Buffer.from(payloadBase64, "base64url").toString(
      "utf8",
    );
    const payload = JSON.parse(payloadJson) as SessionPayload;

    const now = Math.floor(Date.now() / 1000);
    if (now > payload.exp) {
      return null;
    }

    if (
      payload.preview &&
      process.env.NODE_ENV === "production" &&
      process.env.ENABLE_PREVIEW !== "true"
    )
      return null;
    return payload;
  } catch {
    return null;
  }
}

export function readSessionToken(): SessionPayload | null {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export function getCurrentSession(): SessionPayload | null {
  const payload = readSessionToken();
  if (!payload) return null;
  const user = findUserById(payload.userId);
  if (
    !user ||
    user.disabled ||
    payload.credentialVersion !==
      crypto
        .createHash("sha256")
        .update(user.passwordHash)
        .digest("hex")
        .slice(0, 16)
  )
    return null;
  return {
    ...payload,
    role: user.role,
    status: user.status,
    kycStatus: user.kycStatus,
  };
}
export const getSession = getCurrentSession;
export const getSessionFromCookie = getCurrentSession;
