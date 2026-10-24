import React from "react";
import { GIAP_PAGE_DATA } from "@/lib/copy-data";

export default function GiapDifferentiation() {
  const { kicker, heading, subheading, pillars } = GIAP_PAGE_DATA.differentiation;

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

        {/* 3-Column Editorial Grid (Cardless) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 pt-12 border-t border-neutral-200/80">
          {pillars.map((pillar, idx) => (
            <div
              key={pillar.number}
              className={`flex flex-col justify-between ${
                idx > 0 ? "md:border-l md:border-neutral-200/80 md:pl-10 lg:pl-12" : ""
              }`}
            >
              <div>
                <span className="text-3xl lg:text-4xl font-heading font-black text-[#BE933C] leading-none block mb-4">
                  {pillar.number}
                </span>

                <h3 className="text-xl lg:text-2xl font-heading font-extrabold text-[#252A2D] tracking-tight leading-snug">
                  {pillar.title}
                </h3>

                <p className="text-base text-[#52525B] leading-relaxed mt-4 font-normal">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-100 text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                Structural Advantage {pillar.number}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
