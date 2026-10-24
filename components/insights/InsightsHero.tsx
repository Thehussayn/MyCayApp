import React from "react";
import { INSIGHTS_PAGE_DATA } from "@/lib/copy-data";

export default function InsightsHero() {
  const { eyebrow, headline, introduction } = INSIGHTS_PAGE_DATA.hero;

  return (
    <section className="bg-[#FDFDFD] text-[#252A2D] pt-32 sm:pt-40 lg:pt-44 pb-12 sm:pb-16 border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Editorial Eyebrow */}
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-4">
            {eyebrow}
          </span>

          {/* Approved H1 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem] font-heading font-black tracking-tight text-[#252A2D] leading-[1.08] mb-6">
            {headline}
          </h1>

          {/* Approved Positioning */}
          <p className="text-lg sm:text-xl text-[#52525B] leading-relaxed font-normal">
            {introduction}
          </p>
        </div>
      </div>
    </section>
  );
}
