import { publishedArticles } from "@/lib/platform/content";
import type { Metadata } from "next";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import NewsletterStrip from "@/components/insights/NewsletterStrip";
import { INSIGHTS_PAGE_DATA } from "@/lib/copy-data";

interface ArticleDetailPageProps {
  params: {
    slug: string;
  };
}

export function generateMetadata({ params }: ArticleDetailPageProps): Metadata {
  const managed = publishedArticles().find((a) => a.slug === params.slug);
  const article = INSIGHTS_PAGE_DATA.pillarArticles.find(
    (a) => a.slug === params.slug,
  );

  if (managed) return { title: managed.title, description: managed.excerpt };
  if (!article) {
    return {
      title: "Article Not Found — Jeje-Ola Properties",
    };
  }

  return {
    title: `${article.title} — Jeje-Ola Properties Insights`,
    description: `Read "${article.title}" — Market analysis and real-estate insights from Jeje-Ola Properties.`,
    openGraph: {
      title: `${article.title} — Jeje-Ola Properties`,
      description: `Market analysis and real-estate insights from Jeje-Ola Properties.`,
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    alternates: {
      canonical: `https://jejeolaproperties.com.ng/insights/${article.slug}`,
    },
  };
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const managed = publishedArticles().find((a) => a.slug === params.slug);
  const article = INSIGHTS_PAGE_DATA.pillarArticles.find(
    (a) => a.slug === params.slug,
  );

  if (managed)
    return (
      <article className="pt-32 pb-20 px-4 sm:px-6 max-w-3xl mx-auto">
        <Link className="text-sm underline" href="/insights">
          Back to insights
        </Link>
        <p className="text-sm text-neutral-500 mt-8">
          {managed.updatedAt.slice(0, 10)}
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold mt-3 mb-8">
          {managed.title}
        </h1>
        <div className="space-y-5 text-base sm:text-lg leading-relaxed">
          {managed.body.split(/\n\s*\n/).map((paragraph, i) => (
            <p key={i} className="whitespace-pre-wrap">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    );
  if (!article) {
    notFound();
  }

  const relatedArticles = INSIGHTS_PAGE_DATA.pillarArticles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    image: article.image,
    publisher: {
      "@type": "Organization",
      name: "Jeje-Ola Properties Nig. Ltd.",
      url: "https://jejeolaproperties.com.ng",
    },
  };

  return (
    <div className="bg-[#FDFDFD] text-[#252A2D] pt-28 sm:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500 mb-8 sm:mb-12">
          <Link href="/" className="hover:text-[#252A2D] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/insights"
            className="hover:text-[#252A2D] transition-colors"
          >
            Insights
          </Link>
          <span>/</span>
          <span className="text-[#252A2D] font-semibold truncate max-w-[200px] sm:max-w-xs">
            {article.title}
          </span>
        </div>

        {/* Back Link */}
        <div className="mb-10">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#252A2D] hover:text-[#BE933C] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#BE933C]" />
            <span>Return to All Insights</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-10 sm:mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-3">
            {article.category}
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-[#252A2D] leading-[1.12]">
            {article.title}
          </h1>
        </header>

        {/* Featured Image */}
        <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200/80 shadow-sm mb-12">
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover object-center"
          />
        </div>

        {/* Editorial Body Notice */}
        <div className="p-8 sm:p-10 rounded-2xl bg-[#F8F8F6] border border-neutral-200/80 mb-16">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#252A2D] mb-3">
            Publication in Editorial Preparation
          </h2>
          <p className="text-base text-[#52525B] leading-relaxed">
            The full long-form analysis for this guide is currently being
            finalized by our research and advisory team. Subscribe below to
            receive the complete release directly to your inbox upon
            publication.
          </p>
        </div>

        {/* Related Articles Strip */}
        <div className="pt-12 border-t border-neutral-200/80">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-6">
            Related Insights
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {relatedArticles.map((related) => (
              <Link
                key={related.id}
                href={`/insights/${related.slug}`}
                className="group block"
              >
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-neutral-900 border border-black/[0.06] mb-4">
                  <Image
                    src={related.image}
                    alt={related.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 400px"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#BE933C] block mb-1">
                  {related.category}
                </span>
                <h3 className="text-base sm:text-lg font-heading font-bold text-[#252A2D] group-hover:text-[#BE933C] transition-colors leading-snug">
                  {related.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Signup Strip */}
      <NewsletterStrip />
    </div>
  );
}
