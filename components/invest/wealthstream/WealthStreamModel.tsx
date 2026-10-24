import React from "react";
import { WEALTHSTREAM_PAGE_DATA } from "@/lib/copy-data";

export default function WealthStreamModel() {
  const { kicker, heading, subheading, clarification, options } = WEALTHSTREAM_PAGE_DATA.model;

  return (
    <section id="model" className="bg-[#F8F8F6] text-[#252A2D] py-28 sm:py-36 lg:py-44 border-b border-[#E7E7E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Intro */}
        <div className="max-w-3xl mb-14 sm:mb-18">
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

        {/* Essential Clarification Banner — Clean Typographic Callout */}
        <div className="bg-white border-l-2 border-[#BE933C] p-6 sm:p-8 rounded-r-2xl mb-16 sm:mb-20 max-w-4xl shadow-sm">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#BE933C] block mb-2">
            Annual Rate Definition &amp; Distribution Mechanics
          </span>
          <p className="text-base text-[#52525B] leading-relaxed font-normal">
            {clarification}
          </p>
        </div>

        {/* Side-by-Side Editorial Composition (No Dashboard Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 pt-10 border-t border-[#E7E7E2]">
          {options.map((opt, idx) => (
            <div
              key={idx}
              className={`flex flex-col justify-between ${
                idx > 0 ? "lg:border-l lg:border-[#E7E7E2] lg:pl-16 xl:pl-20" : ""
              }`}
            >
              <div>
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block mb-4">
                  {opt.tag}
                </span>

                {/* Monumental Rate Numeral */}
                <div className="text-6xl sm:text-7xl lg:text-8xl font-heading font-black text-[#252A2D] tracking-tight leading-none">
                  {opt.rate}
                </div>

                <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#BE933C] mt-3 tracking-tight">
                  {opt.period} · {opt.frequency}
                </h3>

                <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block mt-1">
                  {opt.distributionDetail}
                </span>

                {/* Illustrative Return on ₦20M Benchmark */}
                <div className="mt-8 py-4 px-5 bg-white border border-[#E7E7E2] rounded-xl max-w-md">
                  <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block">
                    Illustrative ₦20M Principal Distribution
                  </span>
                  <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-neutral-100">
                    <span className="text-sm text-neutral-500 font-medium">Annual Yield:</span>
                    <span className="text-base font-heading font-bold text-[#252A2D]">
                      {opt.annualReturnOn20M}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-sm text-neutral-500 font-medium">Disbursement:</span>
                    <span className="text-base font-heading font-bold text-[#BE933C]">
                      {opt.monthlyReturnOn20M}
                    </span>
                  </div>
                </div>

                <p className="text-base text-[#52525B] leading-relaxed mt-6 font-normal max-w-md">
                  {opt.description}
                </p>
              </div>

              <div className="mt-10 pt-6 border-t border-neutral-200/60 text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                Principal 100% Preserved Until Exit
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
