import React from "react";
import { WEALTHSTREAM_PAGE_DATA } from "@/lib/copy-data";

export default function WealthStreamSafeguards() {
  const { kicker, heading, subheading, items } = WEALTHSTREAM_PAGE_DATA.safeguards;

  return (
    <section className="bg-[#252A2D] text-white py-28 sm:py-36 lg:py-44 border-b border-white/10 relative overflow-hidden">
      
      {/* Subtle warm ambient depth */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#BE933C]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Intro */}
        <div className="max-w-3xl mb-16 sm:mb-24">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-4">
            {kicker}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-white leading-[1.12]">
            {heading}
          </h2>
          <p className="mt-5 text-base sm:text-lg text-neutral-300 leading-relaxed font-normal">
            {subheading}
          </p>
        </div>

        {/* Readable Editorial List with Subtle Dividers (No Generic Card Grid) */}
        <div className="divide-y divide-white/10 border-y border-white/10">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-baseline"
            >
              {/* Indicator & Protection Number */}
              <div className="lg:col-span-3">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block">
                  Institutional Safeguard 0{idx + 1}
                </span>
                <span className="text-xs uppercase tracking-wider text-neutral-400 mt-1 block">
                  Physical Real Estate Custody
                </span>
              </div>

              {/* Title & Description */}
              <div className="lg:col-span-9 space-y-2">
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight leading-snug">
                  {item.title}
                </h3>
                <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal max-w-3xl">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
