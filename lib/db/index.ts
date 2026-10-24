import fs from "fs";
import { isHostedDemo, readDemoState, writeDemoState } from "@/lib/demo/state";
import { readSessionToken } from "@/lib/auth/session";
import path from "path";
import crypto from "crypto";
import {
  DatabaseSchema,
  User,
  StaffActionLog,
  PasswordResetToken,
  AdditionalInfoSubmission,
  TransactionalEmailRecord,
  BiodataRecord,
  KycDocumentRecord,
  KycDocumentType,
  KycDocStatus,
  KycStatus,
  TransactionRecord,
  PortalDocumentRecord,
  InvestorSettings,
} from "./types";
import { hashPassword } from "@/lib/auth/password";

const DATA_DIR = path.join(process.cwd(), "data");
function databasePath() {
  const session = readSessionToken();
  if (
    session?.preview &&
    session.workspace &&
    /^[a-f0-9-]{36}$/.test(session.workspace)
  ) {
    return path.join(DATA_DIR, `preview-${session.workspace}.json`);
  }
  return process.env.DATABASE_PATH || path.join(DATA_DIR, "db.json");
}

function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getInitialDb(): DatabaseSchema {
  const adminPassword = hashPassword(
    process.env.ADMIN_PASSWORD || crypto.randomBytes(24).toString("base64url"),
  );
  const now = new Date().toISOString();

  const superAdmin: User = {
    id: "user_admin_001",
    fullName: "Jeje-Ola Platform Administrator",
    email: process.env.ADMIN_EMAIL || "admin@jejeolaproperties.com.ng",
    phone: "+2348066873988",
    country: "Nigeria",
    passwordHash: adminPassword.hash,
    salt: adminPassword.salt,
    role: "SUPER_ADMIN",
    status: "APPROVED",
    kycStatus: "APPROVED",
    termsAccepted: true,
    privacyAccepted: true,
    createdAt: now,
    updatedAt: now,
    failedLoginAttempts: 0,
    referenceId: "JOP-ADM-2026-0001",
  };

  return {
    users: process.env.ADMIN_PASSWORD ? [superAdmin] : [],
    passwordResetTokens: [],
    auditLogs: [
      {
        id: "log_init_001",
        timestamp: now,
        actorId: "system",
        actorEmail: "system@jejeolaproperties.com.ng",
        actorRole: "SYSTEM",
        targetUserId: superAdmin.id,
        targetUserEmail: superAdmin.email,
        action: "APPROVE",
        afterStatus: "APPROVED",
        notes: "Initial seed administrator account created",
      },
    ],
    additionalInfoSubmissions: [],
    outbox: [],
    biodata: [],
    kycDocuments: [],
    demoSettings: {},
    investmentsGiap: [],
    investmentsWealthStream: [],
    payoutSchedules: [],
    transactions: [],
    portalDocuments: [],
    notifications: [],
    settings: {},
  };
}

export function getDb(): DatabaseSchema {
  if (isHostedDemo()) {
    const existing = readDemoState();
    if (existing) return existing;
    const initial = getInitialDb();
    initial.users = [];
    initial.auditLogs = [];
    return initial;
  }
  ensureDirectoryExists();
  const DB_PATH = databasePath();

  if (!fs.existsSync(DB_PATH)) {
    const initial = getInitialDb();
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }

  try {
    const content = fs.readFileSync(DB_PATH, "utf8");
    const parsed = JSON.parse(content) as DatabaseSchema;
    // Ensure all Phase 2, Phase 3, and Phase 4 arrays exist
    if (!parsed.biodata) parsed.biodata = [];
    if (!parsed.kycDocuments) parsed.kycDocuments = [];
    if (!parsed.demoSettings) parsed.demoSettings = {};
    if (!parsed.investmentsGiap) parsed.investmentsGiap = [];
    if (!parsed.investmentsWealthStream) parsed.investmentsWealthStream = [];
    if (!parsed.payoutSchedules) parsed.payoutSchedules = [];
    if (!parsed.transactions) parsed.transactions = [];
    if (!parsed.portalDocuments) parsed.portalDocuments = [];
    if (!parsed.notifications) parsed.notifications = [];
    if (!parsed.settings) parsed.settings = {};
    return parsed;
  } catch {
    throw new Error(
      "Unable to read the database. The existing file has been preserved.",
    );
  }
}

export function saveDb(data: DatabaseSchema): void {
  if (isHostedDemo()) { writeDemoState(data); return; }
  ensureDirectoryExists();
  const DB_PATH = databasePath();
  const tempPath = `${DB_PATH}.tmp.${Date.now()}`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tempPath, DB_PATH);
}

// User Lookups & Mutations
export function findUserByEmail(email: string): User | undefined {
  const db = getDb();
  return db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim(),
  );
}

export function findUserById(id: string): User | undefined {
  const db = getDb();
  return db.users.find((u) => u.id === id);
}

export function createUser(user: User): User {
  const db = getDb();
  db.users.push(user);
  saveDb(db);
  return user;
}

export function updateUser(
  id: string,
  updates: Partial<User>,
): User | undefined {
  const db = getDb();
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) return undefined;

  db.users[index] = {
    ...db.users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDb(db);
  return db.users[index];
}

export function getAllUsers(): User[] {
  const db = getDb();
  return db.users;
}

// Audit Logging
export function recordAuditLog(
  log: Omit<StaffActionLog, "id" | "timestamp">,
): StaffActionLog {
  const db = getDb();
  const entry: StaffActionLog = {
    ...log,
    id: `log_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
    timestamp: new Date().toISOString(),
  };
  db.auditLogs.unshift(entry);
  saveDb(db);
  return entry;
}

export function getAuditLogs(): StaffActionLog[] {
  const db = getDb();
  return db.auditLogs;
}

// Password Reset Tokens
export function createPasswordResetToken(userId: string): {
  token: string;
  record: PasswordResetToken;
} {
  const db = getDb();
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  const createdAt = new Date().toISOString();

  const record: PasswordResetToken = {
    id: `prt_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
    userId,
    tokenHash,
    expiresAt,
    createdAt,
  };

  db.passwordResetTokens.push(record);
  saveDb(db);

  return { token: rawToken, record };
}

export function verifyPasswordResetToken(rawToken: string): {
  valid: boolean;
  userId?: string;
  recordId?: string;
  reason?: string;
} {
  const db = getDb();
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  const record = db.passwordResetTokens.find((r) => r.tokenHash === tokenHash);
  if (!record) {
    return { valid: false, reason: "Invalid token" };
  }

  if (record.usedAt) {
    return { valid: false, reason: "Token has already been used" };
  }

  const now = new Date();
  if (now > new Date(record.expiresAt)) {
    return { valid: false, reason: "Token has expired" };
  }

  return { valid: true, userId: record.userId, recordId: record.id };
}

export function markTokenUsed(tokenId: string): void {
  const db = getDb();
  const record = db.passwordResetTokens.find((r) => r.id === tokenId);
  if (record) {
    record.usedAt = new Date().toISOString();
    saveDb(db);
  }
}

// Additional Info Submission
export function recordAdditionalInfo(
  submission: Omit<AdditionalInfoSubmission, "id" | "submittedAt">,
): AdditionalInfoSubmission {
  const db = getDb();
  const entry: AdditionalInfoSubmission = {
    ...submission,
    id: `sub_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
    submittedAt: new Date().toISOString(),
  };
  db.additionalInfoSubmissions.push(entry);
  saveDb(db);
  return entry;
}

// Outbox / Transactional Emails
export function recordEmail(
  email: Omit<TransactionalEmailRecord, "id" | "sentAt">,
): TransactionalEmailRecord {
  const db = getDb();
  const record: TransactionalEmailRecord = {
    ...email,
    id: `email_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
    sentAt: new Date().toISOString(),
  };
  db.outbox.unshift(record);
  saveDb(db);
  return record;
}

export function getOutbox(): TransactionalEmailRecord[] {
  const db = getDb();
  return db.outbox;
}

// -------------------------------------------------------------
// PHASE 2: BIODATA & KYC DOCUMENT DATA ACCESS
// -------------------------------------------------------------

export function getBiodataByUserId(userId: string): BiodataRecord | undefined {
  const db = getDb();
  return db.biodata.find((b) => b.userId === userId);
}

export function createBlankBiodata(user: User): BiodataRecord {
  const now = new Date().toISOString();
  return {
    id: `bio_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
    userId: user.id,
    currentStep: 1,
    completedSteps: [],
    isSubmitted: false,
    createdAt: now,
    updatedAt: now,

    // Step 1: Personal
    fullName: user.fullName || "",
    dob: "",
    gender: "",
    nationality:
      user.country === "Nigeria" ? "Nigeria" : user.country || "Nigeria",
    stateOfOrigin: "",
    maritalStatus: "",

    // Step 2: Contact
    email: user.email,
    phone: user.phone || "",
    residentialAddress: "",
    city: "",
    stateProvince: "",
    country: user.country || "Nigeria",
    postalCode: "",

    // Step 3: ID
    idType: "",
    idNumber: "",
    issueDate: "",
    expiryDate: "",
    issuingAuthority: "",

    // Step 4: Occupation
    employmentStatus: "",
    employerName: "",
    jobTitle: "",
    businessAddress: "",

    // Step 5: Next of Kin
    nokFullName: "",
    nokRelationship: "",
    nokPhone: "",
    nokAddress: "",

    // Step 6: Bank
    bankCode: "",
    bankName: "",
    accountHolderName: user.fullName || "",
    accountNumber: "",
    accountType: "",

    // Step 7: Signature
    digitalSignature: "",
    signatureDate: "",
    acceptTerms: false,
    acceptPrivacy: false,
  };
}

export function saveBiodata(
  userId: string,
  updates: Partial<BiodataRecord>,
): BiodataRecord {
  const db = getDb();
  let record = db.biodata.find((b) => b.userId === userId);

  if (!record) {
    const user = findUserById(userId);
    record = createBlankBiodata(
      user ||
        ({
          id: userId,
          fullName: "",
          email: "",
          phone: "",
          country: "Nigeria",
        } as User),
    );
    db.biodata.push(record);
  }

  const index = db.biodata.findIndex((b) => b.userId === userId);
  db.biodata[index] = {
    ...db.biodata[index],
    ...updates,
    id: db.biodata[index].id,
    userId,
    updatedAt: new Date().toISOString(),
  };

  saveDb(db);
  return db.biodata[index];
}

export function getKycDocumentsByUserId(userId: string): KycDocumentRecord[] {
  const db = getDb();
  return db.kycDocuments.filter((d) => d.userId === userId);
}

export function saveKycDocument(
  doc: Omit<KycDocumentRecord, "id" | "uploadedAt">,
): KycDocumentRecord {
  const db = getDb();
  const existingIdx = db.kycDocuments.findIndex(
    (d) => d.userId === doc.userId && d.documentType === doc.documentType,
  );

  const now = new Date().toISOString();
  if (existingIdx >= 0) {
    db.kycDocuments[existingIdx] = {
      ...db.kycDocuments[existingIdx],
      ...doc,
      uploadedAt: now,
    };
    saveDb(db);
    return db.kycDocuments[existingIdx];
  }

  const newDoc: KycDocumentRecord = {
    ...doc,
    id: `kdoc_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
    uploadedAt: now,
  };
  db.kycDocuments.push(newDoc);
  saveDb(db);
  return newDoc;
}

export function updateKycDocumentStatus(
  docId: string,
  status: KycDocStatus,
  reason?: string,
  reviewer?: string,
): KycDocumentRecord | undefined {
  const db = getDb();
  const doc = db.kycDocuments.find((d) => d.id === docId);
  if (!doc) return undefined;

  doc.status = status;
  if (reason !== undefined) doc.rejectionReason = reason;
  if (reviewer !== undefined) doc.reviewedBy = reviewer;
  doc.reviewedAt = new Date().toISOString();

  saveDb(db);
  return doc;
}

export function updateUserKycStatus(
  userId: string,
  status: KycStatus,
): User | undefined {
  return updateUser(userId, { kycStatus: status });
}

export function deleteKycDocument(
  userId: string,
  documentType: KycDocumentType,
): boolean {
  const db = getDb();
  const initialLen = db.kycDocuments.length;
  db.kycDocuments = db.kycDocuments.filter(
    (d) => !(d.userId === userId && d.documentType === documentType),
  );
  if (db.kycDocuments.length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}

export function getInvestorPortfolio(userId: string) {
  const db = getDb();
  const giapList = db.investmentsGiap.filter((i) => i.userId === userId);
  const wstList = db.investmentsWealthStream.filter((i) => i.userId === userId);

  const openGiap = giapList.filter(
    (i) => !["CLOSED", "COMPLETED", "EXITED"].includes(i.status),
  );
  const openWst = wstList.filter(
    (i) => !["CLOSED", "COMPLETED", "EXITED"].includes(i.status),
  );
  const totalGiapInvested = openGiap.reduce(
    (acc, i) => acc + i.initialInvestment,
    0,
  );
  const totalWstInvested = openWst.reduce((acc, i) => acc + i.principal, 0);
  const totalInvested = totalGiapInvested + totalWstInvested;

  const giapEvaluation = openGiap.reduce(
    (acc, i) => acc + i.currentEvaluation,
    0,
  );
  const wstPrincipal = totalWstInvested;
  const currentPortfolioValue = giapEvaluation + wstPrincipal;

  const totalPayoutsReceived =
    wstList.reduce((acc, i) => acc + i.totalPayoutsReceived, 0) +
    giapList.reduce((s, i) => s + i.realizedInvestorProfit, 0);
  const activeInvestmentsCount = openGiap.length + openWst.length;

  return {
    totalInvested,
    currentPortfolioValue,
    totalPayoutsReceived,
    activeInvestmentsCount,
    giapInvestments: giapList,
    wealthStreamInvestments: wstList,
  };
}

export function getInvestorInvestments(userId: string) {
  const db = getDb();
  const giap = db.investmentsGiap.filter((i) => i.userId === userId);
  const wst = db.investmentsWealthStream.filter((i) => i.userId === userId);
  return { giap, wealthStream: wst };
}

export function getInvestorTransactions(
  userId: string,
  filters?: { type?: string; status?: string; search?: string },
): TransactionRecord[] {
  const db = getDb();
  let list = db.transactions.filter((t) => t.userId === userId);

  if (filters?.type && filters.type !== "ALL") {
    list = list.filter((t) => t.type === filters.type);
  }
  if (filters?.status && filters.status !== "ALL") {
    list = list.filter((t) => t.status === filters.status);
  }
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    list = list.filter(
      (t) =>
        t.reference.toLowerCase().includes(s) ||
        t.title.toLowerCase().includes(s) ||
        t.plan.toLowerCase().includes(s),
    );
  }
  return list;
}

export function getInvestorDocuments(userId: string): PortalDocumentRecord[] {
  const db = getDb();
  return db.portalDocuments.filter((d) => d.userId === userId);
}

export function getInvestorNotifications(userId: string) {
  const db = getDb();
  const list = db.notifications.filter((n) => n.userId === userId);
  const unreadCount = list.filter((n) => !n.isRead).length;
  return { notifications: list, unreadCount };
}

export function markNotificationAsRead(
  userId: string,
  notificationId: string,
): boolean {
  const db = getDb();
  const notif = db.notifications.find(
    (n) => n.userId === userId && n.id === notificationId,
  );
  if (!notif) return false;
  notif.isRead = true;
  saveDb(db);
  return true;
}

export function markAllNotificationsAsRead(userId: string): number {
  const db = getDb();
  let count = 0;
  for (const notif of db.notifications) {
    if (notif.userId === userId && !notif.isRead) {
      notif.isRead = true;
      count++;
    }
  }
  if (count > 0) saveDb(db);
  return count;
}

export function getInvestorSettings(userId: string): InvestorSettings {
  const db = getDb();
  if (!db.settings[userId]) {
    db.settings[userId] = {
      userId,
      emailAlerts: true,
      smsAlerts: false,
      quarterlyDigest: true,
      twoFactorEnabled: false,
      updatedAt: new Date().toISOString(),
    };
    saveDb(db);
  }
  return db.settings[userId];
}

export function updateInvestorSettings(
  userId: string,
  patch: Partial<InvestorSettings>,
): InvestorSettings {
  const db = getDb();
  const current = getInvestorSettings(userId);
  const updated = {
    ...current,
    ...patch,
    userId,
    updatedAt: new Date().toISOString(),
  };
  db.settings[userId] = updated;
  saveDb(db);
  return updated;
}

export function updateUserPassword(
  userId: string,
  newPasswordPlain: string,
): boolean {
  const db = getDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return false;
  const hashed = hashPassword(newPasswordPlain);
  user.passwordHash = hashed.hash;
  user.salt = hashed.salt;
  user.updatedAt = new Date().toISOString();
  saveDb(db);
  return true;
}

// -------------------------------------------------------------
// PLAN SUBSCRIPTION & PAYSTACK TRANSACTIONS
// -------------------------------------------------------------
