import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PROPERTIES_PAGE_COPY } from "@/lib/copy-data";

export default function DeliveredPortfolioStrip() {
  const { kicker, heading, description, ctaLabel, ctaHref } = PROPERTIES_PAGE_COPY.deliveredStrip;

  return (
    <section className="py-16 sm:py-20 bg-[#F8F8F6] text-[#252A2D] border-y border-[#E7E7E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center justify-between">
          
          {/* Left: Editorial Statement (~65% on desktop) */}
          <div className="lg:col-span-8">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-2">
              {kicker}
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#252A2D] tracking-tight leading-snug">
              {heading}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#52525B] leading-relaxed max-w-2xl font-normal">
              {description}
            </p>
          </div>

          {/* Right: Direct Advisory Pathway (~35% on desktop) */}
          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#252A2D] text-white hover:bg-neutral-800 text-sm font-semibold transition-colors group"
            >
              <span>{ctaLabel}</span>
              <ArrowUpRight className="w-4 h-4 text-[#BE933C] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
