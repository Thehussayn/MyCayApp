import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser, recordAuditLog } from "@/lib/db";
import { hashPassword, isPasswordValid } from "@/lib/auth/password";
import { sendRegistrationAcknowledgement } from "@/lib/email";
import crypto from "crypto";
import { isHostedDemo } from "@/lib/demo/state";
import { signSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
      console.error("Registration unavailable: SESSION_SECRET is missing.");
      return NextResponse.json({ error: "Registration is temporarily unavailable. Please contact support." }, { status: 503 });
    }
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      country,
      password,
      confirmPassword,
      termsAccepted,
      privacyAccepted,
    } = body;

    // 1. Validation
    if (
      !fullName ||
      typeof fullName !== "string" ||
      fullName.trim().length < 2
    ) {
      return NextResponse.json(
        { error: "Please enter your full legal name." },
        { status: 400 },
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (!phone || typeof phone !== "string" || phone.trim().length < 5) {
      return NextResponse.json(
        { error: "Please provide a valid phone number with country code." },
        { status: 400 },
      );
    }

    if (!country || typeof country !== "string") {
      return NextResponse.json(
        { error: "Please select your country of residence." },
        { status: 400 },
      );
    }

    if (!termsAccepted) {
      return NextResponse.json(
        { error: "You must accept the Terms and Conditions to proceed." },
        { status: 400 },
      );
    }

    if (!privacyAccepted) {
      return NextResponse.json(
        { error: "You must accept the Privacy Policy to proceed." },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match." },
        { status: 400 },
      );
    }

    if (!isPasswordValid(password)) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.",
        },
        { status: 400 },
      );
    }

    // 2. Check if user already exists
    const existing = findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        {
          error:
            "An account with this email address already exists. Please sign in instead.",
        },
        { status: 409 },
      );
    }

    // 3. Create User record
    const { hash, salt } = hashPassword(password);
    const now = new Date().toISOString();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceId = `JOP-INV-2026-${randomSuffix}`;

    const newUser = createUser({
      id: `user_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      country: country.trim(),
      passwordHash: hash,
      salt,
      role: "INVESTOR",
      status: "APPROVED",
      kycStatus: "NOT_STARTED",
      termsAccepted: true,
      privacyAccepted: true,
      createdAt: now,
      updatedAt: now,
      failedLoginAttempts: 0,
      referenceId,
    });

    // 4. Record Audit Log
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    recordAuditLog({
      actorId: newUser.id,
      actorEmail: newUser.email,
      actorRole: "INVESTOR",
      targetUserId: newUser.id,
      targetUserEmail: newUser.email,
      action: "REGISTER",
      afterStatus: "APPROVED",
      notes:
        "Account created with portal access. Seven-step KYC must be submitted for staff review.",
      ipAddress: ip,
    });

    // 5. Send Transactional Acknowledgement Email
    await sendRegistrationAcknowledgement(
      newUser.email,
      newUser.fullName,
      newUser.referenceId,
    );

    const response = NextResponse.json(
      {
        success: true,
        message: "Account created. Complete your KYC in the portal.",
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          phone: newUser.phone,
          country: newUser.country,
          role: newUser.role,
          status: newUser.status,
          kycStatus: newUser.kycStatus,
          referenceId: newUser.referenceId,
          createdAt: newUser.createdAt,
        },
      },
      { status: 201 },
    );
    response.cookies.set(SESSION_COOKIE_NAME, signSession(newUser, 7200, isHostedDemo(), isHostedDemo() ? crypto.randomUUID() : undefined), {
      httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: "lax", path: "/", maxAge: 7200,
    });
    return response;
  } catch (err: any) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "An error occurred during registration. Please try again." },
      { status: 500 },
    );
  }
}
