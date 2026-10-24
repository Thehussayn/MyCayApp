import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
const a = process.env.TEST_URL || "http://127.0.0.1:3110";
const b = process.env.SECOND_TEST_URL || "http://127.0.0.1:3111";
const original = crypto.createHash("sha256").update(fs.readFileSync("data/db.json")).digest("hex");
const jar = new Map();
async function call(base, path, body, status = 200) {
  const response = await fetch(base + path, { method: body === undefined ? "GET" : "POST", headers: { "Content-Type": "application/json", Cookie: [...jar].map(([k,v]) => `${k}=${v}`).join("; ") }, body: body === undefined ? undefined : JSON.stringify(body) });
  const result = await response.json();
  assert.equal(response.status, status, `${path}: ${JSON.stringify(result)}`);
  for (const cookie of response.headers.getSetCookie()) {
    const first = cookie.split(";")[0], equals = first.indexOf("=");
    jar.set(first.slice(0, equals), first.slice(equals + 1));
  }
  return result;
}
const password = "DemoReview2026!";
const email = `demo-${Date.now()}@example.test`;
const registered = await call(a, "/api/auth/register", { fullName: "Demo Reviewer", email, phone: "+2348034567890", country: "Nigeria", password, confirmPassword: password, termsAccepted: true, privacyAccepted: true }, 201);
const id = registered.user.id;
assert.equal((await call(b, "/api/auth/me")).user.id, id, "A separate server instance must read the registered browser workspace");
assert.equal((await call(b, "/api/auth/me")).hostedDemo, true);
assert.equal((await call(b, "/api/auth/me")).preview, true);
await call(a, "/api/portal/biodata", { step: 1, data: { fullName: "Demo Reviewer", city: "Demo City" }, isSaveAndExit: true });
assert.equal((await call(b, "/api/portal/biodata")).biodata.city, "Demo City");
await call(a, "/api/portal/biodata", { step: 7, data: { digitalSignature: "Demo Reviewer", acceptTerms: true, acceptPrivacy: true }, isFinalSubmit: true });
await call(b, "/api/preview", { role: "STAFF" });
assert.ok((await call(a, "/api/admin?section=investors")).investors.some(u => u.id === id));
await call(b, "/api/admin", { action: "REVIEW", userId: id, status: "APPROVED" });
await call(a, "/api/preview", { role: "INVESTOR" });
assert.equal((await call(b, "/api/auth/me")).user.kycStatus, "APPROVED");
for (const plan of ["GIAP", "WEALTHSTREAM"]) {
  const payment = await call(a, "/api/portal/investments/subscribe", { plan, capital: 5000000, payoutFrequency: "MONTHLY", acceptTerms: true });
  assert.equal(payment.preview, true);
  await call(b, "/api/portal/paystack/verify", { reference: payment.reference });
}
const investments = await call(a, "/api/portal/investments");
assert.equal(investments.giap.length, 1);assert.equal(investments.wealthStream.length, 1);
await call(b, "/api/portal/documents", { documentType: "GOVERNMENT_ID" }, 400);
await call(a, "/api/auth/logout", {});
await call(b, "/api/auth/login", { email, password });
assert.equal((await call(a, "/api/auth/me")).user.id, id);
assert.ok([...jar].filter(([k]) => k.startsWith("mycay_demo_state_")).every(([,v]) => v.length <= 3000));
assert.ok([...jar].map(([k,v]) => `${k}=${v}`).join("; ").length < 12000);
const intact = new Map(jar);jar.set("mycay_demo_state_0", "tampered");await call(b, "/api/auth/me", undefined, 401);jar.clear();for(const [k,v] of intact)jar.set(k,v);
assert.equal((await fetch(b + "/api/admin")).status, 403, "A different browser must not inherit demo admin access");
assert.equal(crypto.createHash("sha256").update(fs.readFileSync("data/db.json")).digest("hex"), original);
console.log("PASS: hosted demo registration, cross-instance encrypted state, seven-step KYC, staff approval, role switching, GIAP/WealthStream preview funding, login, cookie tamper rejection, upload restriction and real-database isolation.");
