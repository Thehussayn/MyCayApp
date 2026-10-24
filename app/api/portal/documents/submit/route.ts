import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
  findUserById,
  getKycDocumentsByUserId,
  getBiodataByUserId,
  updateKycDocumentStatus,
  updateUserKycStatus,
  recordAuditLog,
  recordEmail,
} from "@/lib/db";
import { KycDocumentType } from "@/lib/db/types";

const REQUIRED_DOC_TYPES: KycDocumentType[] = [
  "GOVERNMENT_ID",
  "PROOF_OF_ADDRESS",
  "SPECIMEN_SIGNATURE",
];

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 },
      );
    }

    const user = findUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (!getBiodataByUserId(user.id)?.isSubmitted)
      return NextResponse.json(
        { error: "Submit your profile before submitting documents." },
        { status: 400 },
      );
    const existingDocs = getKycDocumentsByUserId(user.id);
    const uploadedTypes = new Set(existingDocs.map((d) => d.documentType));

    const missing = REQUIRED_DOC_TYPES.filter((t) => !uploadedTypes.has(t));
    if (missing.length > 0) {
      const missingNames = missing.map((m) => m.replace(/_/g, " "));
      return NextResponse.json(
        {
          error: `Please upload all required documents before submitting: ${missingNames.join(", ")}.`,
          missing,
        },
        { status: 400 },
      );
    }

    // Set all documents to UNDER_REVIEW
    for (const doc of existingDocs) {
      if (doc.status !== "APPROVED")
        updateKycDocumentStatus(doc.id, "UNDER_REVIEW");
    }

    // Update investor's KYC status to SUBMITTED
    updateUserKycStatus(user.id, "SUBMITTED");

    // Audit Log
    recordAuditLog({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      targetUserId: user.id,
      targetUserEmail: user.email,
      action: "KYC_DOC_SUBMITTED",
      beforeStatus: "DOCUMENTS_PENDING",
      afterStatus: "SUBMITTED",
      notes: "Investor submitted 3 KYC documents for staff compliance review.",
    });

    // Confirmation Email
    recordEmail({
      to: user.email,
      subject: "KYC Documents Received — Verification in Progress",
      template: "DOCUMENTS_RECEIVED",
      payload: {
        investorName: user.fullName,
        referenceId: user.referenceId,
        documentCount: existingDocs.length,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your documents have been submitted.",
      kycStatus: "SUBMITTED",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to submit documents for review." },
      { status: 500 },
    );
  }
}
