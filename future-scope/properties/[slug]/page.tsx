import type { Metadata } from "next";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, MapPin, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import { PROPERTIES, PropertyItem } from "@/lib/copy-data";

interface PropertyDetailPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return PROPERTIES.map((property) => ({
    slug: property.slug,
  }));
}

export function generateMetadata({ params }: PropertyDetailPageProps): Metadata {
  const property = PROPERTIES.find((p) => p.slug === params.slug);

  if (!property) {
    return {
      title: "Property Not Found | Jeje-Ola Properties",
    };
  }

  return {
    title: `${property.title} | Jeje-Ola Properties`,
    description: property.description,
    openGraph: {
      title: `${property.title} | Jeje-Ola Properties`,
      description: property.description,
      images: [
        {
          url: property.heroImage,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },
  };
}

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const property = PROPERTIES.find((p) => p.slug === params.slug);

  if (!property) {
    notFound();
  }

  return (
    <div className="bg-[#FDFDFD] text-[#252A2D] pt-28 sm:pt-36 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb / Back Link */}
        <div className="mb-8">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-[#BE933C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Properties</span>
          </Link>
        </div>

        {/* Property Header Spread */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-neutral-200/80 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs uppercase tracking-wider text-[#BE933C] font-semibold bg-[#BE933C]/10 px-2.5 py-1 rounded-md">
                {property.category}
              </span>
              <span className="text-xs font-medium text-neutral-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#BE933C]" />
                {property.location}
              </span>
              {property.status && (
                <span className="text-xs font-medium text-neutral-600 bg-[#F8F8F6] border border-neutral-200 px-2 py-0.5 rounded-full">
                  {property.status}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-[#252A2D] leading-[1.12]">
              {property.title}
            </h1>
          </div>

          <div className="flex flex-col sm:items-end shrink-0">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-1">
              Valuation / Price
            </span>
            <span className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-[#252A2D]">
              {property.priceFormatted}
            </span>
          </div>
        </div>

        {/* Main Architectural Hero Visual */}
        <div className="relative w-full h-[400px] sm:h-[520px] lg:h-[640px] rounded-2xl lg:rounded-3xl overflow-hidden bg-neutral-900 border border-black/[0.06] shadow-sm mb-12">
          <Image
            src={property.heroImage}
            alt={property.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover object-center"
          />
        </div>

        {/* Supporting Gallery Grid if available */}
        {property.gallery && property.gallery.length > 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {property.gallery.slice(1).map((imgUrl, idx) => (
              <div
                key={idx}
                className="relative h-64 rounded-xl overflow-hidden bg-neutral-900 border border-black/[0.06]"
              >
                <Image
                  src={imgUrl}
                  alt={`${property.title} architectural detail ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center"
                />
              </div>
            ))}
          </div>
        )}

        {/* Property Details Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Description & Features (~65% on desktop) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Overview */}
            <div>
              <h2 className="text-2xl font-heading font-extrabold text-[#252A2D] mb-4">
                Property Overview
              </h2>
              <p className="text-base sm:text-lg text-[#52525B] leading-relaxed font-normal">
                {property.description}
              </p>
            </div>

            {/* Key Specifications & Features */}
            {property.features && property.features.length > 0 && (
              <div>
                <h3 className="text-xl font-heading font-extrabold text-[#252A2D] mb-4">
                  Key Specifications &amp; Finishes
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {property.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm sm:text-base text-[#52525B]"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#BE933C]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#BE933C]" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Investment Angle */}
            {property.investmentHighlight && (
              <div className="bg-[#F8F8F6] border border-[#E7E7E2] rounded-2xl p-6">
                <span className="text-xs uppercase tracking-wider text-[#BE933C] font-semibold block mb-2">
                  Investment Perspective
                </span>
                <p className="text-base text-[#252A2D] font-medium leading-relaxed">
                  {property.investmentHighlight}
                </p>
              </div>
            )}

          </div>

          {/* Right Column: Acquisition / Inspection Action Card (~35% on desktop) */}
          <div className="lg:col-span-4 bg-[#F8F8F6] border border-[#E7E7E2] rounded-2xl p-6 sm:p-8 sticky top-28">
            <h3 className="text-xl font-heading font-extrabold text-[#252A2D] mb-2">
              Interested in This Asset?
            </h3>
            <p className="text-sm text-[#52525B] leading-relaxed mb-6">
              Schedule a confidential inspection with our advisory desk at the Guzape Smart Office Complex or request certified documentation.
            </p>

            <div className="space-y-3">
              <Button
                href="/contact"
                variant="primary"
                size="lg"
                className="w-full justify-center"
                icon={<ArrowUpRight className="w-4 h-4" />}
              >
                Request Site Visit
              </Button>
              <Button
                href="tel:+2348066873988"
                variant="outline"
                size="lg"
                className="w-full justify-center text-[#252A2D] border-neutral-300 hover:bg-white"
              >
                Call Advisory Desk
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-200/80 text-xs text-neutral-500 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#BE933C]" />
                <span>Verified Legal Title Registered</span>
              </div>
              <div>RC.1317171 · Jeje-Ola Properties Nig. Ltd.</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
