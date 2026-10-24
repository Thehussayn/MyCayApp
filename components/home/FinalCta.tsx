import React from "react";
import { ArrowUpRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { COMPANY_INFO } from "@/lib/copy-data";

export default function FinalCta() {
  const primaryPhone = COMPANY_INFO.headquarters.phone[0];

  return (
    <section className="py-24 sm:py-32 lg:py-40 bg-[#252A2D] text-white border-t border-white/10 relative overflow-hidden">
      
      {/* Subtle warm ambient depth */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#BE933C]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ====================================================
            ASYMMETRIC EDITORIAL CLOSING STATEMENT
            Left (~60%): Oversized Headline
            Right (~40%): Narrative & Primary / Secondary Action
            ==================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* Left: Dominant Editorial Headline */}
          <div className="lg:col-span-7">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black tracking-tight text-white leading-[1.06]">
              Your Future is a Decision Away.
            </h2>
          </div>

          {/* Right: Supporting Copy & Restrained Actions */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal">
              Book a private consultation with our advisory team at the Guzape Smart Office Complex or via secure video conference, and discover how you can build wealth through real estate the Jeje-Ola way.
            </p>

            {/* Primary Action */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-6">
              <Button
                href="/contact"
                variant="primary"
                size="lg"
                icon={<ArrowUpRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Book Free Consultation
              </Button>
            </div>

            {/* Secondary Contact Option */}
            {primaryPhone && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <span className="text-xs text-neutral-400 block font-normal">
                  Prefer to speak with us?
                </span>
                <a
                  href={`tel:${primaryPhone.replace(/\s+/g, "")}`}
                  className="text-sm sm:text-base font-semibold text-white hover:text-[#BE933C] transition-colors inline-block mt-1"
                >
                  {primaryPhone}
                </a>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
