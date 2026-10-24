import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { INVEST_PAGE_COPY } from "@/lib/copy-data";

export default function WealthStreamOverviewStory() {
  const {
    kicker,
    fullName,
    numeral,
    numeralLabel,
    summary,
    keyFacts,
    ctaText,
    ctaHref,
    image
  } = INVEST_PAGE_COPY.wealthStreamStory;

  return (
    <section className="bg-[#252A2D] text-white py-28 sm:py-36 lg:py-44 border-b border-white/10 relative overflow-hidden">
      
      {/* Subtle warm ambient depth */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#BE933C]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Alternating Layout: CONTENT (Left) | IMAGE (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* Left: Editorial Typography & Dominant 20–24% Anchor */}
          <div className="lg:col-span-6 flex flex-col justify-center lg:pr-4 xl:pr-8 order-2 lg:order-1">
            
            {/* Small Eyebrow */}
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block">
              {kicker} · {fullName}
            </span>

            {/* Monumental 20–24% Display Numeral */}
            <div className="mt-4 mb-6">
              <div className="text-7xl sm:text-8xl lg:text-9xl xl:text-[9.5rem] font-heading font-black text-white tracking-tight leading-none">
                {numeral}
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-[#BE933C] mt-3 tracking-tight">
                {numeralLabel}
              </h2>
            </div>

            {/* Short Explanation */}
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal max-w-xl">
              {summary}
            </p>

            {/* Key Information: Structural Reassurances */}
            <ul className="mt-8 pt-6 border-t border-white/10 space-y-3.5 max-w-xl">
              {keyFacts.map((fact, idx) => (
                <li key={idx} className="flex items-start gap-3.5 text-sm sm:text-base text-neutral-300">
                  <span className="w-5 h-5 rounded-full bg-white/5 border border-[#BE933C]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#BE933C]" />
                  </span>
                  <span className="leading-snug">{fact}</span>
                </li>
              ))}
            </ul>

            {/* Restrained Action Link */}
            <div className="mt-8">
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#BE933C] hover:bg-[#A9802E] text-[#252A2D] text-sm font-semibold transition-all group"
              >
                <span>{ctaText}</span>
                <ArrowUpRight className="w-4 h-4 text-[#252A2D] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

          </div>

          {/* Right: High-End Architectural Living Space Visual (~48-50% width) */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative w-full aspect-[4/3] sm:h-[480px] lg:h-[580px] rounded-2xl lg:rounded-3xl overflow-hidden bg-neutral-900 border border-white/10">
              <Image
                src={image}
                alt="Quiet luxury architectural interior communicating calm passive cash flow"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
            <div className="pt-4 text-xs uppercase tracking-wider text-neutral-400 font-medium">
              Fixed Passive Cash Flow · Backed by Physical Real Estate Custody
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
