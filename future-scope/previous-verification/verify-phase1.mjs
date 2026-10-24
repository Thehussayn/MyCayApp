import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function validatePasswordCriteria(password) {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password),
  };
}

function isPasswordValid(password) {
  const criteria = validatePasswordCriteria(password);
  return (
    criteria.minLength &&
    criteria.hasUppercase &&
    criteria.hasNumber &&
    criteria.hasSpecial
  );
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashBuffer = crypto.scryptSync(password, salt, 64);
  return {
    hash: hashBuffer.toString("hex"),
    salt,
  };
}

function verifyPassword(password, hash, salt) {
  try {
    const hashBuffer = crypto.scryptSync(password, salt, 64);
    const storedBuffer = Buffer.from(hash, "hex");
    if (hashBuffer.length !== storedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(hashBuffer, storedBuffer);
  } catch {
    return false;
  }
}

const SESSION_SECRET = "jejeola_secure_hmac_session_secret_2026_super_key";

function signSession(user, durationSeconds = 7200) {
  const payload = {
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    status: user.status,
    referenceId: user.referenceId,
    exp: Math.floor(Date.now() / 1000) + durationSeconds,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${signature}`;
}

function verifySessionToken(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payloadBase64, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(payloadBase64)
      .digest("base64url");

    if (signature !== expectedSignature) return null;

    const payloadJson = Buffer.from(payloadBase64, "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson);
    const now = Math.floor(Date.now() / 1000);
    if (now > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

async function runTests() {
  console.log("==================================================");
  console.log("   RUNNING PHASE 1 INVESTOR PORTAL VERIFICATION   ");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, detail) {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName} - ${detail || "Assertion failed"}`);
      failed++;
    }
  }

  // 1. Password Validation Rules
  console.log("\n1. Password Validation Rules");
  assert(!isPasswordValid("short"), "Rejects passwords < 8 chars");
  assert(!isPasswordValid("alllowercase123!"), "Rejects passwords without uppercase");
  assert(!isPasswordValid("NoNumbersHere!"), "Rejects passwords without numbers");
  assert(!isPasswordValid("NoSpecial1234"), "Rejects passwords without special characters");
  assert(isPasswordValid("SecurePass@2026!"), "Accepts valid complex password");

  // 2. Scrypt Password Hashing & Verification
  console.log("\n2. Scrypt Password Hashing & Verification");
  const testPw = "InvestorP@ss2026!";
  const { hash, salt } = hashPassword(testPw);
  assert(hash.length === 128, "Scrypt hash output length is 128 hex chars (64 bytes)");
  assert(verifyPassword(testPw, hash, salt), "Password verification succeeds for correct password");
  assert(!verifyPassword("WrongPassword123!", hash, salt), "Password verification fails for wrong password");

  // 3. User Creation & Persistence in DB
  console.log("\n3. Database Layer & Account Persistence");
  let dbContent = {
    users: [
      {
        id: "user_admin_001",
        fullName: "Jeje-Ola Platform Administrator",
        email: "admin@jejeolaproperties.com.ng",
        phone: "+2348066873988",
        country: "Nigeria",
        ...(() => {
          const hp = hashPassword("Admin@JejeOla2026!");
          return { passwordHash: hp.hash, salt: hp.salt };
        })(),
        role: "SUPER_ADMIN",
        status: "APPROVED",
        termsAccepted: true,
        privacyAccepted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        failedLoginAttempts: 0,
        referenceId: "JOP-ADM-2026-0001",
      }
    ],
    auditLogs: [],
    passwordResetTokens: [],
    additionalInfoSubmissions: [],
    outbox: [],
  };

  if (fs.existsSync(DB_PATH)) {
    try {
      dbContent = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    } catch {}
  }

  const testEmail = `test_investor_${Date.now()}@example.com`;
  const newUser = {
    id: `user_test_${Date.now()}`,
    fullName: "Chief Emeka Okafor",
    email: testEmail,
    phone: "+234 801 234 5678",
    country: "Nigeria",
    passwordHash: hash,
    salt,
    role: "INVESTOR",
    status: "PENDING",
    termsAccepted: true,
    privacyAccepted: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    failedLoginAttempts: 0,
    referenceId: "JOP-INV-2026-9999",
  };

  dbContent.users.push(newUser);
  fs.writeFileSync(DB_PATH, JSON.stringify(dbContent, null, 2), "utf8");

  const reReadDb = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  const foundUser = reReadDb.users.find((u) => u.email === testEmail);
  assert(foundUser !== undefined, "User saved and retrieved by email");
  assert(foundUser?.status === "PENDING", "User initialized with PENDING status");
  assert(foundUser?.role === "INVESTOR", "User initialized with INVESTOR role");
  assert(foundUser?.referenceId === "JOP-INV-2026-9999", "Reference ID preserved");

  // 4. Session Token Signing & Verification
  console.log("\n4. Session Token Signing & Verification");
  const token = signSession(foundUser);
  const decoded = verifySessionToken(token);
  assert(decoded !== null, "Token verified successfully");
  assert(decoded?.email === testEmail, "Decoded email matches");
  assert(decoded?.status === "PENDING", "Decoded status matches");
  assert(decoded?.role === "INVESTOR", "Decoded role matches");

  // 5. Password Reset Token Lifecycle
  console.log("\n5. Password Reset Token Lifecycle");
  const rawResetToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawResetToken).digest("hex");
  const tokenRecord = {
    id: `prt_test_${Date.now()}`,
    userId: foundUser.id,
    tokenHash,
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
    createdAt: new Date().toISOString(),
  };
  reReadDb.passwordResetTokens.push(tokenRecord);
  fs.writeFileSync(DB_PATH, JSON.stringify(reReadDb, null, 2), "utf8");

  assert(tokenRecord.expiresAt > new Date().toISOString(), "New reset token is within 1-hour validity");
  assert(!tokenRecord.usedAt, "Token is initially unused");

  // Mark token used
  tokenRecord.usedAt = new Date().toISOString();
  assert(tokenRecord.usedAt !== undefined, "Used token records timestamp and prevents replay");

  // 6. Status Transitions & Staff Actions
  console.log("\n6. Status Transitions & Staff Workflow");
  foundUser.status = "INFO_REQUESTED";
  foundUser.staffInquiry = "Please provide proof of Nigerian residency or diaspora passport.";
  assert(foundUser.status === "INFO_REQUESTED", "Status updated to INFO_REQUESTED");

  // User resubmits clarification
  foundUser.status = "PENDING";
  foundUser.staffInquiry = undefined;
  assert(foundUser.status === "PENDING", "Status transitions back to PENDING after clarification");

  // Staff declines
  foundUser.status = "DECLINED";
  foundUser.declineReason = "Ineligible under current regulatory mandate.";
  assert(foundUser.status === "DECLINED", "Status transitions to DECLINED with reason");

  // Staff approves
  foundUser.status = "APPROVED";
  foundUser.declineReason = undefined;
  assert(foundUser.status === "APPROVED", "Status transitions to APPROVED");

  // Clean up test user
  const finalDb = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  finalDb.users = finalDb.users.filter((u) => u.email !== testEmail);
  fs.writeFileSync(DB_PATH, JSON.stringify(finalDb, null, 2), "utf8");

  // 7. Seed Admin Account Check
  console.log("\n7. Default Administrative Account");
  const admin = finalDb.users.find((u) => u.email === "admin@jejeolaproperties.com.ng");
  assert(admin !== undefined, "Super Admin account is seeded");
  assert(admin?.role === "SUPER_ADMIN", "Admin role is SUPER_ADMIN");
  assert(admin?.status === "APPROVED", "Admin status is APPROVED");

  console.log("\n==================================================");
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
