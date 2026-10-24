import type { Metadata } from "next";
import React from "react";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfoStrip from "@/components/contact/ContactInfoStrip";
import ContactForm from "@/components/contact/ContactForm";
import OfficeMapSection from "@/components/contact/OfficeMapSection";
import { CONTACT_PAGE_DATA } from "@/lib/copy-data";

export const metadata: Metadata = {
  title: CONTACT_PAGE_DATA.meta.title,
  description: CONTACT_PAGE_DATA.meta.description,
  openGraph: {
    title: CONTACT_PAGE_DATA.meta.title,
    description: CONTACT_PAGE_DATA.meta.description,
    url: "https://jejeolaproperties.com.ng/contact",
    type: "website",
    images: [
      {
        url: CONTACT_PAGE_DATA.hero.officeImage,
        width: 1200,
        height: 630,
        alt: "Jeje-Ola Properties Guzape Smart Office Complex",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: CONTACT_PAGE_DATA.meta.title,
    description: CONTACT_PAGE_DATA.meta.description,
    images: [CONTACT_PAGE_DATA.hero.officeImage],
  },
  alternates: {
    canonical: "https://jejeolaproperties.com.ng/contact",
  },
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: CONTACT_PAGE_DATA.meta.title,
    description: CONTACT_PAGE_DATA.meta.description,
    url: "https://jejeolaproperties.com.ng/contact",
    mainEntity: {
      "@type": "RealEstateAgent",
      name: "Jeje-Ola Properties Nig. Ltd.",
      telephone: CONTACT_PAGE_DATA.office.phones.map((p) => p.value),
      email: CONTACT_PAGE_DATA.office.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: CONTACT_PAGE_DATA.office.address.line1,
        addressLocality: "Guzape",
        addressRegion: "Abuja",
        addressCountry: "NG",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "17:00",
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Asymmetric Editorial Hero with Guzape Smart Office Photography */}
      <ContactHero />

      {/* 2. Restrained 4-Column Hairline Contact Information Strip */}
      <ContactInfoStrip />

      {/* 3. Advisory Consultation & Inquiry Form */}
      <ContactForm />

      {/* 4. Guzape Smart Office Map & Directions (No generic CTA banner) */}
      <OfficeMapSection />
    </div>
  );
}
