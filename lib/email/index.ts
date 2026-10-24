import { recordEmail } from "@/lib/db";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function createEmailShell(title: string, content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8F8F6; margin: 0; padding: 40px 20px; color: #252A2D; }
    .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E4E4E7; border-radius: 4px; overflow: hidden; }
    .header { background: #252A2D; padding: 32px 40px; text-align: left; border-bottom: 2px solid #BE933C; }
    .brand-title { color: #FFFFFF; font-size: 20px; font-weight: 800; letter-spacing: 0.05em; margin: 0; }
    .brand-subtitle { color: #BE933C; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 4px; }
    .body { padding: 40px; font-size: 15px; line-height: 1.6; color: #27272A; }
    .h1 { font-size: 22px; font-weight: 700; color: #252A2D; margin-top: 0; margin-bottom: 16px; }
    .button { display: inline-block; background: #BE933C; color: #252A2D !important; text-decoration: none; padding: 12px 28px; font-weight: 600; font-size: 14px; border-radius: 2px; margin: 24px 0; }
    .callout { background: #F4F4F5; border-left: 3px solid #BE933C; padding: 16px; margin: 20px 0; font-size: 14px; }
    .footer { background: #FAFAFA; border-top: 1px solid #E4E4E7; padding: 24px 40px; font-size: 12px; color: #71717A; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand-title">MYCAYAPP</div>
      <div class="brand-subtitle">Jeje-Ola Properties Nig. Ltd. · Investor Portal</div>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <strong>Jeje-Ola Properties Nig. Ltd.</strong> · RC.1317171<br>
      Plot 1059, Adamu Allero Crescent, Guzape, Abuja, Nigeria<br>
      Direct Advisory: +234 8066 873 988 · info@jejeolaproperties.com.ng<br>
      This is a secure institutional communication. Please do not reply directly to this automated email.
    </div>
  </div>
</body>
</html>
  `;
}

export async function sendRegistrationAcknowledgement(email: string, name: string, referenceId: string) {
  const subject = "Your Investor Registration Has Been Received — MyCayApp by Jeje-Ola";
  const html = createEmailShell(
    subject,
    `
    <h1 class="h1">Your account is ready</h1>
    <p>Dear ${name},</p>
    <p>Your MyCayApp account has been created. You can access the investor portal immediately.</p>
    <div class="callout"><strong>Account reference:</strong> ${referenceId}</div>
    <p>Complete the seven-step KYC in the portal. Our staff will review your submitted details and documents before you can invest.</p>
    <a href="${BASE_URL}/login" class="button">Open Investor Portal</a>
    `
  );

  recordEmail({
    to: email,
    subject,
    template: "REGISTRATION_ACKNOWLEDGED",
    payload: { name, referenceId, html },
  });
}

export async function sendApplicationApproved(email: string, name: string) {
  const subject = "KYC Approved — MyCayApp by Jeje-Ola";
  const html = createEmailShell(
    subject,
    `
    <h1 class="h1">Your KYC is approved</h1>
    <p>Dear ${name},</p>
    <p>Our staff have approved your submitted KYC details and documents.</p>
    <div class="callout">
      <strong>Next Step:</strong> Choose a GIAP or WealthStream investment in your portal.
    </div>
    <p>Sign in to create your investment:</p>
    <a href="${BASE_URL}/login" class="button">View investments</a>
    <p>Your agreements and investment records will be available in the portal.</p>
    `
  );

  recordEmail({
    to: email,
    subject,
    template: "APPLICATION_APPROVED",
    payload: { name, html },
  });
}

export async function sendApplicationDeclined(email: string, name: string, reason: string) {
  const subject = "Update Regarding Your MyCayApp KYC";
  const html = createEmailShell(
    subject,
    `
    <h1 class="h1">KYC review notice</h1>
    <p>Dear ${name},</p>
    <p>Thank you for your interest in <strong>MyCayApp by Jeje-Ola Properties</strong>.</p>
    <p>Our staff could not approve your submitted KYC.</p>
    <div class="callout">
      <strong>Reason:</strong> ${reason}
    </div>
    <p>If you believe this decision was made in error or wish to discuss alternative advisory services, please contact our executive advisory team directly at <a href="mailto:info@jejeolaproperties.com.ng">info@jejeolaproperties.com.ng</a> or call <strong>+234 8066 873 988</strong>.</p>
    `
  );

  recordEmail({
    to: email,
    subject,
    template: "APPLICATION_DECLINED",
    payload: { name, reason, html },
  });
}

export async function sendInformationRequested(email: string, name: string, requestDetails: string) {
  const subject = "Action Required: Update Your MyCayApp KYC";
  const html = createEmailShell(
    subject,
    `
    <h1 class="h1">Clarification Requested</h1>
    <p>Dear ${name},</p>
    <p>Our staff reviewed your submitted KYC and need the following information.</p>
    <div class="callout">
      <strong>Staff Inquiry:</strong> ${requestDetails}
    </div>
    <p>Please log in to your account and submit the requested clarification through your KYC screen.</p>
    <a href="${BASE_URL}/login" class="button">Submit Clarification</a>
    `
  );

  recordEmail({
    to: email,
    subject,
    template: "INFORMATION_REQUESTED",
    payload: { name, requestDetails, html },
  });
}

export async function sendPasswordResetEmail(email: string, name: string, resetToken: string) {
  const resetUrl = `${BASE_URL}/reset-password?token=${resetToken}`;
  const subject = "Reset Your MyCayApp Password";
  const html = createEmailShell(
    subject,
    `
    <h1 class="h1">Password Reset Request</h1>
    <p>Dear ${name},</p>
    <p>We received a request to reset the password for your <strong>MyCayApp Investor Portal</strong> account.</p>
    <p>To set a new password, please click the secure link below. This link is single-use and will expire in <strong>one hour</strong>.</p>
    <a href="${resetUrl}" class="button">Reset Password</a>
    <p>If the button above does not work, copy and paste the following link into your browser:</p>
    <p style="word-break: break-all; font-size: 13px; color: #52525B;">${resetUrl}</p>
    <p>If you did not request a password reset, please ignore this email. Your existing credentials remain completely secure.</p>
    `
  );

  recordEmail({
    to: email,
    subject,
    template: "PASSWORD_RESET",
    payload: { name, resetToken, resetUrl, html },
  });
}
