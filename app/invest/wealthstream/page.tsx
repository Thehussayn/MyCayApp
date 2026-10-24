import type { Metadata } from "next";
import React from "react";
import WealthStreamHero from "@/components/invest/wealthstream/WealthStreamHero";
import WealthStreamModel from "@/components/invest/wealthstream/WealthStreamModel";
import WealthStreamHowItWorks from "@/components/invest/wealthstream/WealthStreamHowItWorks";
import WealthStreamCalculatorSection from "@/components/invest/wealthstream/WealthStreamCalculatorSection";
import WealthStreamSafeguards from "@/components/invest/wealthstream/WealthStreamSafeguards";
import WealthStreamWithdrawals from "@/components/invest/wealthstream/WealthStreamWithdrawals";
import WealthStreamWhoFor from "@/components/invest/wealthstream/WealthStreamWhoFor";
import WealthStreamFaq from "@/components/invest/wealthstream/WealthStreamFaq";
import WealthStreamCta from "@/components/invest/wealthstream/WealthStreamCta";
import { WEALTHSTREAM_PAGE_DATA } from "@/lib/copy-data";

export const metadata: Metadata = {
  title: WEALTHSTREAM_PAGE_DATA.meta.title,
  description: WEALTHSTREAM_PAGE_DATA.meta.description,
  openGraph: {
    title: WEALTHSTREAM_PAGE_DATA.meta.title,
    description: WEALTHSTREAM_PAGE_DATA.meta.description,
    url: "https://jejeolaproperties.com.ng/invest/wealthstream",
    type: "website",
    images: [
      {
        url: WEALTHSTREAM_PAGE_DATA.hero.image,
        width: 1200,
        height: 630,
        alt: "WealthStream Investment Plan | 20–24% Annual ROI | Jeje-Ola",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: WEALTHSTREAM_PAGE_DATA.meta.title,
    description: WEALTHSTREAM_PAGE_DATA.meta.description,
    images: [WEALTHSTREAM_PAGE_DATA.hero.image],
  },
  alternates: {
    canonical: "https://jejeolaproperties.com.ng/invest/wealthstream",
  },
};

export default function WealthStreamDetailPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FinancialProduct",
        name: "WealthStream Investment Plan",
        description: WEALTHSTREAM_PAGE_DATA.meta.description,
        provider: {
          "@type": "RealEstateAgent",
          name: "Jeje-Ola Properties Nig. Ltd.",
        },
        url: "https://jejeolaproperties.com.ng/invest/wealthstream",
        annualPercentageRate: "20% to 24%",
        feesAndCommissionsSpecification:
          "Zero management or setup fees. 100% of underlying capital returned upon standard 6-month notice.",
        offers: {
          "@type": "Offer",
          priceCurrency: "NGN",
          price: "1000000",
          description: "Minimum investment from ₦1,000,000 to ₦1,000,000,000+",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: WEALTHSTREAM_PAGE_DATA.faqs.map((faq) => ({
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
            name: "WealthStream",
            item: "https://jejeolaproperties.com.ng/invest/wealthstream",
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

      {/* 01: Hero — Editorial Split Layout with Serene Architecture */}
      <WealthStreamHero />

      {/* 02: The WealthStream Model — The Two Approved Payout Options */}
      <WealthStreamModel />

      {/* 03: How It Works — 5-Step Editorial Timeline */}
      <WealthStreamHowItWorks />

      {/* 04: Interactive ROI Calculator — Dedicated Section */}
      <WealthStreamCalculatorSection />

      {/* 05: Investment Safeguards — Real Estate Backing & Direct Bank Payouts */}
      <WealthStreamSafeguards />

      {/* 06: Withdrawals & Capital Exit — 6-Month Notice Requirement */}
      <WealthStreamWithdrawals />

      {/* 07: Who WealthStream Is For — 6 Approved Investor Profiles */}
      <WealthStreamWhoFor />

      {/* 08: Frequently Asked Questions — Accessible Accordions */}
      <WealthStreamFaq />

      {/* 09: Advisory Consultation CTA */}
      <WealthStreamCta />
    </>
  );
}
