import React from "react";
import Image from "next/image";
import { ABOUT_COPY } from "@/lib/copy-data";

export default function CompanyStory() {
  const { sectionKicker, heading, statement, paragraphs, image } = ABOUT_COPY.story;

  return (
    <section className="py-24 lg:py-32 bg-[#F8F8F6] text-[#252A2D] border-b border-[#E7E7E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Two-Column Header & Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading & Large Editorial Statement (~45% on desktop) */}
          <div className="lg:col-span-5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-3">
              {sectionKicker}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-[#252A2D] leading-[1.12]">
              {heading}
            </h2>
            <p className="mt-6 text-xl sm:text-2xl lg:text-3xl font-heading font-medium text-[#252A2D] leading-snug">
              {statement}
            </p>
          </div>

          {/* Right Column: Narrative Prose (~55% on desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6 pt-1">
            <div className="space-y-6 text-base sm:text-lg text-[#52525B] leading-relaxed font-normal">
              {paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Contextual Development Photography */}
            <div className="pt-6">
              <div className="relative w-full h-[280px] sm:h-[360px] lg:h-[420px] rounded-2xl lg:rounded-3xl overflow-hidden bg-neutral-200 border border-black/[0.06] shadow-sm">
                <Image
                  src={image}
                  alt="Jeje-Ola Properties development journey and site execution"
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover object-center"
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
