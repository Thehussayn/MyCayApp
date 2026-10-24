import React from "react";
import { ArrowUpRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { GIAP_PAGE_DATA } from "@/lib/copy-data";

export default function GiapCta() {
  const { headline, subheadline, primaryCta, phone } = GIAP_PAGE_DATA.cta;

  return (
    <section className="py-28 sm:py-36 lg:py-44 bg-[#252A2D] text-white border-t border-white/10 relative overflow-hidden">
      
      {/* Subtle warm ambient depth */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#BE933C]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* Left: Dominant Editorial Headline (~60% on desktop) */}
          <div className="lg:col-span-7">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black tracking-tight text-white leading-[1.06]">
              {headline}
            </h2>
          </div>

          {/* Right: Supporting Copy & Action Pathways (~40% on desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal">
              {subheadline}
            </p>

            {/* Primary Action Button */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-6">
              <Button
                href={primaryCta.href}
                variant="primary"
                size="lg"
                icon={<ArrowUpRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                {primaryCta.label}
              </Button>
            </div>

            {/* Secondary Direct Contact */}
            {phone && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <span className="text-xs text-neutral-400 block font-normal">
                  Prefer to speak with an investment advisor directly?
                </span>
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="text-base font-semibold text-white hover:text-[#BE933C] transition-colors inline-block mt-1"
                >
                  {phone}
                </a>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
