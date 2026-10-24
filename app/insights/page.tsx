import PublishedArticles from "@/components/insights/PublishedArticles";
import type { Metadata } from "next";
import React from "react";
import InsightsHero from "@/components/insights/InsightsHero";
import FeaturedArticle from "@/components/insights/FeaturedArticle";
import InsightsFeed from "@/components/insights/InsightsFeed";
import NewsletterStrip from "@/components/insights/NewsletterStrip";
import { INSIGHTS_PAGE_DATA } from "@/lib/copy-data";

export const metadata: Metadata = {
  title: INSIGHTS_PAGE_DATA.meta.title,
  description: INSIGHTS_PAGE_DATA.meta.description,
  openGraph: {
    title: INSIGHTS_PAGE_DATA.meta.title,
    description: INSIGHTS_PAGE_DATA.meta.description,
    url: "https://jejeolaproperties.com.ng/insights",
    type: "website",
    images: [
      {
        url: INSIGHTS_PAGE_DATA.featuredArticle.image,
        width: 1200,
        height: 630,
        alt: "Jeje-Ola Properties Real Estate Insights & Market Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: INSIGHTS_PAGE_DATA.meta.title,
    description: INSIGHTS_PAGE_DATA.meta.description,
    images: [INSIGHTS_PAGE_DATA.featuredArticle.image],
  },
  alternates: {
    canonical: "https://jejeolaproperties.com.ng/insights",
  },
};

export default function InsightsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: INSIGHTS_PAGE_DATA.meta.title,
    description: INSIGHTS_PAGE_DATA.meta.description,
    url: "https://jejeolaproperties.com.ng/insights",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: INSIGHTS_PAGE_DATA.pillarArticles.map(
        (article, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          item: {
            "@type": "Article",
            headline: article.title,
            url: `https://jejeolaproperties.com.ng/insights/${article.slug}`,
            image: article.image,
            publisher: {
              "@type": "Organization",
              name: "Jeje-Ola Properties Nig. Ltd.",
              url: "https://jejeolaproperties.com.ng",
            },
          },
        }),
      ),
    },
  };

  return (
    <main className="min-h-screen bg-[#FDFDFD]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* 1. Minimal Editorial Hero */}
      <InsightsHero />

      {/* 2. Dominant Featured Story */}
      <FeaturedArticle />

      {/* 3. Category Filter & Curated Editorial Article Feed */}
      <PublishedArticles />
      <InsightsFeed />

      {/* 4. Restrained Newsletter Closing Strip */}
      <NewsletterStrip />
    </main>
  );
}
