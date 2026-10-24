import fs from "fs";
import path from "path";

console.log("==================================================");
console.log("🚀 VERIFYING KYC-TO-DASHBOARD BRIDGE & ROUTING");
console.log("==================================================");

const projectRoot = process.cwd();

// Test 1: Verify PortalShell KYC link & nav item
console.log("\n[TEST 1] Checking PortalShell persistent KYC navigation...");
const portalShellPath = path.join(projectRoot, "components/portal/PortalShell.tsx");
const portalShellCode = fs.readFileSync(portalShellPath, "utf-8");

if (!portalShellCode.includes("KYC Verification")) {
  throw new Error("PortalShell missing 'KYC Verification' navItem!");
}
if (!portalShellCode.includes("href={kycDestination}")) {
  throw new Error("PortalShell header KYC badge is not an interactive link!");
}
console.log("✓ PortalShell contains interactive header KYC link and dedicated sidebar navigation item.");

// Test 2: Verify /portal/verification wraps in PortalShell & has return links
console.log("\n[TEST 2] Checking /portal/verification unified shell & breadcrumbs...");
const verificationPath = path.join(projectRoot, "app/portal/verification/page.tsx");
const verificationCode = fs.readFileSync(verificationPath, "utf-8");

if (!verificationCode.includes("<PortalShell")) {
  throw new Error("/portal/verification is not wrapped in PortalShell!");
}
if (!verificationCode.includes("href=\"/portal/dashboard\"")) {
  throw new Error("/portal/verification missing link back to Dashboard!");
}
if (!verificationCode.includes("Dashboard") || !verificationCode.includes("Verification Status")) {
  throw new Error("/portal/verification missing breadcrumbs!");
}
console.log("✓ /portal/verification wrapped in PortalShell with breadcrumbs and direct Dashboard navigation.");

// Test 3: Verify bidirectional CTAs on /portal/verification
console.log("\n[TEST 3] Checking contextual state CTAs on /portal/verification...");
if (!verificationCode.includes("Go to Investor Dashboard") || !verificationCode.includes("View Onboarding Summary")) {
  throw new Error("/portal/verification missing approved dual CTAs!");
}
if (!verificationCode.includes("Return to Dashboard") || !verificationCode.includes("View Document Center")) {
  throw new Error("/portal/verification missing in-progress / review CTAs!");
}
console.log("✓ /portal/verification provides seamless CTAs across APPROVED, IN_REVIEW, and ACTION_REQ states.");

// Test 4: Verify Dashboard KYC Banners & Empty State Framing
console.log("\n[TEST 4] Checking Dashboard KYC alert banners & empty state...");
const dashboardPath = path.join(projectRoot, "app/portal/dashboard/page.tsx");
const dashboardCode = fs.readFileSync(dashboardPath, "utf-8");

if (!dashboardCode.includes("Compliance Action Required") || !dashboardCode.includes("Document Replacement Needed")) {
  throw new Error("Dashboard missing urgent INFO_REQUESTED banner!");
}
if (!dashboardCode.includes("Compliance Review Active") || !dashboardCode.includes("Your KYC Documents Are Under Review")) {
  throw new Error("Dashboard missing in-progress KYC review banner!");
}
if (!dashboardCode.includes("Ready to Build Your Portfolio") || !dashboardCode.includes("Institutional Programs Preview")) {
  throw new Error("Dashboard empty portfolio section is not context-aware for pending vs verified users!");
}
console.log("✓ Dashboard renders status-aware KYC banners and context-aware portfolio framing.");

// Test 5: Verify Login & Middleware Routing
console.log("\n[TEST 5] Checking Login route & Middleware routing...");
const loginRoutePath = path.join(projectRoot, "app/api/auth/login/route.ts");
const loginRouteCode = fs.readFileSync(loginRoutePath, "utf-8");
if (!loginRouteCode.includes("kycStatus: updatedUser.kycStatus")) {
  throw new Error("Login route missing kycStatus in user payload!");
}

const middlewarePath = path.join(projectRoot, "middleware.ts");
const middlewareCode = fs.readFileSync(middlewarePath, "utf-8");
if (!middlewareCode.includes("return NextResponse.redirect(new URL(\"/portal/dashboard\", req.url))")) {
  throw new Error("Middleware auth redirect does not point approved users to /portal/dashboard!");
}
console.log("✓ Login returns kycStatus and middleware cleanly routes approved users to /portal/dashboard.");

console.log("\n==================================================");
console.log("🎉 ALL KYC-TO-DASHBOARD BRIDGE CHECKS PASSED!");
console.log("==================================================");
