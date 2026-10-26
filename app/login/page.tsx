"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import Button from "@/components/ui/Button";
import { Eye, EyeOff, ArrowRight, Lock, AlertCircle } from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const [demo, setDemo] = useState<{email: string; password: string} | null>(null);
  useEffect(() => {
    fetch("/api/auth/demo", { cache: "no-store" })
      .then(r => r.json())
      .then(d => { if(d.enabled) setDemo({email:d.email,password:d.password}); })
      .catch(() => {});
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both your email address and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(
          data.error ||
            "Invalid credentials. Please verify your email and password.",
        );
        setIsSubmitting(false);
        return;
      }

      if (data.redirect === "/admin") {
        router.push("/admin");
        return;
      }

      // Role-aware and status-aware destination routing
      const user = data.user;
      if (user.mustChangePassword) {
        router.push("/portal/settings");
        return;
      }
      if (["STAFF", "FINANCE", "ADMIN", "SUPER_ADMIN"].includes(user.role)) {
        router.push(
          user.mustChangePassword
            ? "/portal/settings"
            : from?.startsWith("/admin")
              ? from
              : "/admin",
        );
      } else {
        if (from && from.startsWith("/portal")) {
          router.push(from);
        } else {
          router.push("/portal/dashboard");
        }
      }
    } catch {
      setErrorMessage(
        "Unable to connect to authentication services. Please try again.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm rounded-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {demo && (
        <section aria-label="Demo admin login" className="rounded border border-[#e5d2a8] bg-[#faf6ed] p-4 text-sm">
          <h2 className="font-semibold">Demo admin access</h2>
          <dl className="mt-3 space-y-2">
            <div><dt className="text-xs text-neutral-500">Email</dt><dd className="break-all select-all">{demo.email}</dd></div>
            <div><dt className="text-xs text-neutral-500">Password</dt><dd className="break-all select-all">{demo.password}</dd></div>
          </dl>
          <button type="button" className="mt-3 text-xs font-semibold underline" onClick={() => {setEmail(demo.email);setPassword(demo.password);setErrorMessage("");}}>Use demo admin details</button>
        </section>
      )}

      {/* Email Address */}
      <div>
        <label
          htmlFor="email"
          className="block text-xs uppercase tracking-wider font-semibold text-[#252A2D] mb-2"
        >
          Email Address <span className="text-[#BE933C]">*</span>
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

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="password"
            className="block text-xs uppercase tracking-wider font-semibold text-[#252A2D]"
          >
            Password <span className="text-[#BE933C]">*</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-[#BE933C] hover:text-[#252A2D] font-medium transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
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
      </div>

      {/* Sign In CTA */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          icon={<ArrowRight className="w-4 h-4" />}
          className="w-full justify-center"
        >
          {isSubmitting ? "Authenticating..." : "Sign In"}
        </Button>
      </div>

      {/* Registration Link */}
      <div className="pt-4 text-center text-xs text-neutral-600 border-t border-neutral-200">
        Don&apos;t have an investor account yet?{" "}
        <Link
          href="/register"
          className="font-semibold text-[#252A2D] hover:text-[#BE933C] transition-colors"
        >
          Create Account
        </Link>
      </div>

      {process.env.NODE_ENV !== "production" && (
        <div className="pt-4 border-t text-center">
          <button
            type="button"
            className="text-sm underline"
            disabled={isSubmitting}
            onClick={async () => {
              setIsSubmitting(true);
              try {
                const r = await fetch("/api/preview", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ role: "INVESTOR" }),
                });
                const d = await r.json();
                if (!r.ok) throw Error(d.error);
                window.location.assign(d.redirect);
              } catch (e) {
                setErrorMessage((e as Error).message);
                setIsSubmitting(false);
              }
            }}
          >
            Open preview workspace
          </button>
        </div>
      )}
    </form>
  );
}

export default function LoginPage() {
  return (
    <AuthShell
      kicker="MyCayApp"
      title="Sign in"
      subtitle="Access your investments or operations workspace."
    >
      <Suspense
        fallback={
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-2 border-[#BE933C] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </AuthShell>
  );
}
