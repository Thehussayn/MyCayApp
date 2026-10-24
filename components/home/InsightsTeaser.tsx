import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LATEST_INSIGHTS } from "@/lib/copy-data";

export default function InsightsTeaser() {
  return (
    <section className="py-24 lg:py-32 bg-[#FDFDFD] text-[#252A2D] border-t border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ====================================================
            SECTION HEADER — Confident, Spacious & Integrated
            ==================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16 pb-6 border-b border-neutral-200/80">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-[#252A2D] leading-[1.12]">
              Insights for Smart Investors &amp; Homeowners
            </h2>
          </div>
          
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#252A2D] hover:text-[#BE933C] transition-colors group shrink-0 pb-1"
          >
            <span>Explore All Insights</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#BE933C]" />
          </Link>
        </div>

        {/* ====================================================
            3-COLUMN UNBOXED EDITORIAL GRID
            Minimalist Structure: Image -> Title -> Read Article Link
            Zero Outer Containers / Borders / Card Wrappers
            ==================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 items-start">
          {LATEST_INSIGHTS.map((article) => (
            <article key={article.slug} className="flex flex-col group">
              <Link href={`/insights/${article.slug}`} className="block">
                
                {/* 1. Large High-Quality Image */}
                <div className="relative w-full aspect-[16/10] rounded-xl lg:rounded-2xl overflow-hidden bg-neutral-900 border border-black/[0.06]">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>

                {/* 2. Approved Editorial Title */}
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#252A2D] tracking-tight group-hover:text-[#BE933C] transition-colors mt-5 leading-snug">
                  {article.title}
                </h3>

                {/* 3. Refined Read Article Link */}
                <div className="mt-4 flex items-center">
                  <span className="inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-[#252A2D] group-hover:text-[#BE933C] transition-colors">
                    Read Article
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#BE933C]" />
                  </span>
                </div>

              </Link>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
