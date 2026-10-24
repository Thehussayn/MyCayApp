import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleItem } from "@/lib/copy-data";

interface ArticleGridProps {
  articles: ArticleItem[];
}

export default function ArticleGrid({ articles }: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <section className="py-20 sm:py-24 bg-[#FDFDFD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-neutral-500 font-normal">
            No articles currently published in this category. Check back soon for new research and market intelligence.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#FDFDFD] border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {articles.map((article, idx) => {
            // Alternating editorial rhythm: 7/5 then 5/7
            const isLarge = idx % 4 === 0 || idx % 4 === 3;
            const colSpan = isLarge ? "lg:col-span-7" : "lg:col-span-5";

            return (
              <article
                key={article.id}
                className={`${colSpan} flex flex-col`}
              >
                <Link
                  href={`/insights/${article.slug}`}
                  className="group block"
                >
                  {/* Image Container with Consistent Corner Radius */}
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-neutral-900 border border-black/[0.06] shadow-sm mb-6">
                    <Image
                      src={article.image}
                      alt={article.imageAlt}
                      fill
                      sizes={isLarge ? "(max-width: 1024px) 100vw, 58vw" : "(max-width: 1024px) 100vw, 42vw"}
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>

                  {/* Metadata: Category Only (No fabricated author/date) */}
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-2.5">
                    {article.category}
                  </span>

                  {/* Title */}
                  <h3 className={`font-heading font-bold text-[#252A2D] group-hover:text-[#BE933C] transition-colors leading-[1.2] mb-4 ${
                    isLarge ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
                  }`}>
                    {article.title}
                  </h3>

                  {/* Editorial Read Link */}
                  <div>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#252A2D] group-hover:text-[#BE933C] transition-colors">
                      <span>Read Article</span>
                      <ArrowRight className="w-4 h-4 text-[#BE933C] transition-transform duration-300 group-hover:translate-x-1.5" />
                    </span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
