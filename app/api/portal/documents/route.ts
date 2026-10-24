import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
  findUserById,
  getBiodataByUserId,
  getKycDocumentsByUserId,
  getInvestorDocuments,
  saveKycDocument,
  deleteKycDocument,
  recordAuditLog,
  updateUserKycStatus,
} from "@/lib/db";
import { operator } from "@/lib/platform/access";
import { KycDocumentType } from "@/lib/db/types";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 },
      );
    }

    const targetId = req.nextUrl.searchParams.get("userId");
    if (targetId && !operator("review"))
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    const user = findUserById(targetId || session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const biodata = getBiodataByUserId(user.id);
    const documents = getKycDocumentsByUserId(user.id);
    const portalDocuments = getInvestorDocuments(user.id);

    return NextResponse.json({
      success: true,
      kycStatus: user.kycStatus || "NOT_STARTED",
      biodata: biodata
        ? {
            fullName: biodata.fullName,
            idType: biodata.idType,
            idNumber: biodata.idNumber,
            residentialAddress: biodata.residentialAddress,
            isSubmitted: biodata.isSubmitted,
          }
        : null,
      documents,
      portalDocuments,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to retrieve documents." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 },
      );
    }

    const body = await req.json();
    if (body.userId && !operator("review"))
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    const user = findUserById(body.userId || session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const { documentType, fileName, fileSize, mimeType, fileUrl } = body;

    const validTypes: KycDocumentType[] = [
      "GOVERNMENT_ID",
      "PROOF_OF_ADDRESS",
      "SPECIMEN_SIGNATURE",
    ];
    if (!validTypes.includes(documentType)) {
      return NextResponse.json(
        { error: "Invalid document type requested." },
        { status: 400 },
      );
    }

    if (!fileName || !fileSize) {
      return NextResponse.json(
        { error: "File name and size are required." },
        { status: 400 },
      );
    }

    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds the 10 MB maximum allowed size." },
        { status: 400 },
      );
    }

    if (mimeType && !ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
      return NextResponse.json(
        {
          error: "Invalid file format. Accepted formats are PDF, JPG, and PNG.",
        },
        { status: 400 },
      );
    }

    if (
      documentType === "SPECIMEN_SIGNATURE" &&
      mimeType === "application/pdf"
    ) {
      return NextResponse.json(
        { error: "Upload a JPG or PNG signature." },
        { status: 400 },
      );
    }
    const encoded =
      /^data:(application\/pdf|image\/jpeg|image\/png);base64,([A-Za-z0-9+/=]+)$/.exec(
        fileUrl || "",
      );
    if (!encoded || encoded[1] !== mimeType)
      return NextResponse.json(
        { error: "Upload a valid file." },
        { status: 400 },
      );
    const bytes = Buffer.from(encoded[2], "base64");
    const valid =
      mimeType === "application/pdf"
        ? bytes.subarray(0, 5).toString() === "%PDF-"
        : mimeType === "image/png"
          ? bytes
              .subarray(0, 8)
              .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
          : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
    if (!valid || bytes.length !== fileSize || bytes.length > MAX_FILE_SIZE)
      return NextResponse.json(
        { error: "The file content or size is invalid." },
        { status: 400 },
      );
    // Save document
    const savedDoc = saveKycDocument({
      userId: user.id,
      documentType,
      fileName,
      fileSize,
      mimeType: mimeType || "application/pdf",
      fileUrl,
      status: "UPLOADED",
    });

    updateUserKycStatus(user.id, "DOCUMENTS_PENDING");
    recordAuditLog({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      targetUserId: user.id,
      targetUserEmail: user.email,
      action: "KYC_DOC_UPLOADED",
      notes: `Uploaded ${documentType} file: ${fileName} (${Math.round(fileSize / 1024)} KB)`,
    });

    return NextResponse.json({
      success: true,
      document: savedDoc,
      message: `${documentType.replace(/_/g, " ")} uploaded successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to upload document." },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { documentType } = body;

    const validTypes: KycDocumentType[] = [
      "GOVERNMENT_ID",
      "PROOF_OF_ADDRESS",
      "SPECIMEN_SIGNATURE",
    ];
    if (!validTypes.includes(documentType)) {
      return NextResponse.json(
        { error: "Invalid document type requested." },
        { status: 400 },
      );
    }

    const removed = deleteKycDocument(session.userId, documentType);

    recordAuditLog({
      actorId: session.userId,
      actorEmail: session.email,
      actorRole: session.role,
      targetUserId: session.userId,
      targetUserEmail: session.email,
      action: "KYC_DOC_UPLOADED",
      notes: `Removed document: ${documentType}`,
    });

    return NextResponse.json({
      success: true,
      removed,
      message: `${documentType.replace(/_/g, " ")} removed successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to remove document." },
      { status: 500 },
    );
  }
}
