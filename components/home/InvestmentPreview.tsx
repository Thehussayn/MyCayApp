import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Button from "@/components/ui/Button";

export default function InvestmentPreview() {
  return (
    <section className="py-24 lg:py-32 bg-[#252A2D] text-white border-t border-white/10 relative overflow-hidden">
      
      {/* Subtle ambient lighting for architectural depth */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#BE933C]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#BE933C]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ====================================================
            SECTION INTRO — Confident, Restrained & Editorial
            ==================================================== */}
        <div className="max-w-3xl mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-white leading-[1.12]">
            Two Ways to Grow Wealth Through Real Estate
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-400 leading-relaxed font-normal">
            Whether you demand physical property ownership with shared appreciation or predictable recurring cash payouts, our investment structures are asset-backed and legally secured.
          </p>
        </div>

        {/* ====================================================
            PRODUCT 1: GIAP (Global Investor Advantage Plan)
            Option A: [ Large Architectural Image (Left) ] [ Content (Right) ]
            ==================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
          
          {/* Left: Large Architectural Property Visual (~50% width) */}
          <div className="lg:col-span-6 relative w-full h-[320px] sm:h-[420px] lg:h-[480px] rounded-xl lg:rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85"
              alt="Prime completed residential development by Jeje-Ola Properties in Abuja"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
            />
          </div>

          {/* Right: Editorial Content Storytelling (~50% width) */}
          <div className="lg:col-span-6 flex flex-col justify-center lg:pl-4 xl:pl-8">
            
            {/* Small Product Identifier */}
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C]">
              GIAP
            </span>

            {/* Product Title */}
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-white tracking-tight mt-2 leading-tight">
              Global Investor Advantage Plan
            </h3>

            {/* Dominant Core Proposition: 70% */}
            <div className="my-4 sm:my-6">
              <div className="text-6xl sm:text-7xl lg:text-8xl font-heading font-black text-white tracking-tight leading-none">
                70%
              </div>
              <div className="text-base sm:text-lg font-heading font-bold text-[#BE933C] mt-2">
                Profit Share on Resale · Direct Property Ownership
              </div>
            </div>

            {/* Concise Description Derived Strictly from Supplied Copy */}
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal">
              A guided wealth-building scheme. We help you identify and purchase verified high-growth property with full legal title registered in your name. When the property is resold at peak valuation, you receive your full capital back plus 70% of the net profit.
            </p>

            {/* Key Reassurance Points — Unboxed, Clean Typography */}
            <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-neutral-400 font-medium">
              <span>Title registered 100% in your name</span>
              <span className="text-neutral-600">•</span>
              <span>Zero entry or legal search fees</span>
              <span className="text-neutral-600">•</span>
              <span>100% aligned interest</span>
            </div>

            {/* Interactive Editorial CTA — Standard Button Shape & Styling */}
            <div className="mt-8">
              <Button
                href="/invest"
                variant="primary"
                size="md"
                icon={<ArrowUpRight className="w-4 h-4" />}
              >
                Learn About GIAP
              </Button>
            </div>

          </div>

        </div>

        {/* Generous Editorial Divider Between Products */}
        <div className="my-16 sm:my-20 lg:my-24 border-t border-white/10" />

        {/* ====================================================
            PRODUCT 2: WEALTHSTREAM (WealthStream Investment Plan)
            Option A: [ Content (Left) ] [ Large Property / Lifestyle Image (Right) ]
            ==================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
          
          {/* Content (Left on desktop, second on mobile) */}
          <div className="lg:col-span-6 flex flex-col justify-center lg:pr-4 xl:pr-8 order-2 lg:order-1">
            
            {/* Small Product Identifier */}
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C]">
              WealthStream
            </span>

            {/* Product Title */}
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-white tracking-tight mt-2 leading-tight">
              WealthStream Investment Plan
            </h3>

            {/* Dominant Core Proposition: 20–24% */}
            <div className="my-4 sm:my-6">
              <div className="text-6xl sm:text-7xl lg:text-8xl font-heading font-black text-white tracking-tight leading-none">
                20–24%
              </div>
              <div className="text-base sm:text-lg font-heading font-bold text-[#BE933C] mt-2">
                Fixed Annual ROI · Tangible Real-Estate Backed
              </div>
            </div>

            {/* Concise Description Derived Strictly from Supplied Copy */}
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal">
              A fixed-return, real-estate-backed passive cash flow vehicle. Earn 20% annual ROI paid lump sum, or 24% annual ROI paid out as monthly cash distributions directly to your bank account—completely hands-free.
            </p>

            {/* Key Reassurance Points — Unboxed, Clean Typography */}
            <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-neutral-400 font-medium">
              <span>Monthly (2.0%) or annual payouts</span>
              <span className="text-neutral-600">•</span>
              <span>Direct commercial bank disbursements</span>
              <span className="text-neutral-600">•</span>
              <span>Zero property management hassles</span>
            </div>

            {/* Interactive Editorial CTA — Standard Button Shape & Styling */}
            <div className="mt-8">
              <Button
                href="/invest"
                variant="primary"
                size="md"
                icon={<ArrowUpRight className="w-4 h-4" />}
              >
                Learn About WealthStream
              </Button>
            </div>

          </div>

          {/* Right: Large Investor Lifestyle / Property Visual (~50% width, first on mobile) */}
          <div className="lg:col-span-6 relative w-full h-[320px] sm:h-[420px] lg:h-[480px] rounded-xl lg:rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl order-1 lg:order-2">
            <Image
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85"
              alt="Refined architectural living space backed by institutional real estate investment"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
            />
          </div>

        </div>

      </div>
    </section>
  );
}
