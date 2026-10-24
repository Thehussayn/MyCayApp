import React from "react";
import { WEALTHSTREAM_PAGE_DATA } from "@/lib/copy-data";

export default function WealthStreamWithdrawals() {
  const { kicker, heading, subheading, noticePeriod, terms } = WEALTHSTREAM_PAGE_DATA.withdrawals;

  return (
    <section className="bg-[#F8F8F6] text-[#252A2D] py-28 sm:py-36 lg:py-44 border-b border-[#E7E7E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Intro */}
        <div className="max-w-3xl mb-16 sm:mb-20">
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

        {/* 6-Month Notice Requirement Callout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-10 border-t border-[#E7E7E2] items-start">
          
          {/* Left Column: Prominent Notice Period Indicator (~4 cols) */}
          <div className="lg:col-span-4 bg-white border border-[#E7E7E2] rounded-2xl p-8 sm:p-10 shadow-sm">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#BE933C] block mb-2">
              Mandatory Notice Window
            </span>
            <div className="text-6xl sm:text-7xl font-heading font-black text-[#252A2D] tracking-tight leading-none">
              {noticePeriod}
            </div>
            <p className="text-base font-heading font-bold text-[#252A2D] mt-4">
              Standard Written Notice for Capital Return
            </p>
            <p className="text-sm text-[#52525B] leading-relaxed mt-2 font-normal">
              Because capital is deployed into physical developments, liquidity is coordinated responsibly rather than through speculative reserves.
            </p>
          </div>

          {/* Right Column: Exact 3 Documented Withdrawal Terms (~8 cols) */}
          <div className="lg:col-span-8 divide-y divide-[#E7E7E2]">
            {terms.map((term, idx) => (
              <div key={idx} className="py-6 first:pt-0 last:pb-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#BE933C] block mb-1">
                  Exit Condition 0{idx + 1}
                </span>
                <h3 className="text-xl font-heading font-extrabold text-[#252A2D] tracking-tight">
                  {term.title}
                </h3>
                <p className="text-base text-[#52525B] leading-relaxed mt-2 font-normal max-w-2xl">
                  {term.description}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
