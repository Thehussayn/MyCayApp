import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { INVEST_PAGE_COPY } from "@/lib/copy-data";

export const metadata: Metadata = {
  title: "Start Investing in Five Simple Steps | Jeje-Ola Properties",
  description:
    "From registration to real-time performance tracking, our onboarding journey is structured for clarity, security, and speed.",
};

export default function GetStartedPage() {
  const { steps, primaryCta, secondaryCta } = INVEST_PAGE_COPY.onboarding;

  return (
    <div className="bg-[#FDFDFD] text-[#252A2D] pt-28 sm:pt-36 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/invest"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-[#BE933C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Investment Overview</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-3">
            Onboarding Journey
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-[#252A2D] leading-[1.12]">
            Start Investing in Five Simple Steps
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#52525B] leading-relaxed font-normal">
            Our onboarding process is designed to take you from initial
            consultation to secured property investment or recurring cash flow
            in a few transparent steps.
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-8 border-t border-neutral-200/80 pt-8 mb-14">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex items-start gap-6 pb-8 border-b border-neutral-100 last:border-b-0"
            >
              <span className="text-3xl font-heading font-black text-[#BE933C] shrink-0">
                {step.number}
              </span>
              <div>
                <h2 className="text-xl font-heading font-extrabold text-[#252A2D]">
                  {step.title}
                </h2>
                <p className="text-base text-[#52525B] leading-relaxed mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="p-8 rounded-2xl bg-[#F8F8F6] border border-[#E7E7E2] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-heading font-extrabold text-[#252A2D]">
              Ready to Begin?
            </h3>
            <p className="text-sm text-[#52525B] mt-1">
              Create your account in under 2 minutes or schedule an advisory
              session.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Button
              href={primaryCta.href}
              variant="primary"
              size="md"
              className="w-full sm:w-auto justify-center"
              icon={<ArrowUpRight className="w-4 h-4" />}
            >
              {primaryCta.label}
            </Button>
            <Button
              href={secondaryCta.href}
              variant="outline"
              size="md"
              className="w-full sm:w-auto justify-center text-[#252A2D] border-neutral-300 hover:bg-white"
            >
              {secondaryCta.label}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
