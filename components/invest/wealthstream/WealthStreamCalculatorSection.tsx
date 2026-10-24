"use client";

import React, { useState } from "react";
import { ArrowUpRight, Calendar, DollarSign } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { WEALTHSTREAM_PAGE_DATA } from "@/lib/copy-data";

export default function WealthStreamCalculatorSection() {
  const { kicker, heading, subheading, presets, disclaimer } = WEALTHSTREAM_PAGE_DATA.calculator;

  const [principal, setPrincipal] = useState<number>(20000000); // ₦20,000,000 default from document
  const [payoutOption, setPayoutOption] = useState<"monthly" | "yearly">("monthly");

  const annualRate = payoutOption === "monthly" ? 0.24 : 0.20;
  const annualTotalYield = principal * annualRate;
  const monthlyDisbursement = payoutOption === "monthly" ? annualTotalYield / 12 : 0;

  return (
    <section id="calculator" className="bg-[#FDFDFD] text-[#252A2D] py-28 sm:py-36 lg:py-44 border-b border-neutral-200/80">
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

        {/* Calculator Main Layout: Controls Left | Output Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-start">
          
          {/* Left Column: Investment Inputs & Distribution Option (~6 cols) */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Input 1: Capital Amount */}
            <div>
              <div className="flex items-baseline justify-between mb-3">
                <label htmlFor="capital-range" className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
                  Select Investment Principal
                </label>
                <span className="text-2xl sm:text-3xl font-heading font-black text-[#252A2D]">
                  {formatCurrency(principal)}
                </span>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-2 mb-4">
                {presets.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setPrincipal(amt)}
                    className={`py-2 px-3.5 rounded-full text-xs font-semibold transition-all ${
                      principal === amt
                        ? "bg-[#252A2D] text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    ₦{amt / 1000000}M
                  </button>
                ))}
              </div>

              {/* Slider for Smooth Adjustment */}
              <input
                id="capital-range"
                type="range"
                min={1000000}
                max={100000000}
                step={1000000}
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full accent-[#BE933C] cursor-pointer"
                aria-label="Investment Principal Slider"
              />
              <div className="flex justify-between text-xs text-neutral-400 font-medium mt-1">
                <span>Min: ₦1M</span>
                <span>Max: ₦100M+ (Custom up to ₦1B)</span>
              </div>
            </div>

            {/* Input 2: Payout Frequency Selection */}
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 block mb-3">
                Choose Distribution Schedule
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Monthly Option: 24% Annual Rate */}
                <button
                  type="button"
                  onClick={() => setPayoutOption("monthly")}
                  className={`p-5 rounded-2xl text-left border transition-all ${
                    payoutOption === "monthly"
                      ? "border-[#BE933C] bg-[#BE933C]/5 ring-1 ring-[#BE933C]"
                      : "border-neutral-200 bg-white hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-[#BE933C]">
                      24% Annual Rate
                    </span>
                    <Calendar className="w-4 h-4 text-[#BE933C]" />
                  </div>
                  <h4 className="text-base font-heading font-extrabold text-[#252A2D]">
                    Monthly Payouts
                  </h4>
                  <p className="text-xs text-[#52525B] mt-1 leading-relaxed">
                    2.0% credited directly to your bank account every month.
                  </p>
                </button>

                {/* Yearly Option: 20% Annual Rate */}
                <button
                  type="button"
                  onClick={() => setPayoutOption("yearly")}
                  className={`p-5 rounded-2xl text-left border transition-all ${
                    payoutOption === "yearly"
                      ? "border-[#BE933C] bg-[#BE933C]/5 ring-1 ring-[#BE933C]"
                      : "border-neutral-200 bg-white hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-neutral-600">
                      20% Annual Rate
                    </span>
                    <DollarSign className="w-4 h-4 text-neutral-500" />
                  </div>
                  <h4 className="text-base font-heading font-extrabold text-[#252A2D]">
                    Yearly Payout
                  </h4>
                  <p className="text-xs text-[#52525B] mt-1 leading-relaxed">
                    Lump sum distribution paid at the end of each 12-month period.
                  </p>
                </button>

              </div>
            </div>

          </div>

          {/* Right Column: Output Summary Card (~6 cols) */}
          <div className="lg:col-span-6 bg-[#252A2D] text-white rounded-2xl lg:rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#BE933C] block mb-6">
                Projected Cash Flow Summary
              </span>

              {payoutOption === "monthly" ? (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium block">
                      Monthly Cash Disbursement (2.0%)
                    </span>
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white mt-1 leading-none">
                      {formatCurrency(monthlyDisbursement)}
                      <span className="text-base sm:text-lg font-normal text-neutral-400 ml-2">/ month</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium block">
                      Total Annual Distribution (24% ROI)
                    </span>
                    <div className="text-2xl sm:text-3xl font-heading font-black text-[#BE933C] mt-1 leading-none">
                      {formatCurrency(annualTotalYield)}
                      <span className="text-sm sm:text-base font-normal text-neutral-400 ml-2">/ year</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium block">
                      Annual Lump Sum Distribution (20% ROI)
                    </span>
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white mt-1 leading-none">
                      {formatCurrency(annualTotalYield)}
                      <span className="text-base sm:text-lg font-normal text-neutral-400 ml-2">/ year</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium block">
                      Disbursement Schedule
                    </span>
                    <p className="text-sm text-neutral-300 mt-1 font-medium">
                      Paid in full at the conclusion of each 12-month tenure.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                <span>Principal Custody:</span>
                <span className="text-white font-semibold">{formatCurrency(principal)} (100% Preserved)</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <Button
                href="/contact"
                variant="primary"
                size="lg"
                icon={<ArrowUpRight className="w-4 h-4" />}
                className="w-full justify-center"
              >
                Structure This Investment
              </Button>

              <p className="text-xs text-neutral-400 leading-relaxed italic mt-4">
                *{disclaimer}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
