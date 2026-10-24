import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { ABOUT_COPY } from "@/lib/copy-data";

export default function SmartOfficeSection() {
  const { kicker, heading, description, address, features, image } = ABOUT_COPY.smartOffice;

  return (
    <section className="py-24 sm:py-32 lg:py-36 bg-[#252A2D] text-white border-b border-white/10 relative overflow-hidden">
      
      {/* Subtle warm ambient depth */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#BE933C]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 lg:mb-20">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-3">
            {kicker}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-white leading-[1.12]">
            {heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed font-normal">
            {description}
          </p>
        </div>

        {/* Architectural Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: Large Cinematic Architectural Photograph (~55% on desktop) */}
          <div className="lg:col-span-7">
            <div className="relative w-full h-[360px] sm:h-[460px] lg:h-[540px] rounded-2xl lg:rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl">
              <Image
                src={image}
                alt="Jeje-Ola Properties Ultra-Modern Smart Office Complex in Guzape, Abuja"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center"
              />
            </div>
            <div className="pt-4 text-xs uppercase tracking-wider text-neutral-400 font-medium">
              Headquarters · {address}
            </div>
          </div>

          {/* Right: Architectural Features & Specifications (~45% on desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full pt-2">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#BE933C] font-semibold block mb-4">
                Architectural &amp; Technology Features
              </span>

              <ul className="space-y-4">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3.5 text-sm sm:text-base text-neutral-300">
                    <span className="w-5 h-5 rounded-full bg-white/5 border border-[#BE933C]/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#BE933C]" />
                    </span>
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 pt-6 border-t border-white/10 text-xs sm:text-sm text-neutral-400 font-normal">
              A physical institutional asset designed for confidential advisory, boardroom governance, and client consultations.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
