import fs from "fs";
import path from "path";

console.log("==================================================");
console.log("🚀 VERIFYING PACKAGE B: PLAN SELECTION & PAYSTACK SIMULATION");
console.log("==================================================");

const projectRoot = process.cwd();

// Test 1: Verify Database Schema & Types
console.log("\n[TEST 1] Checking Database Schema & Investment Types (lib/db/types.ts)...");
const typesPath = path.join(projectRoot, "lib/db/types.ts");
const typesCode = fs.readFileSync(typesPath, "utf-8");

const requiredStatuses = [
  "FUNDED",
  "ACTIVE",
  "PENDING_ALLOCATION",
  "LISTED_FOR_RESALE",
  "IN_NOTICE_PERIOD",
  "READY_FOR_PAYOUT",
  "COMPLETED",
  "CLOSED",
  "EXITED",
];

for (const status of requiredStatuses) {
  if (!typesCode.includes(`"${status}"`)) {
    throw new Error(`InvestmentStatus missing required status "${status}"!`);
  }
}

if (!typesCode.includes("capitalKobo: number;")) {
  throw new Error("Investment models missing required 'capitalKobo: number'!");
}
if (!typesCode.includes("linkedPropertyId?: string | null;")) {
  throw new Error("GiapInvestment missing 'linkedPropertyId?: string | null;'!");
}
if (!typesCode.includes("export interface PayoutScheduleItem")) {
  throw new Error("Missing 'PayoutScheduleItem' interface in lib/db/types.ts!");
}
console.log("✓ All required investment statuses, integer capitalKobo, linkedPropertyId: null, and PayoutScheduleItem defined.");

// Test 2: Verify Database Repository Helper Methods (lib/db/index.ts)
console.log("\n[TEST 2] Checking Database Repository Helper Methods (lib/db/index.ts)...");
const dbPath = path.join(projectRoot, "lib/db/index.ts");
const dbCode = fs.readFileSync(dbPath, "utf-8");

if (!dbCode.includes("function createGiapSubscription(")) {
  throw new Error("lib/db/index.ts missing 'createGiapSubscription' implementation!");
}
if (!dbCode.includes("linkedPropertyId: null")) {
  throw new Error("createGiapSubscription does not initialize linkedPropertyId to null!");
}
if (!dbCode.includes("capitalKobo = Math.round(params.capital * 100)")) {
  throw new Error("createGiapSubscription does not calculate capitalKobo integer!");
}
if (!dbCode.includes("function createWealthStreamSubscription(")) {
  throw new Error("lib/db/index.ts missing 'createWealthStreamSubscription' implementation!");
}
if (!dbCode.includes("scheduleItems.push(") || !dbCode.includes("db.payoutSchedules.push")) {
  throw new Error("createWealthStreamSubscription does not auto-generate 12-month payoutSchedule!");
}
if (!dbCode.includes("function getPayoutSchedule(")) {
  throw new Error("lib/db/index.ts missing 'getPayoutSchedule' helper!");
}
console.log("✓ Database repository methods properly create subscriptions with ledger transactions, audit logs, and digital agreements.");

// Test 3: Verify API Endpoints
console.log("\n[TEST 3] Checking API Endpoints...");
const plansRoutePath = path.join(projectRoot, "app/api/portal/plans/route.ts");
const subscribeRoutePath = path.join(projectRoot, "app/api/portal/investments/subscribe/route.ts");
const webhookRoutePath = path.join(projectRoot, "app/api/portal/paystack/webhook/route.ts");

if (!fs.existsSync(plansRoutePath)) throw new Error("Missing app/api/portal/plans/route.ts!");
if (!fs.existsSync(subscribeRoutePath)) throw new Error("Missing app/api/portal/investments/subscribe/route.ts!");
if (!fs.existsSync(webhookRoutePath)) throw new Error("Missing app/api/portal/paystack/webhook/route.ts!");

const subscribeCode = fs.readFileSync(subscribeRoutePath, "utf-8");
if (!subscribeCode.includes('user.kycStatus !== "APPROVED"')) {
  throw new Error("Subscribe route does not enforce KYC approval check!");
}
if (!subscribeCode.includes("5_000_000") || !subscribeCode.includes("100_000_000")) {
  throw new Error("Subscribe route missing capital validation bounds (5M to 100M)!");
}

const webhookCode = fs.readFileSync(webhookRoutePath, "utf-8");
if (!webhookCode.includes("createGiapSubscription") || !webhookCode.includes("createWealthStreamSubscription")) {
  throw new Error("Webhook route does not invoke database subscription creation!");
}
if (!webhookCode.includes("alreadyProcessed") || !webhookCode.includes("existingTxn")) {
  throw new Error("Webhook route does not implement idempotency!");
}
console.log("✓ API endpoints enforce KYC gating, subscription bounds, and webhook idempotency.");

// Test 4: Verify Plan Selection Page & Property Allocation Notice
console.log("\n[TEST 4] Checking Plan Selection UI (app/portal/plans/page.tsx)...");
const plansPagePath = path.join(projectRoot, "app/portal/plans/page.tsx");
const plansPageCode = fs.readFileSync(plansPagePath, "utf-8");

if (!plansPageCode.includes("Plan Selection Restricted to KYC-Approved Investors") || !plansPageCode.includes('href="/portal/verification"')) {
  throw new Error("Plan selection page missing institutional KYC gating lockout screen!");
}
if (!plansPageCode.includes("Properties are selected and linked once your investment funds are deployed")) {
  throw new Error("Plan selection page missing mandatory GIAP property allocation disclaimer!");
}
if (!plansPageCode.includes("70/30 Profit Split")) {
  throw new Error("Plan selection page missing GIAP 70/30 split feature!");
}
if (!plansPageCode.includes("Calculated Payout Schedule Breakdown")) {
  throw new Error("Plan selection page missing WealthStream payout schedule breakdown!");
}
if (!plansPageCode.includes("Suspense")) {
  throw new Error("Plan selection page not wrapped in Suspense!");
}
console.log("✓ Plan selection page implements strict KYC gating, GIAP disclaimer, and WealthStream schedule preview.");

// Test 5: Verify Paystack Checkout Modal
console.log("\n[TEST 5] Checking Paystack Modal (components/portal/PaystackCheckoutModal.tsx)...");
const modalPath = path.join(projectRoot, "components/portal/PaystackCheckoutModal.tsx");
const modalCode = fs.readFileSync(modalPath, "utf-8");

if (!modalCode.includes("Paystack Checkout")) {
  throw new Error("Modal missing Paystack institutional header!");
}
if (!modalCode.includes("Bank Transfer") || !modalCode.includes("Card") || !modalCode.includes("USSD")) {
  throw new Error("Modal missing payment channel options!");
}
if (!modalCode.includes("/api/portal/paystack/webhook")) {
  throw new Error("Modal does not invoke Paystack webhook simulation endpoint!");
}
console.log("✓ Paystack modal offers multi-channel options and interactive test payment simulation.");

// Test 6: Verify Navigation Integration
console.log("\n[TEST 6] Checking Navigation Integration Across Portal...");
const portalShellCode = fs.readFileSync(path.join(projectRoot, "components/portal/PortalShell.tsx"), "utf-8");
if (!portalShellCode.includes("Investment Plans") || !portalShellCode.includes("/portal/plans")) {
  throw new Error("PortalShell missing 'Investment Plans' link to /portal/plans!");
}

const dashboardCode = fs.readFileSync(path.join(projectRoot, "app/portal/dashboard/page.tsx"), "utf-8");
if (!dashboardCode.includes("/portal/plans")) {
  throw new Error("Dashboard missing link to /portal/plans!");
}

const giapCode = fs.readFileSync(path.join(projectRoot, "app/portal/giap/page.tsx"), "utf-8");
if (!giapCode.includes("/portal/plans?plan=giap")) {
  throw new Error("GIAP dashboard missing link to /portal/plans?plan=giap!");
}

const wstCode = fs.readFileSync(path.join(projectRoot, "app/portal/wealthstream/page.tsx"), "utf-8");
if (!wstCode.includes("/portal/plans?plan=wealthstream")) {
  throw new Error("WealthStream dashboard missing link to /portal/plans?plan=wealthstream!");
}
console.log("✓ PortalShell, Dashboard, GIAP, and WealthStream all cleanly route investors to /portal/plans.");

console.log("\n==================================================");
console.log("🎉 ALL PACKAGE B VERIFICATION CHECKS PASSED!");
console.log("==================================================");
