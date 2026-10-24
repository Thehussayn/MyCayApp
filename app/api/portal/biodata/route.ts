import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
  findUserById,
  getBiodataByUserId,
  saveBiodata,
  createBlankBiodata,
  updateUserKycStatus,
  recordAuditLog,
  recordEmail,
  getKycDocumentsByUserId,
  updateKycDocumentStatus,
} from "@/lib/db";
import { biodataSteps } from "@/lib/kyc/fields";
import { validateNuban } from "@/lib/kyc/nuban";
import { BiodataRecord } from "@/lib/db/types";

function calculateAge(dobStr: string): number {
  if (!dobStr) return 0;
  const birth = new Date(dobStr);
  if (isNaN(birth.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export async function GET(req: NextRequest) {
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

    if (user.disabled) {
      return NextResponse.json(
        {
          error:
            "This account is disabled. Contact support.",
        },
        { status: 403 },
      );
    }

    let biodata = getBiodataByUserId(user.id);
    if (!biodata) {
      biodata = createBlankBiodata(user);
      saveBiodata(user.id, biodata);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        country: user.country,
        status: user.status,
        kycStatus: user.kycStatus || "NOT_STARTED",
        referenceId: user.referenceId,
      },
      biodata,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to retrieve biodata." },
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

    const user = findUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (user.disabled) {
      return NextResponse.json(
        {
          error:
            "This account is disabled. Contact support.",
        },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { step, isFinalSubmit, isSaveAndExit } = body;
    if (!Number.isInteger(step) || step < 1 || step > 7)
      return NextResponse.json(
        { error: "Invalid form step." },
        { status: 400 },
      );
    const allowed = biodataSteps
      .flatMap((s) => s.fields.map((f) => f.key))
      .concat(["bankName", "digitalSignature", "acceptTerms", "acceptPrivacy"]);
    const data: Record<string, any> = Object.fromEntries(
      Object.entries(body.data || {}).filter(([key]) => allowed.includes(key)),
    );
    if (
      getBiodataByUserId(user.id)?.isSubmitted &&
      !["INFO_REQUESTED", "REJECTED"].includes(user.kycStatus || "") &&
      !session.preview
    )
      return NextResponse.json(
        {
          error:
            "Your profile is submitted. Contact support to update verified details.",
        },
        { status: 403 },
      );

    let existing = getBiodataByUserId(user.id);
    if (!existing) {
      existing = createBlankBiodata(user);
    }

    const errors: Record<string, string> = {};

    // Validate specific step if provided
    if (step === 1 || isFinalSubmit) {
      const fn = (data.fullName || existing.fullName || "").trim();
      if (!fn || fn.length < 3)
        errors.fullName = "Full legal name must be at least 3 characters.";
      if (!/^[a-zA-Z\s\-']+$/.test(fn))
        errors.fullName =
          "Full legal name can only contain letters, hyphens, and spaces.";

      const dob = data.dob || existing.dob;
      if (!dob) {
        errors.dob = "Date of birth is required.";
      } else {
        const age = calculateAge(dob);
        const birthDate = new Date(dob);
        if (birthDate >= new Date()) {
          errors.dob = "Date of birth must be in the past.";
        } else if (age < 18) {
          errors.dob = "Investor must be at least 18 years old.";
        }
      }

      if (!data.gender && !existing.gender)
        errors.gender = "Please select your gender.";
      if (!data.nationality && !existing.nationality)
        errors.nationality = "Nationality is required.";
      if (
        (data.nationality === "Nigeria" ||
          existing.nationality === "Nigeria") &&
        !data.stateOfOrigin &&
        !existing.stateOfOrigin
      ) {
        errors.stateOfOrigin =
          "State of origin is required for Nigerian citizens.";
      }
      if (!data.maritalStatus && !existing.maritalStatus)
        errors.maritalStatus = "Please select your marital status.";
    }

    if (step === 2 || isFinalSubmit) {
      const addr = (
        data.residentialAddress ||
        existing.residentialAddress ||
        ""
      ).trim();
      if (!addr || addr.length < 10)
        errors.residentialAddress =
          "Residential address must be at least 10 characters.";

      const city = (data.city || existing.city || "").trim();
      if (!city || city.length < 2) errors.city = "City / LGA is required.";

      const state = (data.stateProvince || existing.stateProvince || "").trim();
      if (!state) errors.stateProvince = "State / Province is required.";
    }

    if (step === 3 || isFinalSubmit) {
      const idType = data.idType || existing.idType;
      const idNum = (data.idNumber || existing.idNumber || "").trim();

      if (!idType)
        errors.idType = "Please select an identification document type.";
      if (!idNum) {
        errors.idNumber = "ID number is required.";
      } else {
        if (idType === "NIN" && !/^\d{11}$/.test(idNum)) {
          errors.idNumber = "NIN must be exactly 11 numeric digits.";
        } else if (
          idType === "International Passport" &&
          !/^[A-Za-z0-9]{8,10}$/.test(idNum)
        ) {
          errors.idNumber =
            "Passport number must be 8–10 alphanumeric characters.";
        } else if (
          idType === "Driver Licence" &&
          !/^[A-Za-z0-9]{8,12}$/.test(idNum)
        ) {
          errors.idNumber =
            "Driver's Licence must be 8–12 alphanumeric characters.";
        }
      }

      const expiry = data.expiryDate || existing.expiryDate;
      if (!expiry) {
        errors.expiryDate = "Document expiry date is required.";
      } else {
        const expDate = new Date(expiry);
        if (expDate <= new Date()) {
          errors.expiryDate =
            "Document has expired. Expiry date must be in the future.";
        }
      }
    }

    if (step === 4 || isFinalSubmit) {
      const empStatus = data.employmentStatus || existing.employmentStatus;
      if (!empStatus)
        errors.employmentStatus = "Please select your employment status.";

      if (
        empStatus === "Employed" ||
        empStatus === "Self-Employed / Business Owner"
      ) {
        const empName = (
          data.employerName ||
          existing.employerName ||
          ""
        ).trim();
        const jobTitle = (data.jobTitle || existing.jobTitle || "").trim();
        if (!empName)
          errors.employerName = "Employer or Business name is required.";
        if (!jobTitle)
          errors.jobTitle = "Job title or business type is required.";
      }
    }

    if (step === 5 || isFinalSubmit) {
      const nokName = (data.nokFullName || existing.nokFullName || "").trim();
      if (!nokName || nokName.length < 3)
        errors.nokFullName = "Next of kin name must be at least 3 characters.";

      if (!data.nokRelationship && !existing.nokRelationship) {
        errors.nokRelationship =
          "Please specify relationship with next of kin.";
      }

      const nokPhone = (data.nokPhone || existing.nokPhone || "").trim();
      if (!nokPhone || nokPhone.length < 8)
        errors.nokPhone = "Valid phone number is required.";

      const nokAddr = (data.nokAddress || existing.nokAddress || "").trim();
      if (!nokAddr || nokAddr.length < 10)
        errors.nokAddress =
          "Next of kin residential address must be at least 10 characters.";
    }

    if (step === 6 || isFinalSubmit) {
      const bankCode = data.bankCode || existing.bankCode;
      const accNum = (
        data.accountNumber ||
        existing.accountNumber ||
        ""
      ).trim();
      const holder = (
        data.accountHolderName ||
        existing.accountHolderName ||
        ""
      ).trim();

      if (!bankCode) errors.bankName = "Please select your bank.";
      if (!holder || holder.length < 3)
        errors.accountHolderName = "Account holder name is required.";

      const nubanRes = validateNuban(bankCode, accNum);
      if (!nubanRes.isValid) {
        errors.accountNumber =
          nubanRes.error || "Invalid account number. Please verify.";
      }
    }

    if (isFinalSubmit && !session.preview) {
      const documents = getKycDocumentsByUserId(user.id);
      const missing = [
        "GOVERNMENT_ID",
        "PROOF_OF_ADDRESS",
        "SPECIMEN_SIGNATURE",
      ].filter((t) => !documents.some((d) => d.documentType === t));
      if (missing.length)
        return NextResponse.json(
          {
            error:
              "Upload your ID, proof of address, and specimen signature before submitting.",
          },
          { status: 400 },
        );
    }
    // Check errors if not saving intermediate draft or if final submit
    if (
      Object.keys(errors).length > 0 &&
      (!isSaveAndExit || isFinalSubmit) &&
      !session.preview
    ) {
      return NextResponse.json(
        { error: "Validation failed", errors },
        { status: 400 },
      );
    }

    // Merge and update completed steps
    const newCompleted = new Set(existing.completedSteps || []);
    if (step && Object.keys(errors).length === 0) {
      newCompleted.add(step);
    }

    // Final Step 7 Submission
    if (isFinalSubmit) {
      const legalName = (data.fullName || existing.fullName || "").trim();
      const typedSig = (data.digitalSignature || "").trim();

      if (!typedSig && !session.preview) {
        return NextResponse.json(
          {
            error: "Validation failed",
            errors: { digitalSignature: "Digital signature is required." },
          },
          { status: 400 },
        );
      }

      if (
        !session.preview &&
        typedSig.toLowerCase() !== legalName.toLowerCase()
      ) {
        return NextResponse.json(
          {
            error: "Validation failed",
            errors: {
              digitalSignature:
                "Digital signature must match your Full Legal Name exactly (case-insensitive).",
            },
          },
          { status: 400 },
        );
      }

      if (!data.acceptTerms && !session.preview) {
        return NextResponse.json(
          {
            error: "Validation failed",
            errors: { acceptTerms: "You must accept the platform terms." },
          },
          { status: 400 },
        );
      }

      if (!data.acceptPrivacy && !session.preview) {
        return NextResponse.json(
          {
            error: "Validation failed",
            errors: {
              acceptPrivacy: "You must accept the NDPR Privacy Policy.",
            },
          },
          { status: 400 },
        );
      }

      // Add Step 7 to completed
      newCompleted.add(7);

      const updated = saveBiodata(user.id, {
        ...data,
        signatureDate: new Date().toISOString(),
        completedSteps: Array.from(newCompleted),
        isSubmitted: true,
        submittedAt: new Date().toISOString(),
        currentStep: 7,
      });

      for (const doc of getKycDocumentsByUserId(user.id))
        if (doc.status !== "APPROVED")
          updateKycDocumentStatus(doc.id, "UNDER_REVIEW");
      updateUserKycStatus(user.id, "SUBMITTED");

      // Audit Log
      recordAuditLog({
        actorId: user.id,
        actorEmail: user.email,
        actorRole: user.role,
        targetUserId: user.id,
        targetUserEmail: user.email,
        action: existing.isSubmitted ? "BIODATA_EDITED" : "BIODATA_SUBMITTED",
        beforeStatus: existing.isSubmitted
          ? "BIODATA_SUBMITTED"
          : "BIODATA_IN_PROGRESS",
        afterStatus: "BIODATA_SUBMITTED",
        notes: `Investor submitted 7-step biodata successfully. Digital signature: ${typedSig}`,
      });

      // Email Notification
      recordEmail({
        to: user.email,
        subject: "Biodata Submission Acknowledged — MyCayApp by Jeje-Ola",
        template: "BIODATA_SUBMITTED",
        payload: {
          investorName: updated.fullName,
          referenceId: user.referenceId,
          submittedAt: updated.submittedAt,
        },
      });

      return NextResponse.json({
        success: true,
        biodata: updated,
        redirectUrl: "/portal/verification",
        message:
          "Your KYC details and documents have been submitted for staff review.",
      });
    }

    // Step save (Save & Exit or Next step progression)
    const nextStep = step && step < 7 ? step + 1 : step || existing.currentStep;
    const updated = saveBiodata(user.id, {
      ...data,
      completedSteps: Array.from(newCompleted),
      currentStep: nextStep,
    });

    if (user.kycStatus === "NOT_STARTED" || !user.kycStatus) {
      updateUserKycStatus(user.id, "BIODATA_IN_PROGRESS");
    }

    recordAuditLog({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      targetUserId: user.id,
      targetUserEmail: user.email,
      action: "BIODATA_SAVED",
      notes: `Investor saved biodata progress at Step ${step || existing.currentStep}`,
    });

    return NextResponse.json({
      success: true,
      biodata: updated,
      message: isSaveAndExit ? "Progress saved successfully." : "Step saved.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to save biodata." },
      { status: 500 },
    );
  }
}
