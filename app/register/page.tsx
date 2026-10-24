"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import Button from "@/components/ui/Button";
import {
  Eye,
  EyeOff,
  Check,
  X,
  ArrowRight,
} from "lucide-react";
import { validatePasswordCriteria, isPasswordValid } from "@/lib/auth/password";

const COUNTRIES = [
  "Nigeria",
  "United Kingdom",
  "United States",
  "Canada",
  "United Arab Emirates",
  "Ghana",
  "South Africa",
  "Kenya",
  "Germany",
  "France",
  "Australia",
  "Other",
];

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+234 ");
  const [country, setCountry] = useState("Nigeria");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const passwordCriteria = validatePasswordCriteria(password);
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage("Please enter your full legal name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!phone.trim() || phone.trim().length < 7) {
      setErrorMessage(
        "Please enter a valid phone number with your country code.",
      );
      return;
    }

    if (!country) {
      setErrorMessage("Please select your country of residence.");
      return;
    }

    if (!isPasswordValid(password)) {
      setErrorMessage("Use a password that meets the requirements below.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!termsAccepted) {
      setErrorMessage("Please accept the Terms & Conditions to proceed.");
      return;
    }

    if (!privacyAccepted) {
      setErrorMessage("Please accept the Privacy Policy to proceed.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          country,
          password,
          confirmPassword,
          termsAccepted,
          privacyAccepted,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(
          data.error || "Registration failed. Please check your details.",
        );
        setIsSubmitting(false);
        return;
      }

      router.push("/portal/dashboard");
    } catch {
      setErrorMessage(
        "Unable to connect to the registration service. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <AuthShell
      kicker="MyCayApp"
      title="Create Account"
      subtitle="Create your account, then complete your KYC in the portal."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm rounded-sm">
            {errorMessage}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          {[["firstName", "First Name", firstName, setFirstName], ["lastName", "Last Name", lastName, setLastName]].map(([id, label, value, setter]) => (
            <label key={id as string} className="field" htmlFor={id as string}>
              <span>{label as string} <span className="text-brand-gold">*</span></span>
              <input id={id as string} autoComplete={id === "firstName" ? "given-name" : "family-name"} required value={value as string} onChange={e => (setter as (v: string) => void)(e.target.value)} />
            </label>
          ))}
        </div>

        {/* Email Address */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs uppercase tracking-wider font-semibold text-[#252A2D] mb-1.5"
          >
            Email Address <span className="text-[#BE933C]">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="investor@organization.com"
            className="w-full px-4 py-3 text-sm bg-white border border-neutral-300 rounded-sm text-[#252A2D] placeholder-neutral-400 focus:outline-none focus:border-[#BE933C] focus:ring-1 focus:ring-[#BE933C] transition-colors"
          />
        </div>

        {/* Phone & Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="phone"
              className="block text-xs uppercase tracking-wider font-semibold text-[#252A2D] mb-1.5"
            >
              Phone Number <span className="text-[#BE933C]">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234 800 000 0000"
              className="w-full px-4 py-3 text-sm bg-white border border-neutral-300 rounded-sm text-[#252A2D] placeholder-neutral-400 focus:outline-none focus:border-[#BE933C] focus:ring-1 focus:ring-[#BE933C] transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-xs uppercase tracking-wider font-semibold text-[#252A2D] mb-1.5"
            >
              Country of Residence <span className="text-[#BE933C]">*</span>
            </label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-white border border-neutral-300 rounded-sm text-[#252A2D] focus:outline-none focus:border-[#BE933C] focus:ring-1 focus:ring-[#BE933C] transition-colors"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs uppercase tracking-wider font-semibold text-[#252A2D] mb-1.5"
          >
            Password <span className="text-[#BE933C]">*</span>
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

          {/* Real-time Password Criteria Checklist */}
          {password.length > 0 && (
            <div className="mt-3 p-3 bg-neutral-50 border border-neutral-200 rounded-sm text-xs space-y-1.5">
              <span className="font-semibold text-neutral-700 block mb-1">
                Password Security Requirements:
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
                  <span>At least 8 characters</span>
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

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs uppercase tracking-wider font-semibold text-[#252A2D] mb-1.5"
          >
            Confirm Password <span className="text-[#BE933C]">*</span>
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

        {/* Separate Terms and Privacy Checkboxes */}
        <div className="space-y-2.5 pt-2">
          <div className="flex items-start gap-2.5">
            <input
              id="terms"
              type="checkbox"
              required
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 rounded-sm border-neutral-300 text-[#BE933C] focus:ring-[#BE933C]"
            />
            <label
              htmlFor="terms"
              className="text-xs text-neutral-600 cursor-pointer select-none"
            >
              I accept the{" "}
              <Link
                href="/about"
                className="text-[#252A2D] font-semibold underline hover:text-[#BE933C]"
              >
                Terms &amp; Conditions
              </Link>{" "}
              governing investment operations on MyCayApp.{" "}
              <span className="text-[#BE933C]">*</span>
            </label>
          </div>

          <div className="flex items-start gap-2.5">
            <input
              id="privacy"
              type="checkbox"
              required
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 rounded-sm border-neutral-300 text-[#BE933C] focus:ring-[#BE933C]"
            />
            <label
              htmlFor="privacy"
              className="text-xs text-neutral-600 cursor-pointer select-none"
            >
              I agree to the{" "}
              <Link
                href="/about"
                className="text-[#252A2D] font-semibold underline hover:text-[#BE933C]"
              >
                Privacy Policy
              </Link>{" "}
              and NDPR-compliant processing of my investor credentials.{" "}
              <span className="text-[#BE933C]">*</span>
            </label>
          </div>
        </div>

        {/* Primary CTA: Create Account */}
        <div className="pt-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full justify-center"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>
        </div>

        {/* Link for existing investors */}
        <div className="pt-2 text-center text-xs text-neutral-600">
          Already have an investor account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#252A2D] hover:text-[#BE933C] transition-colors"
          >
            Sign In
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
