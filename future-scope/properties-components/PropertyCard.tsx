import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PropertyItem } from "@/lib/copy-data";

interface PropertyCardProps {
  property: PropertyItem;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  // Format specs based on category
  const renderSpecs = () => {
    if (property.category === "Residential") {
      const parts = [];
      if (property.specs.bedrooms) parts.push(`${property.specs.bedrooms} Beds`);
      if (property.specs.bathrooms) parts.push(`${property.specs.bathrooms} Baths`);
      if (property.specs.areaSqFt) parts.push(property.specs.areaSqFt);
      return parts.join(" · ");
    }

    if (property.category === "Commercial") {
      const parts = [];
      if (property.specs.areaSqFt) parts.push(property.specs.areaSqFt);
      if (property.specs.unitsAvailable) parts.push(`${property.specs.unitsAvailable} Suites Available`);
      return parts.join(" · ");
    }

    if (property.category === "Land") {
      const parts = [];
      if (property.specs.areaSqFt) parts.push(property.specs.areaSqFt);
      parts.push("Serviced Plots");
      return parts.join(" · ");
    }

    return null;
  };

  return (
    <article className="flex flex-col group h-full">
      <Link
        href={`/properties/${property.slug}`}
        className="flex flex-col h-full"
        aria-label={`View details for ${property.title}`}
      >
        {/* 1. Large High-Resolution Image (~65% visual weight, consistent 4:3 ratio) */}
        <div className="relative w-full aspect-[4/3] rounded-xl lg:rounded-2xl overflow-hidden bg-neutral-900 border border-black/[0.06]">
          <Image
            src={property.heroImage}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />

          {/* Single Subtle Status Badge */}
          {property.status && (
            <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#252A2D]/80 backdrop-blur-md text-white border border-white/10">
              {property.status}
            </div>
          )}
        </div>

        {/* 2. Editorial Metadata Beneath Image */}
        <div className="pt-4 sm:pt-5 flex-1 flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#BE933C] font-semibold block">
              {property.category}
            </span>

            <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#252A2D] tracking-tight group-hover:text-[#BE933C] transition-colors mt-1 leading-snug">
              {property.title}
            </h3>

            <p className="text-sm sm:text-base text-[#52525B] font-normal mt-1">
              {property.location}
            </p>

            {/* Contextual Specs adapting intelligently to type */}
            <div className="mt-3 text-xs sm:text-sm text-neutral-500 font-medium">
              {renderSpecs()}
            </div>
          </div>

          {/* 3. Price & View Link Row */}
          <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-base sm:text-lg font-heading font-bold text-[#252A2D]">
              {property.priceFormatted}
            </span>

            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#252A2D] group-hover:text-[#BE933C] transition-colors">
              View Property
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#BE933C]" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
