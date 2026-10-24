import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { INVEST_PAGE_COPY } from "@/lib/copy-data";

export default function InvestHero() {
  const { headline, subheadline, giapVisual, wealthStreamVisual } = INVEST_PAGE_COPY.hero;

  return (
    <section className="bg-[#FDFDFD] text-[#252A2D] pt-36 sm:pt-44 lg:pt-52 pb-24 lg:pb-32 border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Editorial Headline & Spacious Narrative */}
        <div className="max-w-5xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-4">
            Investment Overview
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] font-heading font-black tracking-tight text-[#252A2D] leading-[1.06]">
            Two Plans. One Promise. <br />
            <span className="text-[#BE933C]">Real Estate</span> That Works for You.
          </h1>
          <p className="mt-8 text-lg sm:text-xl text-[#52525B] leading-relaxed font-normal max-w-3xl">
            {subheadline}
          </p>
        </div>

        {/* Asymmetric Editorial Investment Imagery Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-end mt-16 sm:mt-20 lg:mt-24 pt-12 border-t border-neutral-200/80">
          
          {/* Path 1: Larger GIAP Architectural Anchor (~60% width on desktop) */}
          <div className="lg:col-span-7">
            <Link
              href="/invest/giap"
              className="group block"
              aria-label="Explore Global Investor Advantage Plan"
            >
              <div className="relative w-full aspect-[16/10] sm:h-[400px] lg:h-[460px] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200/70">
                <Image
                  src={giapVisual.image}
                  alt={giapVisual.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </div>

              <div className="pt-5 flex items-baseline justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#BE933C] block">
                    Path 01 · Own Property · Share in Growth
                  </span>
                  <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-[#252A2D] tracking-tight group-hover:text-[#BE933C] transition-colors mt-1">
                    {giapVisual.title}
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#252A2D] group-hover:text-[#BE933C] transition-colors shrink-0">
                  <span>Explore GIAP</span>
                  <ArrowUpRight className="w-4 h-4 text-[#BE933C] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          </div>

          {/* Path 2: Smaller, Refined WealthStream Interior Visual (~40% width on desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-end">
            <Link
              href="/invest/wealthstream"
              className="group block"
              aria-label="Explore WealthStream Investment Plan"
            >
              <div className="relative w-full aspect-[4/3] sm:h-[300px] lg:h-[350px] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200/70">
                <Image
                  src={wealthStreamVisual.image}
                  alt={wealthStreamVisual.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </div>

              <div className="pt-5 flex items-baseline justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#BE933C] block">
                    Path 02 · Predictable · Passive Income
                  </span>
                  <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-[#252A2D] tracking-tight group-hover:text-[#BE933C] transition-colors mt-1">
                    {wealthStreamVisual.title}
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#252A2D] group-hover:text-[#BE933C] transition-colors shrink-0">
                  <span>Explore WealthStream</span>
                  <ArrowUpRight className="w-4 h-4 text-[#BE933C] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
