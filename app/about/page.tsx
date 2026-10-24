import type { Metadata } from "next";
import React from "react";
import AboutHero from "@/components/about/AboutHero";
import CompanyStory from "@/components/about/CompanyStory";
import TrackRecordMoment from "@/components/about/TrackRecordMoment";
import VisualLegacy from "@/components/about/VisualLegacy";
import LeadershipSection from "@/components/about/LeadershipSection";
import OurValues from "@/components/about/OurValues";
import SmartOfficeSection from "@/components/about/SmartOfficeSection";
import AboutCta from "@/components/about/AboutCta";
import { ABOUT_COPY } from "@/lib/copy-data";

export const metadata: Metadata = {
  title: ABOUT_COPY.meta.title,
  description: ABOUT_COPY.meta.description,
  openGraph: {
    title: ABOUT_COPY.meta.title,
    description: ABOUT_COPY.meta.description,
    url: "https://jejeolaproperties.com.ng/about",
    type: "website",
    images: [
      {
        url: ABOUT_COPY.hero.heroImage,
        width: 1200,
        height: 630,
        alt: "About Jeje-Ola Properties — 18 Years of Real Estate Excellence in Nigeria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ABOUT_COPY.meta.title,
    description: ABOUT_COPY.meta.description,
    images: [ABOUT_COPY.hero.heroImage],
  },
  alternates: {
    canonical: "https://jejeolaproperties.com.ng/about",
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: ABOUT_COPY.meta.title,
    description: ABOUT_COPY.meta.description,
    url: "https://jejeolaproperties.com.ng/about",
    mainEntity: {
      "@type": ["Organization", "RealEstateAgent"],
      name: "Jeje-Ola Properties Nig. Ltd.",
      alternateName: "MyCayApp by Jeje-Ola",
      identifier: "RC.1317171",
      foundingDate: "2008",
      founder: {
        "@type": "Person",
        name: "Alhaji (Dr.) Teslim Jeje-Ola Sanusi",
        jobTitle: "Founder & CEO",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Plot 1059, Adamu Allero Crescent",
        addressLocality: "Guzape",
        addressRegion: "Abuja",
        addressCountry: "NG",
      },
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
          name: "About",
          item: "https://jejeolaproperties.com.ng/about",
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

      {/* 01: About Editorial Hero */}
      <AboutHero />

      {/* 02: Company Story — From Ilorin to Abuja */}
      <CompanyStory />

      {/* 03: 18 Years & 900+ Delivered — Evidence of Integrity */}
      <TrackRecordMoment />

      {/* 04: Visual Legacy & Architectural Craft */}
      <VisualLegacy />

      {/* 05: Authentic Leadership — Founder & CEO + Chairman */}
      <LeadershipSection />

      {/* 06: Our Core Values — Typography-Led Sequence */}
      <OurValues />

      {/* 07: Guzape Smart Office Complex — Physical Permanence */}
      <SmartOfficeSection />

      {/* 08: Final Consultation & Action CTA */}
      <AboutCta />
    </>
  );
}
