import React from "react";
import { GIAP_PAGE_DATA } from "@/lib/copy-data";

export default function GiapSafeguards() {
  const { kicker, heading, subheading, items } = GIAP_PAGE_DATA.safeguards;

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

        {/* Editorial Safeguards Grid with Subtle Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 pt-12 border-t border-white/10">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between py-2"
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#BE933C] block mb-3">
                  Protection 0{idx + 1}
                </span>

                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight leading-snug">
                  {item.title}
                </h3>

                <p className="text-base text-neutral-300 leading-relaxed mt-4 font-normal max-w-lg">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                Guaranteed by Fiduciary Agreement
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
