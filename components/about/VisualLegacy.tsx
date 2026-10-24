import React from "react";
import Image from "next/image";
import { ABOUT_COPY } from "@/lib/copy-data";

export default function VisualLegacy() {
  const { kicker, heading, statement, primaryImage, secondaryImage } = ABOUT_COPY.visualLegacy;

  return (
    <section className="py-24 lg:py-32 bg-[#FDFDFD] text-[#252A2D] border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 lg:mb-20">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-3">
            {kicker}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-[#252A2D] leading-[1.12]">
            {heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#52525B] leading-relaxed font-normal">
            {statement}
          </p>
        </div>

        {/* Asymmetric Curated Architectural Photography Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Dominant Primary Development Visual (~67% on desktop) */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="relative w-full h-[360px] sm:h-[460px] lg:h-[540px] rounded-2xl lg:rounded-3xl overflow-hidden bg-neutral-900 border border-black/[0.06] shadow-sm">
              <Image
                src={primaryImage}
                alt="Prime architectural development completed by Jeje-Ola Properties in Abuja"
                fill
                sizes="(max-width: 1024px) 100vw, 67vw"
                className="object-cover object-center"
              />
            </div>
            <div className="pt-3 text-xs uppercase tracking-wider text-neutral-500 font-medium">
              Completed Development · Guzape Corridor, Abuja
            </div>
          </div>

          {/* Secondary Refined Detail Visual (~33% on desktop) */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="relative w-full h-[360px] sm:h-[460px] lg:h-[540px] rounded-2xl lg:rounded-3xl overflow-hidden bg-neutral-900 border border-black/[0.06] shadow-sm">
              <Image
                src={secondaryImage}
                alt="Bespoke interior architectural craft and material detailing"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover object-center"
              />
            </div>
            <div className="pt-3 text-xs uppercase tracking-wider text-neutral-500 font-medium">
              Refined Living Space &amp; Architectural Craft
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
