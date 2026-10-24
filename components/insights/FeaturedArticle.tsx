import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { INSIGHTS_PAGE_DATA } from "@/lib/copy-data";

export default function FeaturedArticle() {
  const article = INSIGHTS_PAGE_DATA.featuredArticle;

  return (
    <section className="bg-[#FDFDFD] text-[#252A2D] py-12 sm:py-16 lg:py-20 border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link
          href={`/insights/${article.slug}`}
          className="group block"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 xl:gap-16 items-center">
            
            {/* Left: Large 16:10 Dominant Image */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-neutral-900 border border-black/[0.06] shadow-sm">
                <Image
                  src={article.image}
                  alt={article.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </div>

            {/* Right: Editorial Narrative */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-3">
                {article.category}
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight text-[#252A2D] leading-[1.15] mb-6 group-hover:text-[#BE933C] transition-colors">
                {article.title}
              </h2>

              <div>
                <span className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#252A2D] group-hover:text-[#BE933C] transition-colors">
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 text-[#BE933C] transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>
              </div>
            </div>

          </div>
        </Link>

      </div>
    </section>
  );
}
