import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, PhoneCall, MapPin } from "lucide-react";
import { CONTACT_PAGE_DATA } from "@/lib/copy-data";

export default function ContactHero() {
  const { eyebrow, headline, introduction, officeImage, officeImageAlt } = CONTACT_PAGE_DATA.hero;

  return (
    <section className="bg-[#FDFDFD] text-[#252A2D] pt-32 sm:pt-40 lg:pt-44 pb-16 sm:pb-20 border-b border-neutral-200/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Editorial Content Column */}
          <div className="lg:col-span-6 max-w-2xl">
            {/* Eyebrow */}
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-4">
              {eyebrow}
            </span>

            {/* Approved H1 Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-[#252A2D] leading-[1.08] mb-6">
              {headline}
            </h1>

            {/* Approved Subheadline */}
            <p className="text-lg sm:text-xl text-[#52525B] leading-relaxed font-normal mb-8">
              {introduction}
            </p>

            {/* Quick Navigation Anchors */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#inquiry-form"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#252A2D] bg-neutral-100 hover:bg-[#BE933C]/15 hover:text-[#252A2D] px-4 py-2.5 rounded-sm transition-colors border border-neutral-200/80"
              >
                <span>Write to Advisory</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#BE933C]" />
              </a>
              <a
                href="tel:+2348066873988"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#52525B] hover:text-[#252A2D] px-4 py-2.5 rounded-sm transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#BE933C]" />
                <span>+234 8066 873 988</span>
              </a>
              <a
                href="#location"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#52525B] hover:text-[#252A2D] px-4 py-2.5 rounded-sm transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#BE933C]" />
                <span>Guzape, Abuja</span>
              </a>
            </div>
          </div>

          {/* Architectural Image Column */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[16/10] sm:aspect-[16/11] rounded-sm overflow-hidden bg-neutral-100 border border-neutral-200/90 shadow-lg">
              <Image
                src={officeImage}
                alt={officeImageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs tracking-wider uppercase font-medium drop-shadow-md">
                Guzape Smart Office Complex · Plot 1059 Adamu Allero Crescent
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
