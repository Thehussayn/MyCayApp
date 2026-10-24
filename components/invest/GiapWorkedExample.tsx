"use client";

import React from "react";
import { formatCurrency } from "@/lib/utils";

/**
 * Detailed GIAP worked example component.
 * Retained for the dedicated GIAP product page (/invest/giap).
 * Strictly based on document: ₦100M acquisition, ₦200M resale, 70% investor profit share.
 */
export default function GiapWorkedExample() {
  const giapPurchase = 100000000;
  const giapResale = 200000000;
  const giapProfit = giapResale - giapPurchase;
  const giapInvestorShare = giapProfit * 0.70;
  const giapCompanyShare = giapProfit * 0.30;
  const giapTotalReturn = giapPurchase + giapInvestorShare;

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#14171C] border border-white/10 text-white space-y-6">
      <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pb-3 border-b border-white/10">
        <span className="uppercase tracking-wider">Documented Financial Model</span>
        <span className="text-[#BE933C]">70/30 Profit Split</span>
      </div>

      <div className="space-y-3 text-sm font-mono">
        <div className="flex justify-between text-neutral-400">
          <span>Initial Property Acquisition:</span>
          <span className="text-white font-semibold">{formatCurrency(giapPurchase)}</span>
        </div>
        <div className="flex justify-between text-neutral-400">
          <span>Strategic Market Resale:</span>
          <span className="text-white font-semibold">{formatCurrency(giapResale)}</span>
        </div>
        <div className="flex justify-between text-[#BE933C] pt-3 border-t border-white/10">
          <span>Investor Net Profit (70%):</span>
          <span className="font-bold">+{formatCurrency(giapInvestorShare)}</span>
        </div>
        <div className="flex justify-between text-neutral-400">
          <span>Jeje-Ola Guidance Share (30%):</span>
          <span>{formatCurrency(giapCompanyShare)}</span>
        </div>
        <div className="flex justify-between text-white font-bold text-base pt-3 border-t border-white/10">
          <span>Total Returned to Investor:</span>
          <span className="text-[#BE933C]">{formatCurrency(giapTotalReturn)}</span>
        </div>
      </div>

      <div className="pt-2">
        <div className="flex justify-between text-xs font-mono mb-2">
          <span className="text-[#BE933C] font-semibold">Investor Share: 70%</span>
          <span className="text-neutral-400">Jeje-Ola Share: 30%</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden flex">
          <div className="bg-[#BE933C] h-full" style={{ width: "70%" }} />
          <div className="bg-neutral-600 h-full" style={{ width: "30%" }} />
        </div>
        <span className="text-xs text-neutral-400 font-mono block mt-2 italic">
          *If the property does not appreciate, we earn ₦0. 100% aligned interest.
        </span>
      </div>
    </div>
  );
}
