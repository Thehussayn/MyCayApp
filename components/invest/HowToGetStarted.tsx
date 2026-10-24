import React from "react";
import { ArrowUpRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { INVEST_PAGE_COPY } from "@/lib/copy-data";

export default function HowToGetStarted() {
  const { kicker, heading, subheading, steps, primaryCta, secondaryCta } = INVEST_PAGE_COPY.onboarding;

  return (
    <section className="bg-[#252A2D] text-white py-28 sm:py-36 lg:py-44 border-b border-white/10 relative overflow-hidden">
      
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

        {/* Desktop Linear Journey with Horizontal Progression Line (Screen >= 1024px) */}
        <div className="hidden lg:grid grid-cols-5 gap-8 xl:gap-10 pt-12 border-t border-white/10 relative">
          {steps.map((step, idx) => (
            <div key={step.number} className="flex flex-col relative">
              
              {/* Step Numeral + Progression Line Anchor */}
              <div className="flex items-center gap-4">
                <span className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-[#BE933C] leading-none shrink-0">
                  {step.number}
                </span>
                {idx < steps.length - 1 && (
                  <div className="flex-1 h-px bg-white/20" />
                )}
              </div>

              {/* Title & Description with Enhanced Legibility */}
              <h3 className="text-xl font-heading font-bold text-white tracking-tight mt-6">
                {step.title}
              </h3>
              <p className="text-base text-neutral-300 leading-relaxed mt-2.5 font-normal">
                {step.description}
              </p>

            </div>
          ))}
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

        {/* Clear Action Pathways with Distinct CTA Hierarchy */}
        <div className="mt-16 sm:mt-20 pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center gap-5">
          {/* Primary: Champagne Gold */}
          <Button
            href={primaryCta.href}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
            icon={<ArrowUpRight className="w-4 h-4" />}
          >
            {primaryCta.label}
          </Button>

          {/* Secondary: Restrained Outline */}
          <Button
            href={secondaryCta.href}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto text-white border-white/25 hover:bg-white/10 hover:border-white"
          >
            {secondaryCta.label}
          </Button>
        </div>

      </div>
    </section>
  );
}
