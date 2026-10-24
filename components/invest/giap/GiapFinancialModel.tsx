import React from "react";
import { formatCurrency } from "@/lib/utils";
import { GIAP_PAGE_DATA } from "@/lib/copy-data";

export default function GiapFinancialModel() {
  const {
    kicker,
    heading,
    subheading,
    initialAcquisition,
    illustrativeResale,
    illustrativeProfit,
    investorShare,
    companyShare,
    totalReturned,
    disclaimer
  } = GIAP_PAGE_DATA.financialModel;

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

        {/* Proportional 70/30 Visual Allocation Bar */}
        <div className="max-w-4xl mb-14 sm:mb-18">
          <div className="flex items-center justify-between text-sm sm:text-base font-heading font-bold mb-3">
            <span className="text-[#252A2D]">
              Investor Profit Share: <span className="text-[#BE933C]">70%</span>
            </span>
            <span className="text-[#52525B]">
              Jeje-Ola Share: <span className="text-[#252A2D]">30%</span>
            </span>
          </div>

          <div className="h-5 sm:h-6 w-full rounded-full bg-neutral-200 overflow-hidden flex">
            <div
              className="bg-[#BE933C] h-full transition-all duration-1000"
              style={{ width: "70%" }}
              title="Investor Profit Share: 70%"
            />
            <div
              className="bg-[#252A2D] h-full transition-all duration-1000"
              style={{ width: "30%" }}
              title="Jeje-Ola Guidance Share: 30%"
            />
          </div>

          <div className="flex justify-between text-xs uppercase tracking-wider text-neutral-400 font-semibold mt-2">
            <span>Primary Allocation (You)</span>
            <span>Guidance &amp; Resale Execution</span>
          </div>
        </div>

        {/* Large Factual Numbers Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-10 border-t border-[#E7E7E2] items-start">
          
          {/* Left Column: Acquisition & Resale Math (~7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="divide-y divide-[#E7E7E2]">
              
              <div className="py-5 flex items-baseline justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block">
                    Step 01 · Initial Capital
                  </span>
                  <span className="text-base sm:text-lg font-heading font-bold text-[#252A2D] mt-1 block">
                    Initial Property Acquisition
                  </span>
                </div>
                <span className="text-xl sm:text-2xl font-heading font-black text-[#252A2D]">
                  {formatCurrency(initialAcquisition)}
                </span>
              </div>

              <div className="py-5 flex items-baseline justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block">
                    Step 02 · Market Appreciation
                  </span>
                  <span className="text-base sm:text-lg font-heading font-bold text-[#252A2D] mt-1 block">
                    Illustrative Strategic Resale
                  </span>
                </div>
                <span className="text-xl sm:text-2xl font-heading font-black text-[#252A2D]">
                  {formatCurrency(illustrativeResale)}
                </span>
              </div>

              <div className="py-5 flex items-baseline justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block">
                    Gross Capital Gain
                  </span>
                  <span className="text-base sm:text-lg font-heading font-bold text-[#252A2D] mt-1 block">
                    Illustrative Net Profit
                  </span>
                </div>
                <span className="text-xl sm:text-2xl font-heading font-black text-[#252A2D]">
                  {formatCurrency(illustrativeProfit)}
                </span>
              </div>

              <div className="py-5 flex items-baseline justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#BE933C] font-semibold block">
                    70% Allocation
                  </span>
                  <span className="text-base sm:text-lg font-heading font-bold text-[#BE933C] mt-1 block">
                    Investor&apos;s Profit Share
                  </span>
                </div>
                <span className="text-xl sm:text-2xl font-heading font-black text-[#BE933C]">
                  +{formatCurrency(investorShare)}
                </span>
              </div>

              <div className="py-5 flex items-baseline justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block">
                    30% Performance Fee
                  </span>
                  <span className="text-base sm:text-lg font-heading font-medium text-[#52525B] mt-1 block">
                    Jeje-Ola&apos;s Profit Share
                  </span>
                </div>
                <span className="text-xl sm:text-2xl font-heading font-medium text-[#52525B]">
                  {formatCurrency(companyShare)}
                </span>
              </div>

            </div>
          </div>

          {/* Right Column: Prominent Total Returned & Aligned Disclaimer (~5 cols) */}
          <div className="lg:col-span-5 bg-white border border-[#E7E7E2] rounded-2xl p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#BE933C] block mb-2">
                Illustrative Total Returned
              </span>
              <div className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-[#252A2D] tracking-tight leading-none">
                {formatCurrency(totalReturned)}
              </div>
              <p className="text-sm font-semibold text-[#52525B] mt-3">
                Full ₦100,000,000 initial capital returned + ₦70,000,000 profit share.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E7E7E2]">
              <p className="text-sm text-neutral-500 leading-relaxed italic">
                *{disclaimer}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
