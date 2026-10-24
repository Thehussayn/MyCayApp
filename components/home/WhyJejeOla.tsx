import React from "react";
import Image from "next/image";
import { WHY_JEJE_OLA } from "@/lib/copy-data";

export default function WhyJejeOla() {
  const regularPrinciples = WHY_JEJE_OLA.slice(0, 5);
  const trackRecordPrinciple = WHY_JEJE_OLA[5];

  return (
    <section className="py-24 lg:py-32 bg-[#FDFDFD] text-[#252A2D] border-t border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ====================================================
            SECTION HEADER — Editorial, Restrained & Confident
            ==================================================== */}
        <div className="max-w-3xl mb-12 sm:mb-16 lg:mb-20">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-3">
            Why Jeje-Ola
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-[#252A2D] leading-[1.12]">
            Why Investors Choose Jeje-Ola Properties
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#52525B] leading-relaxed font-normal">
            In an opaque market, we operate with uncompromised transparency, verified legal standing, and true alignment of interest.
          </p>
        </div>

        {/* ====================================================
            EDITORIAL TWO-COLUMN LAYOUT WITH STICKY ARCHITECTURE
            Left (~45%): Large Architectural Image (Sticky on desktop)
            Right (~55%): Numbered Principles in Editorial Sequence
            ==================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-start">
          
          {/* Left Column: Large Sticky Architectural Visual */}
          <div className="lg:col-span-5 relative w-full lg:sticky lg:top-32">
            <div className="relative w-full h-[340px] sm:h-[440px] lg:h-[580px] xl:h-[640px] rounded-2xl lg:rounded-3xl overflow-hidden bg-neutral-200 border border-black/[0.06] shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85"
                alt="Architectural development by Jeje-Ola Properties in Abuja"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-center"
                priority={false}
              />
            </div>
          </div>

          {/* Right Column: Editorial Numbered Principles */}
          <div className="lg:col-span-7 flex flex-col">
            
            {/* Principles 01 through 05 */}
            {regularPrinciples.map((principle) => (
              <div
                key={principle.number}
                className="pb-12 sm:pb-16 mb-12 sm:mb-16 border-b border-neutral-200/80 last:border-b-0"
              >
                {/* Numbered Indicator */}
                <span className="text-sm sm:text-base font-heading font-bold text-[#BE933C] tracking-widest">
                  {principle.number}
                </span>

                {/* Principle Heading */}
                <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#252A2D] tracking-tight mt-2 mb-3 leading-snug">
                  {principle.title}
                </h3>

                {/* Description */}
                <p className="text-base sm:text-lg text-[#52525B] leading-relaxed font-normal">
                  {principle.description}
                </p>
              </div>
            ))}

            {/* Principle 06 — Proven Track Record (Closing Trust Moment) */}
            {trackRecordPrinciple && (
              <div className="pt-2 pb-4">
                {/* Numbered Indicator */}
                <span className="text-sm sm:text-base font-heading font-bold text-[#BE933C] tracking-widest">
                  {trackRecordPrinciple.number}
                </span>

                {/* Principle Heading */}
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-[#252A2D] tracking-tight mt-2 mb-4 leading-snug">
                  {trackRecordPrinciple.title}
                </h3>

                {/* Prominent Editorial Metrics Highlight */}
                <div className="grid grid-cols-2 gap-6 my-6 pt-4 pb-4 border-y border-neutral-200/80">
                  <div>
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-[#252A2D] tracking-tight leading-none">
                      18+
                    </div>
                    <div className="text-xs sm:text-sm text-[#52525B] font-medium mt-2">
                      Years of Trusted Experience
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-[#252A2D] tracking-tight leading-none">
                      900+
                    </div>
                    <div className="text-xs sm:text-sm text-[#52525B] font-medium mt-2">
                      Properties Delivered
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-base sm:text-lg text-[#52525B] leading-relaxed font-normal">
                  {trackRecordPrinciple.description}
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
