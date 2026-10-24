"use client";

import React, { useState } from "react";
import { DollarSign, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

/**
 * Interactive WealthStream ROI Calculator component.
 * Retained for the dedicated WealthStream product page (/invest/wealthstream).
 * Calculates 20% annual (lump sum) or 24% annual (2% monthly) returns.
 */
export default function WealthStreamCalculator() {
  const [investmentAmount, setInvestmentAmount] = useState<number>(20000000); // ₦20,000,000 default from doc
  const [payoutFrequency, setPayoutFrequency] = useState<"monthly" | "yearly">("monthly");

  const annualRoiRate = payoutFrequency === "monthly" ? 0.24 : 0.20;
  const annualEarnings = investmentAmount * annualRoiRate;
  const monthlyEarnings = annualEarnings / 12;

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#14171C] border border-white/10 text-white space-y-6">
      <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pb-3 border-b border-white/10">
        <span className="uppercase tracking-wider">Interactive ROI Calculator</span>
        <span className="text-[#BE933C]">Real-Time Projection</span>
      </div>

      {/* Capital Presets */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-neutral-400 font-mono">Investment Principal:</span>
          <span className="text-lg sm:text-xl font-heading font-extrabold text-[#BE933C]">
            {formatCurrency(investmentAmount)}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[5000000, 10000000, 20000000, 50000000].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setInvestmentAmount(amt)}
              className={`py-2 px-2 rounded-lg text-xs font-mono transition-all ${
                investmentAmount === amt
                  ? "bg-[#BE933C] text-[#252A2D] font-bold"
                  : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/5"
              }`}
            >
              ₦{amt / 1000000}M
            </button>
          ))}
        </div>
      </div>

      {/* Payout Frequency Toggle */}
      <div>
        <span className="text-xs text-neutral-400 font-mono block mb-2">
          Payout Distribution Frequency:
        </span>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPayoutFrequency("monthly")}
            className={`py-2.5 px-3 rounded-lg text-xs font-mono flex items-center justify-center gap-2 transition-all ${
              payoutFrequency === "monthly"
                ? "bg-[#BE933C]/20 border border-[#BE933C] text-[#BE933C] font-semibold"
                : "bg-white/5 border border-white/10 text-neutral-400 hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Monthly (24% ROI / 2% mo.)
          </button>
          <button
            type="button"
            onClick={() => setPayoutFrequency("yearly")}
            className={`py-2.5 px-3 rounded-lg text-xs font-mono flex items-center justify-center gap-2 transition-all ${
              payoutFrequency === "yearly"
                ? "bg-[#BE933C]/20 border border-[#BE933C] text-[#BE933C] font-semibold"
                : "bg-white/5 border border-white/10 text-neutral-400 hover:text-white"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Yearly (20% Annual ROI)
          </button>
        </div>
      </div>

      {/* Output Metrics */}
      <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
        <div>
          <span className="text-xs font-mono text-neutral-400 block uppercase">
            {payoutFrequency === "monthly" ? "Monthly Distribution" : "Annual Distribution"}
          </span>
          <span className="text-xl sm:text-2xl font-heading font-black text-white">
            {payoutFrequency === "monthly"
              ? formatCurrency(monthlyEarnings)
              : formatCurrency(annualEarnings)}
          </span>
        </div>
        <div>
          <span className="text-xs font-mono text-neutral-400 block uppercase">
            Total Annual Yield
          </span>
          <span className="text-xl sm:text-2xl font-heading font-black text-[#BE933C]">
            {formatCurrency(annualEarnings)}
          </span>
        </div>
      </div>

      <span className="text-xs text-neutral-400 font-mono block italic pt-1">
        *Principal remains untouched until withdrawal requested (standard 6-month notice).
      </span>
    </div>
  );
}
