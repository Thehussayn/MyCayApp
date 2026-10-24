import React from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { INVEST_PAGE_COPY } from "@/lib/copy-data";

export default function WhichPathMatches() {
  const { kicker, heading, subheading, paths } = INVEST_PAGE_COPY.decisionSupport;

  return (
    <section className="bg-[#FDFDFD] text-[#252A2D] py-28 sm:py-36 lg:py-44 border-b border-neutral-200/80">
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

        {/* Two Clean Editorial Columns (No Card Containers) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 xl:gap-28 pt-12 border-t border-neutral-200/80">
          {paths.map((path, idx) => (
            <div
              key={idx}
              className={`flex flex-col justify-between ${
                idx > 0 ? "lg:border-l lg:border-neutral-200/80 lg:pl-16 xl:pl-24" : ""
              }`}
            >
              <div>
                <span className="text-xs uppercase tracking-wider text-[#BE933C] font-semibold block mb-6">
                  {path.title}
                </span>

                <ul className="space-y-4 mb-10">
                  {path.priorities.map((item, itemIdx) => (
                    <li
                      key={itemIdx}
                      className="flex items-start gap-4 text-base sm:text-lg text-[#252A2D] font-medium leading-relaxed"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#BE933C]/10 flex items-center justify-center shrink-0 mt-1">
                        <Check className="w-3.5 h-3.5 text-[#BE933C]" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8 border-t border-neutral-200/60">
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block">
                  Recommended Model Fit
                </span>
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#252A2D] tracking-tight mt-1.5">
                  {path.planName}
                </h3>
                <p className="text-sm font-semibold text-[#BE933C] mt-1">
                  {path.planHighlight}
                </p>

                <div className="mt-7">
                  <Link
                    href={path.ctaHref}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#252A2D] text-white hover:bg-neutral-800 text-sm font-semibold transition-colors group"
                  >
                    <span>{path.ctaLabel}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#BE933C] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
