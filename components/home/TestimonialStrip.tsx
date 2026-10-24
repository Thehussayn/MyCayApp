import React from "react";
import { TESTIMONIALS } from "@/lib/copy-data";

export default function TestimonialStrip() {
  const testimonial = TESTIMONIALS[0];

  if (!testimonial) return null;

  return (
    <section className="py-24 sm:py-32 lg:py-40 bg-[#252A2D] text-white border-t border-white/10 relative overflow-hidden">
      
      {/* Subtle warm ambient depth for luxurious editorial feel */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#BE933C]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl lg:max-w-5xl">
          
          {/* ====================================================
              SECTION HEADING — Confident & Restrained
              ==================================================== */}
          <div className="mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-white leading-[1.12]">
              Trusted by Nigeria&apos;s Most Distinguished Leaders
            </h2>
          </div>

          {/* ====================================================
              LARGE EDITORIAL TESTIMONIAL MOMENT
              Typography-Led Central Showcase with Zero Card Containers
              ==================================================== */}
          <div className="relative">
            
            {/* Oversized Restrained Champagne Gold Quote Mark */}
            <span
              className="block text-6xl sm:text-7xl lg:text-8xl font-heading font-black text-[#BE933C] leading-none mb-6 select-none opacity-80"
              aria-hidden="true"
            >
              “
            </span>

            {/* Large Quote Display Typography */}
            <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-normal tracking-tight text-white leading-[1.3] sm:leading-[1.25]">
              {testimonial.quote}
            </blockquote>

            {/* Person Attribution */}
            <div className="mt-10 sm:mt-14 pt-8 border-t border-white/10 flex flex-col">
              <cite className="not-italic text-lg sm:text-xl lg:text-2xl font-heading font-bold text-white tracking-tight">
                {testimonial.author}
              </cite>
              <span className="text-sm sm:text-base text-[#BE933C] font-normal mt-1">
                {testimonial.organization}
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
