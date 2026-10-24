import React from "react";
import { PROPERTIES_PAGE_COPY } from "@/lib/copy-data";

export default function PropertiesHero() {
  const { kicker, headline, subheadline } = PROPERTIES_PAGE_COPY.hero;

  return (
    <section className="bg-[#FDFDFD] text-[#252A2D] pt-32 sm:pt-36 lg:pt-40 pb-10 sm:pb-12 border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-3">
            {kicker}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-[#252A2D] leading-[1.12]">
            {headline}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#52525B] leading-relaxed font-normal">
            {subheadline}
          </p>
        </div>
      </div>
    </section>
  );
}
