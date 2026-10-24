import React from "react";
import Image from "next/image";
import { WHO_WE_SERVE } from "@/lib/copy-data";

export default function WhoWeServe() {
  return (
    <section className="py-24 lg:py-32 bg-[#FDFDFD] text-[#252A2D] border-t border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Intro */}
        <div className="max-w-3xl mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-[#252A2D] leading-[1.12]">
            Built for People Who Take Property Seriously
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#52525B] leading-relaxed font-normal">
            Whether building an offshore legacy from the diaspora or acquiring prime institutional assets in Abuja, our advisory is structured for discerning capital.
          </p>
        </div>

        {/* Vertically Stacked Large Horizontal Cards */}
        <div className="space-y-6 sm:space-y-8">
          {WHO_WE_SERVE.map((audience) => (
            <div
              key={audience.id}
              className="bg-[#F8F8F6] border border-[#E7E7E2] rounded-2xl lg:rounded-3xl p-5 sm:p-6 lg:p-7 transition-colors duration-200 hover:border-[#D4D4CE] flex flex-col md:flex-row items-stretch gap-6 sm:gap-8 lg:gap-12"
            >
              {/* Left: Image Container (approx 30–33% width on desktop, clean crop, NO text overlay, NO gradients) */}
              <div className="w-full md:w-[32%] lg:w-[30%] shrink-0 min-h-[220px] sm:min-h-[260px] md:min-h-[240px] relative rounded-xl lg:rounded-2xl overflow-hidden bg-neutral-200">
                <Image
                  src={audience.image}
                  alt={audience.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center"
                />
              </div>

              {/* Right: Content Container (approx 67–70% width on desktop, generous typography, restrained & clean) */}
              <div className="w-full md:w-[68%] lg:w-[70%] py-2 sm:py-4 lg:py-6 pr-2 sm:pr-4 lg:pr-6 flex flex-col justify-center">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-[#252A2D] tracking-tight leading-snug">
                  {audience.title}
                </h3>
                <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#52525B] leading-relaxed font-normal max-w-3xl">
                  {audience.summary}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
