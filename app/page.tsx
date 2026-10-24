import React from "react";
import HeroSection from "@/components/home/HeroSection";
import TrustRibbon from "@/components/home/TrustRibbon";
import WhoWeServe from "@/components/home/WhoWeServe";
import InvestmentPreview from "@/components/home/InvestmentPreview";
import WhyJejeOla from "@/components/home/WhyJejeOla";
import TestimonialStrip from "@/components/home/TestimonialStrip";
import InsightsTeaser from "@/components/home/InsightsTeaser";
import FinalCta from "@/components/home/FinalCta";

export default function HomePage() {
  return (
    <>
      {/* 01: Hero Section */}
      <HeroSection />

      {/* 02: Institutional Trust & Verification Ribbon */}
      <TrustRibbon />

      {/* 03: Who We Serve — 4 Audience Profiles */}
      <WhoWeServe />

      {/* 04: Signature Investment Plans (GIAP 70/30 & WealthStream Calculator) */}
      <InvestmentPreview />

      {/* 05: The Jeje-Ola Advantage — 6 Institutional Pillars */}
      <WhyJejeOla />

      {/* 06: Featured Properties — Prime Abuja Showcase */}

      {/* 07: Institutional Endorsements & Track Record */}
      <TestimonialStrip />

      {/* 08: Intelligence & Research Teaser */}
      <InsightsTeaser />

      {/* 09: Final Consultation & Direct Action CTA */}
      <FinalCta />
    </>
  );
}
