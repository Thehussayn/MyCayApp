import React from "react";
import Image from "next/image";
import { ABOUT_COPY } from "@/lib/copy-data";

export default function AboutHero() {
  const { kicker, headline, introParagraphs, heroImage } = ABOUT_COPY.hero;

  return (
    <section className="bg-[#FDFDFD] text-[#252A2D] pt-32 sm:pt-40 lg:pt-48 pb-20 lg:pb-32 border-b border-neutral-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* Left: Editorial Narrative & Headline (~58% on desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Contextual Kicker */}
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-4">
              {kicker}
            </span>

            {/* Approved H1 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-black tracking-tight text-[#252A2D] leading-[1.08] mb-6 sm:mb-8">
              {headline}
            </h1>

            {/* Approved Narrative Paragraphs */}
            <div className="space-y-4 text-base sm:text-lg text-[#52525B] leading-relaxed font-normal max-w-2xl">
              {introParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

          </div>

          {/* Right: Large Architectural Visual (~42% on desktop) */}
          <div className="lg:col-span-5">
            <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[560px] rounded-2xl lg:rounded-3xl overflow-hidden bg-neutral-900 border border-black/[0.06] shadow-sm">
              <Image
                src={heroImage}
                alt="Jeje-Ola Properties architectural development in Abuja"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-center"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
