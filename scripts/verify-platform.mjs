import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
const base = process.env.TEST_URL || "http://127.0.0.1:3100";
const before = crypto
  .createHash("sha256")
  .update(fs.readFileSync("data/db.json"))
  .digest("hex");
let cookie = "";
async function call(url, body, expected = 200, authenticated = true) {
  const r = await fetch(base + url, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(authenticated && cookie ? { Cookie: cookie } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (authenticated && r.headers.get("set-cookie"))
    cookie = r.headers.get("set-cookie").split(";")[0];
  const text = await r.text();
  let d;
  try {
    d = JSON.parse(text);
  } catch {
    d = text;
  }
  assert.equal(r.status, expected, `${url}: ${r.status} ${text.slice(0, 200)}`);
  return d;
}
await call("/api/admin", undefined, 403, false);
assert.equal(
  (await fetch(base + "/preview")).status,
  200,
  "Preview entry should be available when enabled",
);
await call("/api/preview", { role: "INVESTOR" });
assert.equal((await call("/api/auth/me")).preview, true);
await call("/api/admin", undefined, 403);
const config = (await call("/api/portal/plans")).config;
await call("/api/portal/documents?userId=preview_SUPER_ADMIN", undefined, 403);
await call("/api/portal/biodata", {
  step: 1,
  data: { userId: "somebody-else", id: "bad", fullName: "Alex Morgan" },
  isSaveAndExit: true,
});
const bio = await call("/api/portal/biodata");
assert.equal(bio.biodata.userId, "preview_INVESTOR");
assert.notEqual(bio.biodata.id, "bad");
const image = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+i7bkAAAAASUVORK5CYII=",
  "base64",
);
await call("/api/portal/documents", {
  documentType: "GOVERNMENT_ID",
  fileName: "identity.png",
  fileSize: image.length,
  mimeType: "image/png",
  fileUrl: "data:image/png;base64," + image.toString("base64"),
});
await call(
  "/api/portal/documents",
  {
    documentType: "SPECIMEN_SIGNATURE",
    fileName: "fake.png",
    fileSize: 3,
    mimeType: "image/png",
    fileUrl: "data:image/png;base64,YWJj",
  },
  400,
);

const body = { plan: "GIAP", capital: 5000000, acceptTerms: true };
await call(
  "/api/portal/investments/subscribe",
  { ...body, acceptTerms: false },
  400,
);
await call("/api/portal/investments/subscribe", { ...body, capital: -10 }, 400);
await call(
  "/api/portal/investments/subscribe",
  { ...body, capital: Infinity },
  400,
);
let intent = await call("/api/portal/investments/subscribe", body);
const g = await call("/api/portal/paystack/verify", {
  reference: intent.reference,
});
assert.ok(g.investmentId);
await call("/api/portal/paystack/verify", { reference: intent.reference });
let data = await call("/api/portal/investments");
assert.equal(data.giap.length, 1);
assert.equal(data.giap[0].status, "FUNDED");
assert.equal(data.giap[0].linkedPropertyId, null);
intent = await call("/api/portal/investments/subscribe", {
  plan: "WEALTHSTREAM",
  capital: 10000000,
  payoutFrequency: "MONTHLY",
  annualRate: 9,
  acceptTerms: true,
});
const w = await call("/api/portal/paystack/verify", {
  reference: intent.reference,
});
data = await call("/api/portal/investments");
let ws = data.wealthStream[0];
assert.equal(ws.annualRate, config.monthlyRate);
assert.equal(ws.payoutSchedule.length, 12);
assert.equal(ws.payoutSchedule[0].amount, 200000);
const initial = ws.payoutSchedule[0].amount;
intent = await call("/api/portal/investments/subscribe", {
  plan: "WEALTHSTREAM",
  capital: 2000000,
  topUpId: w.investmentId,
  acceptTerms: true,
});
await call("/api/portal/paystack/verify", { reference: intent.reference });
ws = (await call("/api/portal/investments")).wealthStream[0];
assert.equal(ws.principal, 12000000);
assert.equal(ws.payoutSchedule[0].amount, initial);
assert.equal(ws.payoutSchedule[1].amount, 240000);
await call("/api/portal/withdrawals", {
  investmentId: w.investmentId,
  reason: "Personal needs",
  acceptTerms: true,
});
await call(
  "/api/portal/withdrawals",
  { investmentId: w.investmentId, reason: "Personal needs", acceptTerms: true },
  400,
);
const wd = (await call("/api/portal/withdrawals")).withdrawals[0];
const docs = await call("/api/portal/documents");
assert.equal(docs.portalDocuments.length, 2);
const pdfResponse = await fetch(
  base + `/api/portal/files/${docs.portalDocuments[0].id}`,
  { headers: { Cookie: cookie } },
);
assert.equal(pdfResponse.status, 200);
assert.ok(
  Buffer.from(await pdfResponse.arrayBuffer())
    .subarray(0, 5)
    .toString() === "%PDF-",
);
await call("/api/preview", { role: "STAFF" });
const staff = await call("/api/admin");
assert.ok(staff.permissions.includes("review"));
assert.ok(!staff.permissions.includes("finance"));
await call("/api/admin?section=finance", undefined, 403);
await call("/api/admin", { action: "FX", rate: 1400 }, 403);
await call(
  "/api/admin",
  {
    action: "DOCUMENT",
    userId: "preview_INVESTOR",
    documentId: "missing",
    status: "APPROVED",
  },
  400,
);
await call("/api/preview", { role: "FINANCE" });
const finance = await call("/api/admin");
assert.ok(finance.permissions.includes("finance"));
assert.ok(!finance.permissions.includes("review"));
await call("/api/admin?section=review", undefined, 403);
await call("/api/admin", {
  action: "ALLOCATE",
  investmentId: g.investmentId,
  propertyName: "Test property",
  location: "Abuja",
  valuation: 7500000,
});
await call("/api/admin", {
  action: "LIST_RESALE",
  investmentId: g.investmentId,
});
await call("/api/admin", {
  action: "SELL",
  investmentId: g.investmentId,
  salePrice: 7500000,
});
const queue = await call("/api/admin?section=finance");
const payout = queue.payouts.find((p) => p.investmentId === g.investmentId);
assert.equal(payout.amount, 6750000);
await call("/api/admin", {
  action: "PAY_PAYOUT",
  payoutId: payout.id,
  reference: "TEST-RESALE-001",
});
await call(
  "/api/admin",
  { action: "PAY_PAYOUT", payoutId: payout.id, reference: "TEST-RESALE-001" },
  400,
);
await call("/api/admin", {
  action: "REVIEW_WITHDRAWAL",
  withdrawalId: wd.id,
  decision: "APPROVE",
});
await call(
  "/api/admin",
  { action: "RETURN_PRINCIPAL", withdrawalId: wd.id, reference: "TOO-EARLY" },
  400,
);
const afterNotice = await call("/api/admin?section=finance");
assert.equal(
  afterNotice.payouts.filter((p) => p.investmentId === w.investmentId).length,
  0,
);
await call("/api/preview", { role: "SUPER_ADMIN" });
await call(
  "/api/admin",
  {
    action: "DIRECT_PROFILE",
    userId: "preview_INVESTOR",
    data: {},
    submit: true,
  },
  400,
);
await call("/api/admin", {
  action: "ARTICLE",
  article: {
    title: "Preview article test",
    slug: "preview-article-test",
    excerpt: "Preview only",
    body: "An isolated article.",
    status: "PUBLISHED",
  },
});
assert.ok((await call("/insights")).includes("Preview article test"));
assert.ok(
  (await call("/insights/preview-article-test")).includes(
    "An isolated article.",
  ),
);

await call(
  "/api/admin",
  { action: "CONFIG", config: { ...config, giapMin: 0 } },
  400,
);
await call("/api/admin", {
  action: "CONFIG",
  config: { ...config, permissions: { STAFF: ["investors"] } },
});
await call("/api/preview", { role: "STAFF" });
await call("/api/admin?section=review", undefined, 403);
await call("/api/preview", { role: "INVESTOR" });
data = await call("/api/portal/investments");
assert.equal(data.giap[0].status, "CLOSED");
assert.equal(data.wealthStream[0].status, "IN_NOTICE_PERIOD");
await call("/api/portal/files/not-my-document", undefined, 404);
const spoof =
  Buffer.from(
    JSON.stringify({
      userId: "preview_SUPER_ADMIN",
      role: "SUPER_ADMIN",
      exp: 9999999999,
    }),
  ).toString("base64url") + ".fake";
const forged = await fetch(base + "/admin", {
  headers: { Cookie: `mycayapp_session=${spoof}` },
  redirect: "manual",
});
assert.equal(forged.status, 307);
assert.equal((await fetch(base + "/properties")).status, 404);
assert.equal((await fetch(base + "/services")).status, 404);
assert.equal(
  crypto
    .createHash("sha256")
    .update(fs.readFileSync("data/db.json"))
    .digest("hex"),
  before,
  "Real database changed during preview",
);
console.log(
  "PASS: preview isolation, investment creation, payment idempotency, top-up rules, GIAP allocation/resale, payouts, withdrawal notice, PDFs, role permissions, forged sessions, and deferred routes.",
);
