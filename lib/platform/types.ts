export interface Withdrawal {
  id: string;
  userId: string;
  investmentId: string;
  principal: number;
  reason: string;
  note: string;
  status:
    | "PENDING_REVIEW"
    | "PENDING_INFORMATION"
    | "IN_NOTICE_PERIOD"
    | "REJECTED"
    | "COMPLETED";
  requestedAt: string;
  approvedAt?: string;
  noticeEndDate?: string;
  reviewNote?: string;
  reference?: string;
}
export interface PaymentIntent {
  id: string;
  userId: string;
  plan: "GIAP" | "WEALTHSTREAM";
  capital: number;
  frequency: "MONTHLY" | "ANNUALLY";
  annualRate: number;
  noticeDays: number;
  topUpId?: string;
  status: "PENDING" | "COMPLETED";
  createdAt: string;
}
