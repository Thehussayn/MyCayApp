import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { INVEST_PAGE_COPY } from "@/lib/copy-data";

export default function GiapOverviewStory() {
  const {
    kicker,
    fullName,
    numeral,
    numeralLabel,
    summary,
    alignmentStatement,
    journeySteps,
    ctaText,
    ctaHref,
    image
  } = INVEST_PAGE_COPY.giapStory;

  return (
    <section className="bg-[#FDFDFD] text-[#252A2D] py-28 sm:py-36 lg:py-44 border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Alternating Layout: IMAGE (Left) | CONTENT (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* Left: Expansive Architectural Image (~48-50% width) */}
          <div className="lg:col-span-6">
            <div className="relative w-full aspect-[4/3] sm:h-[480px] lg:h-[580px] rounded-2xl lg:rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200/70">
              <Image
                src={image}
                alt="Prime completed residential development backing GIAP ownership structure"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
            <div className="pt-4 text-xs uppercase tracking-wider text-neutral-500 font-medium">
              Asset Ownership Model · Guzape &amp; Abuja Prime Corridors
            </div>
          </div>

          {/* Right: Editorial Typography & Dominant 70% Anchor */}
          <div className="lg:col-span-6 flex flex-col justify-center lg:pl-4 xl:pl-8">
            
            {/* Small Eyebrow */}
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block">
              {kicker} · {fullName}
            </span>

            {/* Monumental 70% Display Numeral */}
            <div className="mt-4 mb-6">
              <div className="text-7xl sm:text-8xl lg:text-9xl xl:text-[9.5rem] font-heading font-black text-[#252A2D] tracking-tight leading-none">
                {numeral}
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-[#BE933C] mt-3 tracking-tight">
                {numeralLabel}
              </h2>
            </div>

            {/* Short Explanation */}
            <p className="text-base sm:text-lg text-[#52525B] leading-relaxed font-normal max-w-xl">
              {summary}
            </p>

            {/* Key Information: Conceptual Investor Journey */}
            <div className="mt-8 pt-6 border-t border-neutral-200/80">
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block mb-3">
                Conceptual Investor Journey
              </span>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold text-[#252A2D]">
                {journeySteps.map((step, idx) => (
                  <React.Fragment key={step}>
                    <span>{step}</span>
                    {idx < journeySteps.length - 1 && (
                      <span className="text-[#BE933C]">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Alignment Statement */}
            <p className="mt-4 text-sm text-neutral-500 italic max-w-xl">
              *{alignmentStatement}
            </p>

            {/* Restrained Action Link */}
            <div className="mt-8">
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#252A2D] text-white hover:bg-neutral-800 text-sm font-semibold transition-all group"
              >
                <span>{ctaText}</span>
                <ArrowUpRight className="w-4 h-4 text-[#BE933C] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
