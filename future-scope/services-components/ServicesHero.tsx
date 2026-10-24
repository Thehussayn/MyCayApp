import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import Button from "@/components/ui/Button";
import { SERVICES_PAGE_DATA } from "@/lib/copy-data";

export default function ServicesHero() {
  const { kicker, headline, introduction, primaryCta, secondaryLink, image, imageCaption } =
    SERVICES_PAGE_DATA.hero;

  return (
    <section className="bg-[#FDFDFD] text-[#252A2D] pt-32 sm:pt-40 lg:pt-48 pb-20 lg:pb-28 border-b border-neutral-200/80 relative overflow-hidden">
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

            {/* Approved Introduction */}
            <p className="text-base sm:text-lg text-[#52525B] leading-relaxed font-normal max-w-2xl mb-8 sm:mb-10">
              {introduction}
            </p>

            {/* Action Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
              <Button
                href={primaryCta.href}
                variant="primary"
                size="lg"
                icon={<ArrowUpRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                {primaryCta.label}
              </Button>

              <Link
                href={secondaryLink.href}
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#252A2D] hover:text-[#BE933C] transition-colors py-3 px-4 rounded-sm"
              >
                <span>{secondaryLink.label}</span>
                <ArrowDown className="w-4 h-4 text-[#BE933C]" />
              </Link>
            </div>

          </div>

          {/* Right: Large Architectural Visual (~42% on desktop) */}
          <div className="lg:col-span-5">
            <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[560px] rounded-2xl lg:rounded-3xl overflow-hidden bg-neutral-900 border border-black/[0.06] shadow-sm">
              <Image
                src={image}
                alt="Jeje-Ola Properties commercial development in Maitama, Abuja"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                <span className="text-xs uppercase tracking-wider text-white/90 font-medium bg-black/40 backdrop-blur-md px-3 py-1.5 rounded inline-block">
                  {imageCaption}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
