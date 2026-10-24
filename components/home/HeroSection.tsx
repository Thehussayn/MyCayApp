"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { HERO_COPY } from "@/lib/copy-data";

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center text-white pt-36 sm:pt-44 lg:pt-48 pb-24 sm:pb-32 overflow-hidden bg-[#202528]">
      
      {/* Background Architectural Image (Full-Bleed Befitting Visual) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=90"
          alt="Luxury architectural development by Jeje-Ola Properties in Abuja"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Multi-Stage Dark Vignette Overlay for Crisp Typography Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#202528]/85 via-[#202528]/75 to-[#202528]" />
        
        {/* Subtle Warm Amber/Gold Ambient Tint */}
        <div className="absolute inset-0 bg-radial-gradient from-[#BE933C]/15 via-transparent to-transparent opacity-60 pointer-events-none" />
      </div>

      {/* Main Content Area — Centered Editorial Typography */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col justify-center items-center text-center my-auto">
        
        {/* Centered 3-Line Oversized Editorial Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black tracking-tight leading-[1.05] text-white">
          <span className="block text-white">Premium Real Estate.</span>
          <span className="block text-[#BE933C]">Trusted Investment.</span>
          <span className="block text-neutral-200">Lasting Legacy.</span>
        </h1>

        {/* Centered Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed font-normal mt-6 sm:mt-8">
          {HERO_COPY.subheadline}
        </p>

        {/* Centered Dual CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 sm:pt-10 w-full sm:w-auto">
          <Button
            href={HERO_COPY.primaryCta.href}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto justify-center px-8 py-4 text-base"
            icon={<ArrowUpRight className="w-4 h-4" />}
          >
            {HERO_COPY.primaryCta.label}
          </Button>
          <Button
            href={HERO_COPY.secondaryCta.href}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto justify-center text-white border-white/30 hover:border-white hover:bg-white/10 px-8 py-4 text-base"
          >
            {HERO_COPY.secondaryCta.label}
          </Button>
        </div>

      </div>

    </section>
  );
}
