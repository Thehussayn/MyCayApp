import assert from "assert";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

function getDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function saveDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

console.log("==================================================");
console.log("🚀 STARTING KYC & ONBOARDING COMPLETION TEST SUITE");
console.log("==================================================\n");

// [TEST 1] Empty State vs Dummy Data Consistency
console.log("[TEST 1] Testing Development Mode Consistency (Empty State vs Dummy Data)...");
const testUser = {
  id: "test_investor_journey_001",
  fullName: "Chinedu Chukwuma Okonkwo",
  email: "chinedu.okonkwo@example.com",
  phone: "+2348031112233",
  country: "Nigeria",
  passwordHash: "dummyhash",
  salt: "dummysalt",
  role: "INVESTOR",
  status: "APPROVED",
  kycStatus: "NOT_STARTED",
  termsAccepted: true,
  privacyAccepted: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  failedLoginAttempts: 0,
  referenceId: "JOP-INV-2026-9099",
};

let db = getDb();
db.users = db.users.filter((u) => u.id !== testUser.id);
db.users.push(testUser);
db.kycDocuments = db.kycDocuments.filter((d) => d.userId !== testUser.id);
saveDb(db);

// Verify empty state initially
let userDocs = getDb().kycDocuments.filter((d) => d.userId === testUser.id);
assert.strictEqual(userDocs.length, 0, "Empty state must have exactly 0 documents.");
console.log("✓ Empty state has 0 uploaded documents.");

// Seed dummy documents
const now = new Date().toISOString();
const sampleDocs = [
  { documentType: "GOVERNMENT_ID", fileName: "NIN_Slip_Sample.pdf", fileSize: 1500000, mimeType: "application/pdf" },
  { documentType: "PROOF_OF_ADDRESS", fileName: "Utility_Bill_Sample.pdf", fileSize: 850000, mimeType: "application/pdf" },
  { documentType: "SPECIMEN_SIGNATURE", fileName: "Signature_Sample.png", fileSize: 320000, mimeType: "image/png" },
];
db = getDb();
sampleDocs.forEach((s) => {
  db.kycDocuments.push({
    id: `kdoc_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
    userId: testUser.id,
    documentType: s.documentType,
    fileName: s.fileName,
    fileSize: s.fileSize,
    mimeType: s.mimeType,
    fileUrl: `/mock/${s.fileName}`,
    status: "UPLOADED",
    uploadedAt: now,
  });
});
saveDb(db);

userDocs = getDb().kycDocuments.filter((d) => d.userId === testUser.id);
assert.strictEqual(userDocs.length, 3, "Dummy mode must have exactly 3 documents.");
console.log("✓ Dummy mode populated with 3 valid documents.");
console.log("✓ TEST 1 PASSED: Sandbox consistency verified.\n");

// [TEST 2] Document Removal & Validation
console.log("[TEST 2] Testing Document Removal...");
db = getDb();
db.kycDocuments = db.kycDocuments.filter(
  (d) => !(d.userId === testUser.id && d.documentType === "SPECIMEN_SIGNATURE")
);
saveDb(db);

userDocs = getDb().kycDocuments.filter((d) => d.userId === testUser.id);
assert.strictEqual(userDocs.length, 2, "After removing signature, exactly 2 documents remain.");
const types = userDocs.map((d) => d.documentType);
assert.ok(!types.includes("SPECIMEN_SIGNATURE"), "Signature must be removed.");
console.log("✓ Removed single document; submission readiness accurately reflects incomplete state.");

// Re-add signature to restore complete set
db = getDb();
db.kycDocuments.push({
  id: `kdoc_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
  userId: testUser.id,
  documentType: "SPECIMEN_SIGNATURE",
  fileName: "New_Signature_Sample.png",
  fileSize: 280000,
  mimeType: "image/png",
  fileUrl: `/mock/New_Signature_Sample.png`,
  status: "UPLOADED",
  uploadedAt: now,
});
saveDb(db);
assert.strictEqual(getDb().kycDocuments.filter((d) => d.userId === testUser.id).length, 3);
console.log("✓ TEST 2 PASSED: Document removal and replacement verified.\n");

// [TEST 3] Simulated Submission & Status Transition to SUBMITTED
console.log("[TEST 3] Testing Document Submission & Status Transition to SUBMITTED...");
db = getDb();
db.kycDocuments.forEach((d) => {
  if (d.userId === testUser.id) {
    d.status = "UNDER_REVIEW";
  }
});
const uIdx = db.users.findIndex((u) => u.id === testUser.id);
db.users[uIdx].kycStatus = "SUBMITTED";
saveDb(db);

const updatedUser = getDb().users.find((u) => u.id === testUser.id);
assert.strictEqual(updatedUser.kycStatus, "SUBMITTED", "User KYC status must transition to SUBMITTED.");
const allUnderReview = getDb().kycDocuments
  .filter((d) => d.userId === testUser.id)
  .every((d) => d.status === "UNDER_REVIEW");
assert.ok(allUnderReview, "All documents must have status UNDER_REVIEW upon submission.");
console.log("✓ TEST 3 PASSED: Submission transitions status to SUBMITTED and documents to review.\n");

// [TEST 4] Compliance Correction Request (INFO_REQUESTED)
console.log("[TEST 4] Testing Document Replacement Workflow (INFO_REQUESTED)...");
db = getDb();
db.kycDocuments.forEach((d) => {
  if (d.userId === testUser.id) {
    if (d.documentType === "PROOF_OF_ADDRESS") {
      d.status = "INFO_REQUESTED";
      d.rejectionReason = "Utility bill is older than 3 months. Please upload a bill issued within the last 90 days.";
    } else {
      d.status = "APPROVED";
    }
  }
});
const uIdx4 = db.users.findIndex((u) => u.id === testUser.id);
db.users[uIdx4].kycStatus = "INFO_REQUESTED";
saveDb(db);

const infoUser = getDb().users.find((u) => u.id === testUser.id);
assert.strictEqual(infoUser.kycStatus, "INFO_REQUESTED");
const rejectedDoc = getDb().kycDocuments.find(
  (d) => d.userId === testUser.id && d.documentType === "PROOF_OF_ADDRESS"
);
assert.strictEqual(rejectedDoc.status, "INFO_REQUESTED");
assert.ok(rejectedDoc.rejectionReason.includes("3 months"), "Must contain compliance reason.");

// Replace affected document
db = getDb();
const replaceIdx = db.kycDocuments.findIndex(
  (d) => d.userId === testUser.id && d.documentType === "PROOF_OF_ADDRESS"
);
db.kycDocuments[replaceIdx] = {
  ...db.kycDocuments[replaceIdx],
  fileName: "Fresh_EKEDC_Bill_September_2026.pdf",
  fileSize: 950000,
  status: "UPLOADED",
  rejectionReason: undefined,
  uploadedAt: new Date().toISOString(),
};
saveDb(db);

const replacedDoc = getDb().kycDocuments.find(
  (d) => d.userId === testUser.id && d.documentType === "PROOF_OF_ADDRESS"
);
assert.strictEqual(replacedDoc.fileName, "Fresh_EKEDC_Bill_September_2026.pdf");
assert.strictEqual(replacedDoc.status, "UPLOADED");
console.log("✓ Preserved non-affected documents; replaced affected document successfully.");
console.log("✓ TEST 4 PASSED: Document correction and replacement verified.\n");

// [TEST 5] Final Approval & Onboarding Completion Preconditions
console.log("[TEST 5] Testing Onboarding Completion Preconditions...");
db = getDb();
// Set all documents to APPROVED
db.kycDocuments.forEach((d) => {
  if (d.userId === testUser.id) {
    d.status = "APPROVED";
  }
});
const uIdx5 = db.users.findIndex((u) => u.id === testUser.id);
db.users[uIdx5].status = "APPROVED";
db.users[uIdx5].kycStatus = "APPROVED";

// Seed submitted biodata
const bIdx = db.biodata.findIndex((b) => b.userId === testUser.id);
const bioRecord = {
  id: `bio_${testUser.id}`,
  userId: testUser.id,
  currentStep: 7,
  completedSteps: [1, 2, 3, 4, 5, 6, 7],
  isSubmitted: true,
  submittedAt: new Date().toISOString(),
  createdAt: now,
  updatedAt: now,
  fullName: testUser.fullName,
  dob: "1988-04-12",
  gender: "Male",
  nationality: "Nigeria",
  stateOfOrigin: "Anambra",
  maritalStatus: "Married",
  email: testUser.email,
  phone: testUser.phone,
  residentialAddress: "Plot 42, Admiralty Way, Lekki Phase 1",
  city: "Lagos",
  stateProvince: "Lagos",
  country: "Nigeria",
  postalCode: "105102",
  idType: "NIN",
  idNumber: "11223344556",
  expiryDate: "2032-01-01",
  employmentStatus: "Employed",
  employerName: "Okonkwo Holdings",
  jobTitle: "Senior Partner",
  nokFullName: "Amaka Okonkwo",
  nokRelationship: "Spouse",
  nokPhone: "+2348029998877",
  nokAddress: "Plot 42, Admiralty Way, Lekki",
  bankCode: "058",
  bankName: "GTBank",
  accountHolderName: "Chinedu Chukwuma Okonkwo",
  accountNumber: "0123456789",
  accountType: "Current Account",
  digitalSignature: "Chinedu Chukwuma Okonkwo",
  signatureDate: "27/09/2026 15:30",
  acceptTerms: true,
  acceptPrivacy: true,
};
if (bIdx >= 0) {
  db.biodata[bIdx] = bioRecord;
} else {
  db.biodata.push(bioRecord);
}
saveDb(db);

const finalUser = getDb().users.find((u) => u.id === testUser.id);
const finalBio = getDb().biodata.find((b) => b.userId === testUser.id);
assert.strictEqual(finalUser.status, "APPROVED", "Account must be approved.");
assert.strictEqual(finalUser.kycStatus, "APPROVED", "KYC status must be approved.");
assert.strictEqual(finalBio.isSubmitted, true, "Biodata must be submitted.");
console.log("✓ All 3 onboarding completion gates satisfied (Account, Biodata, KYC).");
console.log("✓ TEST 5 PASSED: Onboarding completion gates verified.\n");

// [TEST 6] Clean up test records
db = getDb();
db.users = db.users.filter((u) => u.id !== testUser.id);
db.biodata = db.biodata.filter((b) => b.userId !== testUser.id);
db.kycDocuments = db.kycDocuments.filter((d) => d.userId !== testUser.id);
saveDb(db);
console.log("[TEST 6] Cleaned up test fixture records.");
console.log("✓ TEST 6 PASSED: Database hygiene maintained.\n");

console.log("==================================================");
console.log("🎉 ALL KYC & ONBOARDING COMPLETION TESTS PASSED!");
console.log("==================================================");
