"use client";

import React, { useState } from "react";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import Button from "@/components/ui/Button";
import {
  Mail,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        setErrorMessage("Unable to process request. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setErrorMessage("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <AuthShell
        kicker="Security Verification"
        title="Check Your Inbox"
        subtitle="Password recovery instructions have been dispatched."
      >
        <div className="bg-[#F8F8F6] border border-neutral-200/90 rounded-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#BE933C]/10 border border-[#BE933C]/30 flex items-center justify-center shrink-0 text-[#BE933C]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#252A2D]">
                Reset Link Dispatched
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
                If an account with{" "}
                <span className="font-semibold text-[#252A2D]">{email}</span>{" "}
                exists in our system, you will receive an email containing a
                secure, single-use link.
              </p>
            </div>
          </div>

          <div className="p-4 bg-white border border-neutral-200 rounded-sm text-xs text-neutral-600 space-y-2">
            <p className="font-semibold text-[#252A2D]">Security Rules:</p>
            <p>
              • The reset link is single-use and will automatically expire in{" "}
              <strong>one hour</strong>.
            </p>
            <p>
              • If you do not see the email, please check your spam or junk
              folder.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Button
              href="/login"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Return to Sign In
            </Button>
            <Button
              onClick={() => {
                setSubmitted(false);
                setEmail("");
              }}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              Try Another Email
            </Button>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      kicker="Account Security"
      title="Reset Your Password"
      subtitle="Enter your registered email address and we will send you a secure link to reset your credentials."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm rounded-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>{errorMessage}</div>
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-xs uppercase tracking-wider font-semibold text-[#252A2D] mb-2"
          >
            Registered Email Address <span className="text-[#BE933C]">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="investor@organization.com"
            className="w-full px-4 py-3 text-sm bg-white border border-neutral-300 rounded-sm text-[#252A2D] placeholder-neutral-400 focus:outline-none focus:border-[#BE933C] focus:ring-1 focus:ring-[#BE933C] transition-colors"
          />
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
            {isSubmitting ? "Dispatching Link..." : "Send Reset Instructions"}
          </Button>
        </div>

        <div className="pt-4 text-center border-t border-neutral-200">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-[#252A2D] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
