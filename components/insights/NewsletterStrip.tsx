"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { INSIGHTS_PAGE_DATA } from "@/lib/copy-data";

export default function NewsletterStrip() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { headline, subheadline, ctaLabel } = INSIGHTS_PAGE_DATA.newsletter;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="bg-[#252A2D] text-white py-20 sm:py-24 border-t border-white/10 relative overflow-hidden">
      {/* Subtle warm ambient depth */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#BE933C]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-3">
            Newsletter
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-white leading-[1.12] mb-4">
            {headline}
          </h2>
          <p className="text-base sm:text-lg text-neutral-400 font-normal leading-relaxed mb-8 max-w-2xl">
            {subheadline}
          </p>

          {subscribed ? (
            <div className="inline-flex items-center gap-2.5 text-sm sm:text-base font-medium text-[#BE933C] py-3">
              <CheckCircle2 className="w-5 h-5" />
              <span>Thank you for subscribing to Jeje-Ola Properties Insights.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 text-sm sm:text-base bg-white/5 border border-white/15 rounded-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#BE933C] focus:ring-1 focus:ring-[#BE933C] transition-colors"
                aria-label="Email address for newsletter"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
                className="shrink-0"
              >
                {ctaLabel}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
