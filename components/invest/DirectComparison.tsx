import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { INVEST_PAGE_COPY } from "@/lib/copy-data";

export default function DirectComparison() {
  const { kicker, heading, subheading, dimensions } = INVEST_PAGE_COPY.comparison;

  // Visual emphasis for the 3 primary decision-making criteria
  const isPriorityRow = (feature: string) => {
    const lower = feature.toLowerCase();
    return lower.includes("return") || lower.includes("ownership") || lower.includes("exit");
  };

  return (
    <section className="bg-[#F8F8F6] text-[#252A2D] py-28 sm:py-36 lg:py-44 border-b border-[#E7E7E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Intro */}
        <div className="max-w-3xl mb-16 sm:mb-24">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-4">
            {kicker}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-[#252A2D] leading-[1.12]">
            {heading}
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#52525B] leading-relaxed font-normal">
            {subheading}
          </p>
        </div>

        {/* Desktop Editorial Comparison Table (Screen >= 768px) */}
        <div className="hidden md:block">
          
          {/* Table Header: Visually Prominent Plan Names */}
          <div className="grid grid-cols-12 pb-8 border-b-2 border-neutral-300 items-end">
            <div className="col-span-4 text-xs uppercase tracking-wider font-semibold text-neutral-400">
              Evaluation Criterion
            </div>
            
            <div className="col-span-4 pr-6">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#BE933C] block">
                Plan 01 · Asset Ownership
              </span>
              <h3 className="text-2xl lg:text-3xl font-heading font-black text-[#252A2D] tracking-tight mt-1">
                GIAP
              </h3>
            </div>
            
            <div className="col-span-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#BE933C] block">
                Plan 02 · Passive Cash Flow
              </span>
              <h3 className="text-2xl lg:text-3xl font-heading font-black text-[#252A2D] tracking-tight mt-1">
                WealthStream
              </h3>
            </div>
          </div>

          {/* Table Rows with Generous Vertical Spacing & Subtle Dividers */}
          <div className="divide-y divide-[#E7E7E2]">
            {dimensions.map((row, idx) => {
              const priority = isPriorityRow(row.feature);

              return (
                <div
                  key={idx}
                  className={`grid grid-cols-12 items-baseline transition-colors hover:bg-black/[0.015] ${
                    priority ? "py-8 lg:py-9" : "py-6 lg:py-7"
                  }`}
                >
                  {/* Row Label */}
                  <div className={`col-span-4 pr-6 ${
                    priority
                      ? "text-sm lg:text-base font-semibold text-[#252A2D]"
                      : "text-sm lg:text-base font-medium text-neutral-500"
                  }`}>
                    {row.feature}
                  </div>

                  {/* GIAP Value */}
                  <div className={`col-span-4 pr-8 font-heading ${
                    priority
                      ? "text-lg lg:text-xl font-black text-[#252A2D] tracking-tight"
                      : "text-base lg:text-lg font-semibold text-[#252A2D]"
                  }`}>
                    {row.giap}
                  </div>

                  {/* WealthStream Value */}
                  <div className={`col-span-4 font-heading ${
                    priority
                      ? "text-lg lg:text-xl font-black text-[#252A2D] tracking-tight"
                      : "text-base lg:text-lg font-semibold text-[#252A2D]"
                  }`}>
                    {row.wealthstream}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Direct Exploration Actions at Table Base */}
          <div className="grid grid-cols-12 pt-10 border-t-2 border-neutral-300 items-center">
            <div className="col-span-4 text-xs uppercase tracking-wider font-semibold text-neutral-400">
              Detailed Exploration
            </div>
            <div className="col-span-4 pr-6">
              <Link
                href="/invest/giap"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#252A2D] hover:text-[#BE933C] transition-colors group"
              >
                <span>Read Full GIAP Guide</span>
                <ArrowUpRight className="w-4 h-4 text-[#BE933C] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
            <div className="col-span-4">
              <Link
                href="/invest/wealthstream"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#252A2D] hover:text-[#BE933C] transition-colors group"
              >
                <span>Read Full WealthStream Guide</span>
                <ArrowUpRight className="w-4 h-4 text-[#BE933C] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Mobile Criterion-by-Criterion Editorial Stack (Screen < 768px, No Cards) */}
        <div className="md:hidden divide-y divide-[#E7E7E2]">
          {dimensions.map((row, idx) => {
            const priority = isPriorityRow(row.feature);

            return (
              <div key={idx} className={priority ? "py-7" : "py-6"}>
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block mb-3">
                  {row.feature}
                </span>

                <div className="space-y-3.5">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#BE933C] block">
                      GIAP (Asset Ownership)
                    </span>
                    <p className={`font-heading text-[#252A2D] mt-1 ${
                      priority ? "text-lg font-black" : "text-base font-bold"
                    }`}>
                      {row.giap}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E7E7E2]/60">
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#BE933C] block">
                      WealthStream (Cash Flow)
                    </span>
                    <p className={`font-heading text-[#252A2D] mt-1 ${
                      priority ? "text-lg font-black" : "text-base font-bold"
                    }`}>
                      {row.wealthstream}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Mobile Exploration Links */}
          <div className="pt-8 space-y-3">
            <Link
              href="/invest/giap"
              className="flex items-center justify-between py-4 border-b border-neutral-200 text-sm font-semibold text-[#252A2D] hover:text-[#BE933C] transition-colors"
            >
              <span>Explore GIAP (70/30 Ownership)</span>
              <ArrowUpRight className="w-4 h-4 text-[#BE933C]" />
            </Link>
            <Link
              href="/invest/wealthstream"
              className="flex items-center justify-between py-4 border-b border-neutral-200 text-sm font-semibold text-[#252A2D] hover:text-[#BE933C] transition-colors"
            >
              <span>Explore WealthStream (20–24% Cash Flow)</span>
              <ArrowUpRight className="w-4 h-4 text-[#BE933C]" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
