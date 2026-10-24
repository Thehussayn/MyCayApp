import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ArrowDown } from "lucide-react";
import Button from "@/components/ui/Button";
import { WEALTHSTREAM_PAGE_DATA } from "@/lib/copy-data";

export default function WealthStreamHero() {
  const { planName, headline, subheadline, primaryCta, secondaryLink, image, imageCaption } =
    WEALTHSTREAM_PAGE_DATA.hero;

  return (
    <section className="bg-[#FDFDFD] text-[#252A2D] pt-32 sm:pt-40 lg:pt-48 pb-20 lg:pb-28 border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-10 sm:mb-12">
          <Link
            href="/invest"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-[#BE933C] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Investment Overview</span>
          </Link>
        </div>

        {/* Editorial Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* Left Column: Spacious Typography & Action (~55% on desktop) */}
          <div className="lg:col-span-7">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-4">
              {planName}
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-heading font-black tracking-tight text-[#252A2D] leading-[1.08] max-w-2xl">
              Earn Effortlessly. <br />
              <span className="text-[#BE933C]">We Do the Work.</span>
            </h1>
            
            <p className="mt-8 text-lg sm:text-xl text-[#52525B] leading-relaxed font-normal max-w-xl">
              {subheadline}
            </p>

            {/* Restrained Consultation CTA & Anchor Navigation */}
            <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row sm:items-center gap-5">
              <Button
                href={primaryCta.href}
                variant="primary"
                size="lg"
                icon={<ArrowUpRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                {primaryCta.label}
              </Button>

              <a
                href={secondaryLink.href}
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#252A2D] hover:text-[#BE933C] transition-colors py-3 sm:py-0"
              >
                <span>{secondaryLink.label}</span>
                <ArrowDown className="w-4 h-4 text-[#BE933C]" />
              </a>
            </div>
          </div>

          {/* Right Column: Serene Architectural Living Space Visual (~45% on desktop) */}
          <div className="lg:col-span-5">
            <div className="relative w-full aspect-[4/3] sm:h-[440px] lg:h-[500px] rounded-2xl lg:rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200/70">
              <Image
                src={image}
                alt="Quiet architectural interior communicating calm passive cash flow backed by real estate"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-center"
              />
            </div>
            <div className="pt-3.5 text-xs uppercase tracking-wider text-neutral-400 font-medium">
              {imageCaption}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
