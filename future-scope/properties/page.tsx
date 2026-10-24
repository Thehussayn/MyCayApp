import type { Metadata } from "next";
import React from "react";
import PropertiesHero from "@/components/properties/PropertiesHero";
import PropertyGrid from "@/components/properties/PropertyGrid";
import DeliveredPortfolioStrip from "@/components/properties/DeliveredPortfolioStrip";
import PropertyCta from "@/components/properties/PropertyCta";
import { PROPERTIES, PROPERTIES_PAGE_COPY } from "@/lib/copy-data";

export const metadata: Metadata = {
  title: PROPERTIES_PAGE_COPY.meta.title,
  description: PROPERTIES_PAGE_COPY.meta.description,
  openGraph: {
    title: PROPERTIES_PAGE_COPY.meta.title,
    description: PROPERTIES_PAGE_COPY.meta.description,
    url: "https://jejeolaproperties.com.ng/properties",
    type: "website",
    images: [
      {
        url: PROPERTIES[0]?.heroImage || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85",
        width: 1200,
        height: 630,
        alt: "Premium Properties in Abuja — Jeje-Ola Properties",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PROPERTIES_PAGE_COPY.meta.title,
    description: PROPERTIES_PAGE_COPY.meta.description,
    images: [PROPERTIES[0]?.heroImage || ""],
  },
  alternates: {
    canonical: "https://jejeolaproperties.com.ng/properties",
  },
};

export default function PropertiesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": PROPERTIES_PAGE_COPY.meta.title,
    "description": PROPERTIES_PAGE_COPY.meta.description,
    "url": "https://jejeolaproperties.com.ng/properties",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": PROPERTIES.length,
      "itemListElement": PROPERTIES.map((property, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "RealEstateListing",
          "name": property.title,
          "url": `https://jejeolaproperties.com.ng/properties/${property.slug}`,
          "image": property.heroImage,
          "description": property.description,
          "offers": {
            "@type": "Offer",
            "price": property.priceNumeric || "Price on Request",
            "priceCurrency": "NGN"
          }
        }
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://jejeolaproperties.com.ng"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Properties",
          "item": "https://jejeolaproperties.com.ng/properties"
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 01: Properties Restrained Editorial Hero */}
      <PropertiesHero />

      {/* 02: Discovery, Filters & Property Results Grid */}
      <PropertyGrid initialProperties={PROPERTIES} />

      {/* 03: Delivered Portfolio Transition Strip */}
      <DeliveredPortfolioStrip />

      {/* 04: Advisory Consultation CTA */}
      <PropertyCta />
    </>
  );
}
