import type { Metadata } from "next";
import React from "react";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesIntroTransition from "@/components/services/ServicesIntroTransition";
import ServiceSection from "@/components/services/ServiceSection";
import ServicesCta from "@/components/services/ServicesCta";
import { SERVICES_PAGE_DATA } from "@/lib/copy-data";

export const metadata: Metadata = {
  title: SERVICES_PAGE_DATA.meta.title,
  description: SERVICES_PAGE_DATA.meta.description,
  openGraph: {
    title: SERVICES_PAGE_DATA.meta.title,
    description: SERVICES_PAGE_DATA.meta.description,
    url: "https://jejeolaproperties.com.ng/services",
    type: "website",
    images: [
      {
        url: SERVICES_PAGE_DATA.hero.image,
        width: 1200,
        height: 630,
        alt: "Jeje-Ola Properties — End-to-End Real Estate Services in Nigeria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SERVICES_PAGE_DATA.meta.title,
    description: SERVICES_PAGE_DATA.meta.description,
    images: [SERVICES_PAGE_DATA.hero.image],
  },
  alternates: {
    canonical: "https://jejeolaproperties.com.ng/services",
  },
};

export default function ServicesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": SERVICES_PAGE_DATA.meta.title,
    "description": SERVICES_PAGE_DATA.meta.description,
    "url": "https://jejeolaproperties.com.ng/services",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": SERVICES_PAGE_DATA.services.map((service, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "item": {
          "@type": "Service",
          "name": service.name,
          "description": service.description,
          "url": `https://jejeolaproperties.com.ng/services/${service.slug}`,
          "provider": {
            "@type": "Organization",
            "name": "Jeje-Ola Properties Nig. Ltd.",
            "url": "https://jejeolaproperties.com.ng"
          }
        }
      }))
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFDFD]">
      {/* Schema.org CollectionPage / ItemList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Asymmetric Editorial Hero */}
      <ServicesHero />

      {/* 2. Editorial Transition */}
      <ServicesIntroTransition />

      {/* 3. Six Alternating Editorial Service Sections */}
      <div>
        {SERVICES_PAGE_DATA.services.map((service, index) => (
          <ServiceSection
            key={service.id}
            service={service}
            index={index}
          />
        ))}
      </div>

      {/* 4. Global Advisory Consultation CTA */}
      <ServicesCta />
    </main>
  );
}
