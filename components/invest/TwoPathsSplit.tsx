import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { INVEST_PAGE_COPY } from "@/lib/copy-data";

export default function TwoPathsSplit() {
  const { kicker, heading, giap, wealthstream } = INVEST_PAGE_COPY.twoPaths;

  return (
    <section className="bg-[#F8F8F6] text-[#252A2D] py-20 lg:py-28 border-b border-[#E7E7E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Intro */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-2">
            {kicker}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-[#252A2D] leading-[1.12]">
            {heading}
          </h2>
        </div>

        {/* Large Editorial Split — Substantial Typography & Whitespace, Zero Generic Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-stretch pt-8 border-t border-[#E7E7E2]">
          
          {/* Column 1: GIAP */}
          <div className="flex flex-col justify-between pr-0 md:pr-4 lg:pr-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block">
                {giap.name}
              </span>
              <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#252A2D] tracking-tight mt-1">
                {giap.fullName}
              </h3>

              {/* Dominant Display Numeral */}
              <div className="my-5 sm:my-6">
                <div className="text-6xl sm:text-7xl lg:text-8xl font-heading font-black text-[#252A2D] tracking-tight leading-none">
                  {giap.numeral}
                </div>
                <div className="text-sm sm:text-base font-heading font-bold text-[#BE933C] mt-2">
                  {giap.label}
                </div>
              </div>

              <p className="text-base sm:text-lg text-[#52525B] leading-relaxed font-normal">
                {giap.summary}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E7E7E2]">
              <Link
                href={giap.href}
                className="inline-flex items-center gap-2 text-base font-semibold text-[#252A2D] hover:text-[#BE933C] transition-colors group"
              >
                <span>Explore GIAP Structure</span>
                <ArrowUpRight className="w-4 h-4 text-[#BE933C] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Column 2: WealthStream */}
          <div className="flex flex-col justify-between pt-8 md:pt-0 border-t md:border-t-0 md:border-l border-[#E7E7E2] pl-0 md:pl-8 lg:pl-16">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block">
                {wealthstream.name}
              </span>
              <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#252A2D] tracking-tight mt-1">
                {wealthstream.fullName}
              </h3>

              {/* Dominant Display Numeral */}
              <div className="my-5 sm:my-6">
                <div className="text-6xl sm:text-7xl lg:text-8xl font-heading font-black text-[#252A2D] tracking-tight leading-none">
                  {wealthstream.numeral}
                </div>
                <div className="text-sm sm:text-base font-heading font-bold text-[#BE933C] mt-2">
                  {wealthstream.label}
                </div>
              </div>

              <p className="text-base sm:text-lg text-[#52525B] leading-relaxed font-normal">
                {wealthstream.summary}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E7E7E2]">
              <Link
                href={wealthstream.href}
                className="inline-flex items-center gap-2 text-base font-semibold text-[#252A2D] hover:text-[#BE933C] transition-colors group"
              >
                <span>Explore WealthStream Structure</span>
                <ArrowUpRight className="w-4 h-4 text-[#BE933C] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
