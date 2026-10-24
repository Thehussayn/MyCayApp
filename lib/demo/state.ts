import crypto from "crypto";
import { deflateRawSync, inflateRawSync } from "zlib";
import { cookies } from "next/headers";
import type { DatabaseSchema } from "@/lib/db/types";

export const isHostedDemo = () => process.env.DEMO_MODE === "true";
const PREFIX = "mycay_demo_state_";
const CHUNKS = 3;
const CHUNK_SIZE = 3000;
const MAX_AGE = 7200;
function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw Error("Set SESSION_SECRET before enabling hosted demo mode.");
  return crypto.createHash("sha256").update(`mycay-demo-v1:${secret}`).digest();
}

// Demo state travels with the browser, so separate serverless instances can read it.
// This adapter is opt-in and must never be used for durable investor records.
export function readDemoState(): DatabaseSchema | null {
  const jar = cookies();
  const value = Array.from({ length: CHUNKS }, (_, i) => jar.get(PREFIX + i)?.value || "").join("");
  if (!value) return null;
  try {
    const bytes = Buffer.from(value, "base64url");
    const decipher = crypto.createDecipheriv("aes-256-gcm", key(), bytes.subarray(0, 12));
    decipher.setAuthTag(bytes.subarray(12, 28));
    const compressed = Buffer.concat([decipher.update(bytes.subarray(28)), decipher.final()]);
    const payload = JSON.parse(inflateRawSync(compressed, { maxOutputLength: 512 * 1024 }).toString("utf8"));
    if (payload.version !== 1 || payload.expires <= Date.now() || !Array.isArray(payload.db?.users)) return null;
    return payload.db;
  } catch {
    return null;
  }
}

export function writeDemoState(db: DatabaseSchema) {
  const compressed = deflateRawSync(Buffer.from(JSON.stringify({ version: 1, expires: Date.now() + MAX_AGE * 1000, db })));
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const ciphertext = Buffer.concat([cipher.update(compressed), cipher.final()]);
  const value = Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString("base64url");
  if (value.length > CHUNKS * CHUNK_SIZE)
    throw Error("This demo workspace is full. Large uploads are not supported in demo mode. Start a fresh browser session to reset it.");
  const jar = cookies();
  for (let i = 0; i < CHUNKS; i++) {
    const part = value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    jar.set(PREFIX + i, part, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: part ? MAX_AGE : 0 });
  }
}
