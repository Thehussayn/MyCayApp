import React from "react";
import { ABOUT_COPY } from "@/lib/copy-data";

export default function TrackRecordMoment() {
  const { kicker, heading, metrics } = ABOUT_COPY.trackRecord;

  return (
    <section className="py-24 sm:py-32 lg:py-36 bg-[#252A2D] text-white border-b border-white/10 relative overflow-hidden">
      
      {/* Subtle warm ambient depth */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#BE933C]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#BE933C]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Intro */}
        <div className="max-w-3xl mb-16 sm:mb-20 lg:mb-24">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-3">
            {kicker}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-white leading-[1.12]">
            {heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-400 leading-relaxed font-normal">
            A reputation built on tangible delivery, proven consistency, and fiduciary responsibility across Nigerian real estate.
          </p>
        </div>

        {/* Oversized Typography Display — Unboxed & Generously Spaced */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 xl:gap-28 pt-8 border-t border-white/10">
          {metrics.map((metric, idx) => (
            <div key={idx} className="flex flex-col">
              
              {/* Massive Numeral */}
              <div className="text-7xl sm:text-8xl lg:text-9xl font-heading font-black text-white tracking-tight leading-none select-none">
                {metric.value}
              </div>

              {/* Metric Label */}
              <div className="text-xl sm:text-2xl font-heading font-bold text-[#BE933C] mt-4 sm:mt-6">
                {metric.label}
              </div>

              {/* Explanatory Context */}
              <p className="text-sm sm:text-base text-neutral-400 mt-2 sm:mt-3 leading-relaxed max-w-md font-normal">
                {metric.detail}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
