import type { Metadata } from "next";
import React from "react";
import GiapHero from "@/components/invest/giap/GiapHero";
import GiapWhyExists from "@/components/invest/giap/GiapWhyExists";
import GiapHowItWorks from "@/components/invest/giap/GiapHowItWorks";
import GiapDifferentiation from "@/components/invest/giap/GiapDifferentiation";
import GiapFinancialModel from "@/components/invest/giap/GiapFinancialModel";
import GiapSafeguards from "@/components/invest/giap/GiapSafeguards";
import GiapFaq from "@/components/invest/giap/GiapFaq";
import GiapCta from "@/components/invest/giap/GiapCta";
import { GIAP_PAGE_DATA } from "@/lib/copy-data";

export const metadata: Metadata = {
  title: GIAP_PAGE_DATA.meta.title,
  description: GIAP_PAGE_DATA.meta.description,
  openGraph: {
    title: GIAP_PAGE_DATA.meta.title,
    description: GIAP_PAGE_DATA.meta.description,
    url: "https://jejeolaproperties.com.ng/invest/giap",
    type: "website",
    images: [
      {
        url: GIAP_PAGE_DATA.hero.image,
        width: 1200,
        height: 630,
        alt: "GIAP — Global Investor Advantage Plan | Jeje-Ola Properties",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: GIAP_PAGE_DATA.meta.title,
    description: GIAP_PAGE_DATA.meta.description,
    images: [GIAP_PAGE_DATA.hero.image],
  },
  alternates: {
    canonical: "https://jejeolaproperties.com.ng/invest/giap",
  },
};

export default function GiapDetailPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FinancialProduct",
        name: "Global Investor Advantage Plan (GIAP)",
        description: GIAP_PAGE_DATA.meta.description,
        provider: {
          "@type": "RealEstateAgent",
          name: "Jeje-Ola Properties Nig. Ltd.",
        },
        url: "https://jejeolaproperties.com.ng/invest/giap",
        feesAndCommissionsSpecification:
          "Zero agency, legal search, or entrance fees. 30% performance fee shared exclusively on net profit upon resale.",
        offers: {
          "@type": "Offer",
          priceCurrency: "NGN",
          description: "Flexible entry based on verified property asset class",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: GIAP_PAGE_DATA.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      {
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
          {
            "@type": "ListItem",
            position: 3,
            name: "GIAP",
            item: "https://jejeolaproperties.com.ng/invest/giap",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 01: Hero — Editorial Split Layout with Authentic Architecture */}
      <GiapHero />

      {/* 02: Why GIAP Exists — Spacious Text on Ownership & Legacy */}
      <GiapWhyExists />

      {/* 03: How GIAP Works — 8-Step Timeline (Horizontal Desktop / Vertical Mobile) */}
      <GiapHowItWorks />

      {/* 04: What Makes GIAP Different — 3 Core Pillars */}
      <GiapDifferentiation />

      {/* 05: The 70/30 Financial Model — Worked Example with Proportional Bar */}
      <GiapFinancialModel />

      {/* 06: Safeguards & Ownership — Legal Protection & Title Deeds */}
      <GiapSafeguards />

      {/* 07: Frequently Asked Questions — Accessible Accordions */}
      <GiapFaq />

      {/* 08: Advisory Consultation CTA */}
      <GiapCta />
    </>
  );
}
