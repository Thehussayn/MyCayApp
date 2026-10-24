import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FEATURED_PROPERTIES } from "@/lib/copy-data";

export default function FeaturedProperties() {
  const heroProperty = FEATURED_PROPERTIES[0];
  const supportingProperties = FEATURED_PROPERTIES.slice(1, 3);

  return (
    <section className="py-24 lg:py-32 bg-[#FDFDFD] text-[#252A2D] border-t border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ====================================================
            SECTION HEADER — Confident & Integrated Navigation
            ==================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16 pb-6 border-b border-neutral-200/80">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-[#252A2D] leading-[1.12]">
              Explore Featured Properties
            </h2>
          </div>
          
          <Link
            href="/invest"
            className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#252A2D] hover:text-[#BE933C] transition-colors group shrink-0 pb-1"
          >
            <span>View Investment Plans</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#BE933C]" />
          </Link>
        </div>

        {/* ====================================================
            ASYMMETRIC ARCHITECTURAL SHOWCASE
            Hero Property (Left ~58%) + Two Supporting Properties (Right ~42%)
            ==================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-start">
          
          {/* ====================================================
              DOMINANT HERO PROPERTY (Property 01)
              ==================================================== */}
          {heroProperty && (
            <article className="lg:col-span-7 flex flex-col group">
              <Link href={`/properties/${heroProperty.slug}`} className="block">
                
                {/* Large Dominant Image */}
                <div className="relative w-full h-[360px] sm:h-[460px] lg:h-[540px] xl:h-[580px] rounded-xl lg:rounded-2xl overflow-hidden bg-neutral-900 border border-black/[0.06]">
                  <Image
                    src={heroProperty.heroImage}
                    alt={heroProperty.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    priority={false}
                  />
                </div>

                {/* Editorial Metadata Below Image */}
                <div className="pt-5 sm:pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#252A2D] tracking-tight group-hover:text-[#BE933C] transition-colors leading-snug">
                      {heroProperty.title}
                    </h3>
                  </div>

                  <p className="text-sm sm:text-base text-[#52525B] font-normal mt-1">
                    {heroProperty.location}
                  </p>

                  <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs sm:text-sm text-neutral-500">
                    <span className="font-medium text-[#252A2D]">
                      {heroProperty.category}
                      {heroProperty.specs.bedrooms ? ` · ${heroProperty.specs.bedrooms} Bedrooms` : ""}
                    </span>

                    <span className="inline-flex items-center gap-1.5 font-semibold text-[#252A2D] group-hover:text-[#BE933C] transition-colors">
                      View Property
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#BE933C]" />
                    </span>
                  </div>

                </div>

              </Link>
            </article>
          )}

          {/* ====================================================
              SUPPORTING PROPERTIES STACK (Properties 02 & 03)
              ==================================================== */}
          <div className="lg:col-span-5 flex flex-col gap-10 lg:gap-12">
            {supportingProperties.map((prop) => (
              <article key={prop.id} className="flex flex-col group">
                <Link href={`/properties/${prop.slug}`} className="block">
                  
                  {/* Supporting Image */}
                  <div className="relative w-full h-[220px] sm:h-[280px] lg:h-[230px] xl:h-[250px] rounded-xl lg:rounded-2xl overflow-hidden bg-neutral-900 border border-black/[0.06]">
                    <Image
                      src={prop.heroImage}
                      alt={prop.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>

                  {/* Editorial Metadata Below Image */}
                  <div className="pt-4">
                    <h4 className="text-lg sm:text-xl font-heading font-extrabold text-[#252A2D] tracking-tight group-hover:text-[#BE933C] transition-colors leading-snug">
                      {prop.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-[#52525B] font-normal mt-1">
                      {prop.location}
                    </p>

                    <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                      <span className="font-medium text-[#252A2D]">
                        {prop.category}
                        {prop.category === "Commercial" ? " · Commercial Pavilion" : ""}
                        {prop.category === "Land" ? " · Serviced Plots" : ""}
                      </span>

                      <span className="inline-flex items-center gap-1.5 font-semibold text-[#252A2D] group-hover:text-[#BE933C] transition-colors">
                        View Property
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#BE933C]" />
                      </span>
                    </div>

                  </div>

                </Link>
              </article>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
