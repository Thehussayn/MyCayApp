"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import Button from "@/components/ui/Button";
import {
  Eye,
  EyeOff,
  Check,
  X,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { validatePasswordCriteria, isPasswordValid } from "@/lib/auth/password";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [checkingToken, setCheckingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenErrorReason, setTokenErrorReason] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const passwordCriteria = validatePasswordCriteria(password);
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  useEffect(() => {
    async function verify() {
      if (!token) {
        setTokenValid(false);
        setTokenErrorReason("No reset token provided.");
        setCheckingToken(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/auth/reset-password?token=${encodeURIComponent(token)}`,
        );
        const data = await res.json();
        if (res.ok && data.valid) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setTokenErrorReason(
            data.reason ||
              "This password reset link is invalid or has expired.",
          );
        }
      } catch {
        setTokenValid(false);
        setTokenErrorReason("Unable to verify link validity.");
      } finally {
        setCheckingToken(false);
      }
    }
    verify();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!isPasswordValid(password)) {
      setErrorMessage(
        "Your new password does not satisfy all institutional security criteria.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to update password.");
        setIsSubmitting(false);
        return;
      }

      setResetSuccess(true);
    } catch {
      setErrorMessage("An unexpected network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // State 1: Verifying Token
  if (checkingToken) {
    return (
      <AuthShell kicker="Account Security" title="Verifying Security Token">
        <div className="py-12 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#BE933C] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-neutral-500 font-medium">
            Validating single-use reset token...
          </p>
        </div>
      </AuthShell>
    );
  }

  // State 2: Expired or Invalid Link Screen
  if (!tokenValid) {
    return (
      <AuthShell
        kicker="Security Notice"
        title="Link Expired or Invalid"
        subtitle="This password reset link cannot be used."
      >
        <div className="bg-[#F8F8F6] border border-neutral-200/90 rounded-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#252A2D]">
                Token Invalidation Notice
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
                {tokenErrorReason ||
                  "This password reset link is invalid or has expired. Password reset links are valid for one hour and can only be used once."}
              </p>
            </div>
          </div>

          <div className="p-4 bg-white border border-neutral-200 rounded-sm text-xs text-neutral-600">
            For your institutional security, tokens are immediately invalidated
            once accessed or after 60 minutes of issuance.
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Button
              href="/forgot-password"
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Request New Reset Link
            </Button>
            <Button
              href="/login"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              Return to Sign In
            </Button>
          </div>
        </div>
      </AuthShell>
    );
  }

  // State 3: Reset Success Screen
  if (resetSuccess) {
    return (
      <AuthShell
        kicker="Security Notice"
        title="Password Successfully Updated"
        subtitle="Your credentials have been securely refreshed."
      >
        <div className="bg-[#F8F8F6] border border-neutral-200/90 rounded-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#252A2D]">
                Reset Complete
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
                Your new password is now active. All previous sessions have been
                invalidated across all devices.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button
              href="/login"
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Sign In with New Password
            </Button>
          </div>
        </div>
      </AuthShell>
    );
  }

  // State 4: Reset Password Form
  return (
    <AuthShell
      kicker="Account Security"
      title="Create New Password"
      subtitle="Choose a strong, unique password for your MyCayApp investor portal."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm rounded-sm">
            {errorMessage}
          </div>
        )}

        {/* New Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs uppercase tracking-wider font-semibold text-[#252A2D] mb-1.5"
          >
            New Password <span className="text-[#BE933C]">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 text-sm bg-white border border-neutral-300 rounded-sm text-[#252A2D] placeholder-neutral-400 focus:outline-none focus:border-[#BE933C] focus:ring-1 focus:ring-[#BE933C] transition-colors pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#252A2D] focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Real-time Checklist */}
          {password.length > 0 && (
            <div className="mt-3 p-3 bg-neutral-50 border border-neutral-200 rounded-sm text-xs space-y-1.5">
              <span className="font-semibold text-neutral-700 block mb-1">
                Security Checklist:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                <div
                  className={`flex items-center gap-1.5 ${passwordCriteria.minLength ? "text-emerald-700" : "text-neutral-500"}`}
                >
                  {passwordCriteria.minLength ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-neutral-400" />
                  )}
                  <span>8+ characters</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${passwordCriteria.hasUppercase ? "text-emerald-700" : "text-neutral-500"}`}
                >
                  {passwordCriteria.hasUppercase ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-neutral-400" />
                  )}
                  <span>1 uppercase letter</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${passwordCriteria.hasNumber ? "text-emerald-700" : "text-neutral-500"}`}
                >
                  {passwordCriteria.hasNumber ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-neutral-400" />
                  )}
                  <span>1 numeric digit</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${passwordCriteria.hasSpecial ? "text-emerald-700" : "text-neutral-500"}`}
                >
                  {passwordCriteria.hasSpecial ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-neutral-400" />
                  )}
                  <span>1 special character</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs uppercase tracking-wider font-semibold text-[#252A2D] mb-1.5"
          >
            Confirm New Password <span className="text-[#BE933C]">*</span>
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 text-sm bg-white border border-neutral-300 rounded-sm text-[#252A2D] placeholder-neutral-400 focus:outline-none focus:border-[#BE933C] focus:ring-1 focus:ring-[#BE933C] transition-colors pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#252A2D] focus:outline-none"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="mt-1 text-xs text-red-600">Passwords do not match.</p>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full justify-center"
          >
            {isSubmitting ? "Updating Password..." : "Update Password"}
          </Button>
        </div>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#BE933C] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
