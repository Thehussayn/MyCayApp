import React from "react";
import Image from "next/image";
import { ABOUT_COPY } from "@/lib/copy-data";

export default function LeadershipSection() {
  const { kicker, heading, founder, chairman } = ABOUT_COPY.leadership;

  return (
    <section className="py-24 lg:py-32 bg-[#F8F8F6] text-[#252A2D] border-b border-[#E7E7E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20 lg:mb-24">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-3">
            {kicker}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-[#252A2D] leading-[1.12]">
            {heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#52525B] leading-relaxed font-normal">
            Guided by decades of recognized character, institutional stewardship, and an unwavering commitment to keeping promises.
          </p>
        </div>

        {/* Primary Focus: Founder & CEO Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center pb-20 lg:pb-28 border-b border-[#E7E7E2]">
          
          {/* Left: Large Authentic Portrait (~48% on desktop) */}
          <div className="lg:col-span-6 xl:col-span-5">
            <div className="relative w-full h-[440px] sm:h-[520px] lg:h-[600px] rounded-2xl lg:rounded-3xl overflow-hidden bg-neutral-900 border border-black/[0.06] shadow-sm">
              <Image
                src={founder.portrait}
                alt={founder.name}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-top"
              />
            </div>
          </div>

          {/* Right: Founder Editorial Storytelling (~52% on desktop) */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-2">
              {founder.role}
            </span>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-[#252A2D] tracking-tight leading-tight">
              {founder.name}
            </h3>

            {/* Large Leadership Statement */}
            <div className="mt-6 pt-6 border-t border-[#E7E7E2]">
              <blockquote className="text-xl sm:text-2xl font-heading font-semibold text-[#252A2D] leading-snug">
                “Over three decades of recognized character, transparency, and consistency in Nigerian real estate.”
              </blockquote>
            </div>

            {/* Approved Biography */}
            <p className="mt-6 text-base sm:text-lg text-[#52525B] leading-relaxed font-normal">
              {founder.bio}
            </p>

            <div className="mt-8 pt-6 border-t border-[#E7E7E2] flex items-center gap-6 text-xs uppercase tracking-wider text-neutral-500 font-semibold">
              <span>Jeje-Ola Properties Nig. Ltd.</span>
              <span>•</span>
              <span>RC.1317171</span>
            </div>
          </div>

        </div>

        {/* Secondary Focus: Chairman Governance Spread */}
        <div className="pt-20 lg:pt-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left: Narrative & Governance Role */}
            <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col justify-center">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-2">
                {chairman.role}
              </span>
              <h4 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-[#252A2D] tracking-tight leading-tight">
                {chairman.name}
              </h4>

              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-[#52525B] leading-relaxed font-normal max-w-2xl">
                {chairman.bio}
              </p>

              <div className="mt-6 pt-6 border-t border-[#E7E7E2] text-xs uppercase tracking-wider text-neutral-500 font-semibold">
                Governance · Fiscal Oversight · Board Leadership
              </div>
            </div>

            {/* Right: Chairman Portrait */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] rounded-2xl lg:rounded-3xl overflow-hidden bg-neutral-900 border border-black/[0.06] shadow-sm">
                <Image
                  src={chairman.portrait}
                  alt={chairman.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-top"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
