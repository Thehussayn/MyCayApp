import type { Metadata } from "next";
import React from "react";
import InvestHero from "@/components/invest/InvestHero";
import GiapOverviewStory from "@/components/invest/GiapOverviewStory";
import WealthStreamOverviewStory from "@/components/invest/WealthStreamOverviewStory";
import DirectComparison from "@/components/invest/DirectComparison";
import WhichPathMatches from "@/components/invest/WhichPathMatches";
import HowToGetStarted from "@/components/invest/HowToGetStarted";
import InvestCta from "@/components/invest/InvestCta";
import { INVEST_PAGE_COPY } from "@/lib/copy-data";

export const metadata: Metadata = {
  title: INVEST_PAGE_COPY.meta.title,
  description: INVEST_PAGE_COPY.meta.description,
  openGraph: {
    title: INVEST_PAGE_COPY.meta.title,
    description: INVEST_PAGE_COPY.meta.description,
    url: "https://jejeolaproperties.com.ng/invest",
    type: "website",
    images: [
      {
        url: INVEST_PAGE_COPY.hero.giapVisual.image,
        width: 1200,
        height: 630,
        alt: "Invest in Nigerian Real Estate — GIAP & WealthStream",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: INVEST_PAGE_COPY.meta.title,
    description: INVEST_PAGE_COPY.meta.description,
    images: [INVEST_PAGE_COPY.hero.giapVisual.image],
  },
  alternates: {
    canonical: "https://jejeolaproperties.com.ng/invest",
  },
};

export default function InvestPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: INVEST_PAGE_COPY.meta.title,
    description: INVEST_PAGE_COPY.meta.description,
    url: "https://jejeolaproperties.com.ng/invest",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "FinancialProduct",
            name: "Global Investor Advantage Plan (GIAP)",
            description:
              "Guided 70/30 real-estate investment structure with direct title ownership and 70% share of resale profits.",
            url: "https://jejeolaproperties.com.ng/invest/giap",
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "FinancialProduct",
            name: "WealthStream Investment Plan",
            description:
              "Fixed 20% to 24% annual ROI real-estate backed passive income plan with monthly or yearly distributions.",
            url: "https://jejeolaproperties.com.ng/invest/wealthstream",
          },
        },
      ],
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://jejeolaproperties.com.ng",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Invest",
          item: "https://jejeolaproperties.com.ng/invest",
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 01: Invest Hero — Headline & Dual Asymmetric Visual Representation */}
      <InvestHero />

      {/* 02: GIAP Editorial Story — Direct Property Ownership (70%) */}
      <GiapOverviewStory />

      {/* 03: WealthStream Editorial Story — Fixed Passive Cash Flow (20–24%) */}
      <WealthStreamOverviewStory />

      {/* 05: Direct Comparison Table across 7 Approved Dimensions */}
      <DirectComparison />

      {/* 06: Decision Support — Which Path Matches Your Goal? */}
      <WhichPathMatches />

      {/* 07: How to Get Started — 5-Step Linear Investor Journey */}
      <HowToGetStarted />

      {/* 08: Advisory Consultation CTA */}
      <InvestCta />
    </>
  );
}
