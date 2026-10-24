export type UserRole =
  "INVESTOR" | "STAFF" | "FINANCE" | "ADMIN" | "SUPER_ADMIN";

export type AccountStatus =
  "PENDING" | "INFO_REQUESTED" | "APPROVED" | "DECLINED";

export type KycStatus =
  | "NOT_STARTED"
  | "BIODATA_IN_PROGRESS"
  | "BIODATA_SUBMITTED"
  | "DOCUMENTS_PENDING"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "INFO_REQUESTED"
  | "REJECTED";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  status: AccountStatus;
  kycStatus?: KycStatus;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  failedLoginAttempts: number;
  lockUntil?: string;
  // Specific notes or requests for the user
  staffNotes?: string; // Private internal notes
  staffInquiry?: string; // Visible question when INFO_REQUESTED
  declineReason?: string; // Visible reason when DECLINED
  disabled?: boolean;
  mustChangePassword?: boolean;
  referenceId: string; // Institutional reference e.g. JOP-INV-2026-XXXX
}

export interface PasswordResetToken {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string; // ISO 8601
  usedAt?: string;
  createdAt: string;
}

export type StaffActionType =
  | "APPROVE"
  | "DECLINE"
  | "REQUEST_INFO"
  | "RESUBMIT_INFO"
  | "REGISTER"
  | "PASSWORD_RESET_REQUEST"
  | "PASSWORD_RESET_SUCCESS"
  | "LOGIN_LOCKOUT"
  | "LOGIN_SUCCESS"
  | "BIODATA_SAVED"
  | "BIODATA_SUBMITTED"
  | "BIODATA_EDITED"
  | "KYC_DOC_UPLOADED"
  | "KYC_DOC_SUBMITTED"
  | "KYC_DOC_APPROVED"
  | "KYC_DOC_REJECTED"
  | "KYC_DOC_INFO_REQUESTED"
  | "KYC_DIRECT_ONBOARD"
  | "INVESTMENT_SUBSCRIBED"
  | "PAYMENT_CONFIRMED"
  | "INVESTMENT_UPDATED"
  | "WITHDRAWAL_REQUESTED"
  | "WITHDRAWAL_REVIEWED"
  | "PAYOUT_COMPLETED"
  | "SETTINGS_UPDATED"
  | "USER_UPDATED"
  | "NOTE_ADDED";

export interface StaffActionLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorEmail: string;
  actorRole: UserRole | "SYSTEM";
  targetUserId: string;
  targetUserEmail: string;
  action: StaffActionType;
  beforeStatus?: AccountStatus | KycStatus;
  afterStatus?: AccountStatus | KycStatus;
  reason?: string;
  notes?: string;
  ipAddress?: string;
}

export interface AdditionalInfoSubmission {
  id: string;
  userId: string;
  staffQuestion: string;
  userResponse: string;
  submittedAt: string;
}

export interface TransactionalEmailRecord {
  id: string;
  to: string;
  subject: string;
  template:
    | "REGISTRATION_ACKNOWLEDGED"
    | "APPLICATION_APPROVED"
    | "APPLICATION_DECLINED"
    | "INFORMATION_REQUESTED"
    | "PASSWORD_RESET"
    | "BIODATA_SUBMITTED"
    | "DOCUMENTS_RECEIVED"
    | "KYC_APPROVED"
    | "DOCUMENT_REPLACEMENT_REQUESTED";
  sentAt: string;
  payload: Record<string, any>;
}

export interface BiodataRecord {
  id: string;
  userId: string;
  currentStep: number; // 1 to 7
  completedSteps: number[];
  isSubmitted: boolean;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;

  // Step 1: Personal Information
  fullName: string;
  dob: string; // DD/MM/YYYY or YYYY-MM-DD
  gender: "Male" | "Female" | "Prefer not to say" | "";
  nationality: string;
  stateOfOrigin: string; // Required if Nigerian
  maritalStatus:
    "Single" | "Married" | "Divorced" | "Widowed" | "Prefer not to say" | "";

  // Step 2: Contact Details
  email: string; // Pre-filled, read-only
  phone: string; // Pre-filled, editable
  residentialAddress: string;
  city: string;
  stateProvince: string;
  country: string; // Pre-filled, read-only
  postalCode: string;

  // Step 3: Identification
  idType: "NIN" | "International Passport" | "Driver Licence" | "";
  idNumber: string;
  issueDate: string; // Optional
  expiryDate: string; // Required, future date
  issuingAuthority: string; // Optional

  // Step 4: Occupation
  employmentStatus:
    | "Employed"
    | "Self-Employed / Business Owner"
    | "Unemployed"
    | "Retired"
    | "Student"
    | "Other"
    | "";
  employerName: string; // Conditional
  jobTitle: string; // Conditional
  businessAddress: string; // Optional

  // Step 5: Next of Kin
  nokFullName: string;
  nokRelationship:
    | "Spouse"
    | "Parent"
    | "Child"
    | "Sibling"
    | "Extended Family"
    | "Friend"
    | "Other"
    | "";
  nokPhone: string;
  nokAddress: string;

  // Step 6: Bank Details
  bankCode: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string; // 10 digits, NUBAN validated
  accountType: "Current Account" | "Savings Account" | "Other" | "";

  // Step 7: Declaration & Digital Signature
  digitalSignature: string; // Typed name, must match Step 1 fullName
  signatureDate: string; // Auto-populated DD/MM/YYYY HH:MM
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

export type KycDocumentType =
  "GOVERNMENT_ID" | "PROOF_OF_ADDRESS" | "SPECIMEN_SIGNATURE";

export type KycDocStatus =
  | "NOT_UPLOADED"
  | "UPLOADED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "INFO_REQUESTED"
  | "REJECTED";

export interface KycDocumentRecord {
  id: string;
  userId: string;
  documentType: KycDocumentType;
  fileName: string;
  fileSize: number; // in bytes
  mimeType: string;
  fileUrl: string; // Simulated object storage or data URI
  status: KycDocStatus;
  rejectionReason?: string;
  uploadedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface DemoSettings {
  isDummyData: boolean;
}

// -------------------------------------------------------------
// DASHBOARD & PORTFOLIO MANAGEMENT TYPES
// -------------------------------------------------------------

export type InvestmentPlanType = "GIAP" | "WEALTHSTREAM";
export type InvestmentStatus =
  | "FUNDED"
  | "ACTIVE"
  | "PENDING_ALLOCATION"
  | "LISTED_FOR_RESALE"
  | "IN_NOTICE_PERIOD"
  | "READY_FOR_PAYOUT"
  | "COMPLETED"
  | "CLOSED"
  | "EXITED";

export interface PropertyMilestone {
  id: string;
  title: string;
  date: string;
  status: "COMPLETED" | "CURRENT" | "UPCOMING";
  description: string;
}

export interface GiapInvestment {
  id: string;
  userId: string;
  referenceId: string;
  capitalKobo: number; // integer kobo as mandated by specification
  initialInvestment: number;
  investmentDate: string;
  paystackReference?: string;
  propertyId: string;
  linkedPropertyId?: string | null; // NULL until Finance assigns property
  propertyTitle: string;
  propertyLocation: string;
  propertyImage: string;
  ownershipStatus: string;
  currentEvaluation: number;
  resaleTarget: number;
  projectedGrossProfit: number;
  projectedInvestorShare: number;
  isResaleCompleted: boolean;
  realizedInvestorProfit: number;
  status: InvestmentStatus;
  milestones: PropertyMilestone[];
  documents: Array<{
    id: string;
    name: string;
    category: string;
    fileUrl: string;
    date: string;
  }>;
}

export interface PayoutScheduleItem {
  id: string;
  investmentId: string;
  userId: string;
  payoutDate: string; // ISO or YYYY-MM-DD
  amount: number;
  status: "SCHEDULED" | "DUE" | "COMPLETED";
  reference?: string;
  paidAt?: string;
}

export interface WealthStreamPayout {
  id: string;
  date: string;
  amount: number;
  status: "COMPLETED" | "PROCESSING" | "SCHEDULED";
  reference?: string;
  paidAt?: string;
}

export interface WealthStreamInvestment {
  id: string;
  userId: string;
  referenceId: string;
  capitalKobo: number; // integer kobo as mandated by specification
  principal: number;
  withdrawalNoticeDays?: number;
  annualRate: number; // e.g. 0.20 or 0.24
  payoutFrequency:
    "MONTHLY" | "YEARLY" | "ANNUALLY" | "QUARTERLY" | "BI_ANNUALLY";
  payoutAmount: number; // e.g. 200,000
  startDate: string;
  nextPayoutDate: string;
  nextPayoutAmount: number;
  totalPayoutsReceived: number;
  paystackReference?: string;
  status: InvestmentStatus;
  payoutAccount: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
  };
  upcomingPayouts: WealthStreamPayout[];
  payoutSchedule?: PayoutScheduleItem[];
}

export type TransactionType =
  | "INVESTMENT_DEPOSIT"
  | "PAYOUT_DISTRIBUTION"
  | "CAPITAL_RETURN"
  | "PROFIT_SHARE";

export type TransactionStatus =
  "COMPLETED" | "PROCESSING" | "PENDING" | "FAILED";

export interface TransactionRecord {
  id: string;
  userId: string;
  reference: string;
  type: TransactionType;
  plan: InvestmentPlanType;
  title: string;
  amount: number;
  direction: "CREDIT" | "DEBIT";
  date: string;
  status: TransactionStatus;
  receiptAvailable: boolean;
  metadata?: Record<string, any>;
}

export type PortalDocCategory =
  "AGREEMENT" | "OWNERSHIP" | "RECEIPT" | "STATEMENT" | "KYC";

export interface PortalDocumentRecord {
  id: string;
  userId: string;
  name: string;
  category: PortalDocCategory;
  uploadDate: string;
  status: "VERIFIED" | "ACTIVE" | "AVAILABLE";
  fileSize: number;
  fileType: string;
  fileUrl: string;
}

export type NotificationCategory =
  "ACCOUNT" | "KYC" | "INVESTMENT" | "PAYOUT" | "DOCUMENT" | "ANNOUNCEMENT";

export interface NotificationRecord {
  id: string;
  userId: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface InvestorSettings {
  userId: string;
  emailAlerts: boolean;
  smsAlerts: boolean;
  quarterlyDigest: boolean;
  twoFactorEnabled: boolean;
  updatedAt: string;
}

export interface DatabaseSchema {
  users: User[];
  passwordResetTokens: PasswordResetToken[];
  auditLogs: StaffActionLog[];
  additionalInfoSubmissions: AdditionalInfoSubmission[];
  outbox: TransactionalEmailRecord[];
  biodata: BiodataRecord[];
  kycDocuments: KycDocumentRecord[];
  demoSettings: Record<string, DemoSettings>; // keyed by userId
  investmentsGiap: GiapInvestment[];
  investmentsWealthStream: WealthStreamInvestment[];
  payoutSchedules: PayoutScheduleItem[];
  transactions: TransactionRecord[];
  portalDocuments: PortalDocumentRecord[];
  notifications: NotificationRecord[];
  platformConfig?: import("@/lib/platform/config").PlatformConfig;
  withdrawals?: import("@/lib/platform/types").Withdrawal[];
  paymentIntents?: import("@/lib/platform/types").PaymentIntent[];
  communications?: {
    id: string;
    userId: string;
    author: string;
    note: string;
    createdAt: string;
  }[];
  settings: Record<string, InvestorSettings>; // keyed by userId
}
