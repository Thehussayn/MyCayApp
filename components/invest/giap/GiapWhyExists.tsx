import React from "react";
import { GIAP_PAGE_DATA } from "@/lib/copy-data";

export default function GiapWhyExists() {
  const { kicker, heading, paragraphs } = GIAP_PAGE_DATA.whyExists;

  return (
    <section className="bg-[#F8F8F6] text-[#252A2D] py-28 sm:py-36 lg:py-40 border-b border-[#E7E7E2]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-4">
          {kicker}
        </span>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-[#252A2D] leading-[1.14] mb-12">
          {heading}
        </h2>

        {/* Editorial Text Flow — Generous Reading Cadence */}
        <div className="space-y-8 text-lg sm:text-xl lg:text-2xl text-[#27272A] font-normal leading-relaxed border-l-2 border-[#BE933C]/40 pl-6 sm:pl-10">
          {paragraphs.map((p, idx) => (
            <p key={idx} className={idx === 0 ? "text-[#252A2D] font-medium" : "text-[#52525B]"}>
              {p}
            </p>
          ))}
        </div>

      </div>
    </section>
  );
}
