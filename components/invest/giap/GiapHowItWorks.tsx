import React from "react";
import { GIAP_PAGE_DATA } from "@/lib/copy-data";

export default function GiapHowItWorks() {
  const { kicker, heading, subheading, steps } = GIAP_PAGE_DATA.howItWorks;

  // Split into two rows of 4 for desktop timeline flow
  const firstFourSteps = steps.slice(0, 4);
  const lastFourSteps = steps.slice(4, 8);

  return (
    <section id="how-it-works" className="bg-[#252A2D] text-white py-28 sm:py-36 lg:py-44 border-b border-white/10 relative overflow-hidden">
      
      {/* Subtle warm ambient depth */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#BE933C]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Intro */}
        <div className="max-w-3xl mb-16 sm:mb-24">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-4">
            {kicker}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-white leading-[1.12]">
            {heading}
          </h2>
          <p className="mt-5 text-base sm:text-lg text-neutral-300 leading-relaxed font-normal">
            {subheading}
          </p>
        </div>

        {/* Desktop Editorial Timeline (Screen >= 1024px) */}
        <div className="hidden lg:block space-y-16 pt-8 border-t border-white/10">
          
          {/* Phase 1: Acquisition & Verification (Steps 01 - 04) */}
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 block mb-6">
              Phase 01 · Planning, Location Selection &amp; Title Verification
            </span>
            <div className="grid grid-cols-4 gap-8 xl:gap-10">
              {firstFourSteps.map((step, idx) => (
                <div key={step.number} className="flex flex-col relative">
                  
                  {/* Step Numeral + Progression Line */}
                  <div className="flex items-center gap-4">
                    <span className="text-4xl lg:text-5xl font-heading font-black text-[#BE933C] leading-none shrink-0">
                      {step.number}
                    </span>
                    {idx < firstFourSteps.length - 1 && (
                      <div className="flex-1 h-px bg-white/20" />
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-heading font-bold text-white tracking-tight mt-6">
                    {step.title}
                  </h3>
                  <p className="text-base text-neutral-300 leading-relaxed mt-2.5 font-normal">
                    {step.description}
                  </p>

                </div>
              ))}
            </div>
          </div>

          {/* Phase 2: Custody, Guidance & Profit Realization (Steps 05 - 08) */}
          <div className="pt-12 border-t border-white/10">
            <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 block mb-6">
              Phase 02 · Title Ownership, Value Growth &amp; 70/30 Profit Sharing
            </span>
            <div className="grid grid-cols-4 gap-8 xl:gap-10">
              {lastFourSteps.map((step, idx) => (
                <div key={step.number} className="flex flex-col relative">
                  
                  {/* Step Numeral + Progression Line */}
                  <div className="flex items-center gap-4">
                    <span className="text-4xl lg:text-5xl font-heading font-black text-[#BE933C] leading-none shrink-0">
                      {step.number}
                    </span>
                    {idx < lastFourSteps.length - 1 && (
                      <div className="flex-1 h-px bg-white/20" />
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-heading font-bold text-white tracking-tight mt-6">
                    {step.title}
                  </h3>
                  <p className="text-base text-neutral-300 leading-relaxed mt-2.5 font-normal">
                    {step.description}
                  </p>

                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Mobile & Tablet Vertical Timeline (Screen < 1024px, Cardless) */}
        <div className="lg:hidden relative pl-6 sm:pl-8 space-y-12 pt-8 border-t border-white/10">
          {/* Continuous vertical timeline connector */}
          <div className="absolute left-[11px] sm:left-[15px] top-12 bottom-10 w-px bg-white/20" />

          {steps.map((step) => (
            <div key={step.number} className="relative flex items-start gap-6">
              {/* Timeline marker node */}
              <div className="absolute -left-[19px] sm:-left-[23px] top-1.5 w-4 h-4 rounded-full bg-[#252A2D] border-2 border-[#BE933C]" />

              <div className="space-y-1.5">
                <span className="text-3xl sm:text-4xl font-heading font-black text-[#BE933C] leading-none block">
                  {step.number}
                </span>
                <h3 className="text-xl font-heading font-bold text-white tracking-tight pt-1">
                  {step.title}
                </h3>
                <p className="text-base text-neutral-300 leading-relaxed font-normal pt-1 max-w-md">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
