import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Home,
  Building2,
  KeyRound,
  Compass,
  Trees,
  Cpu,
  ArrowRight
} from "lucide-react";
import { ServiceItem } from "@/lib/copy-data";

interface ServiceSectionProps {
  service: ServiceItem;
  index: number;
}

const ICON_MAP = {
  Home,
  Building2,
  KeyRound,
  Compass,
  Trees,
  Cpu
};

export default function ServiceSection({ service, index }: ServiceSectionProps) {
  const IconComponent = ICON_MAP[service.iconName] || Home;
  const isDark = service.number === "06";
  const isContentLeft = index % 2 === 1; // Services 02, 04, 06 have content on the left
  const hasSecondaryImage = !!service.secondaryImage;

  // Background styling according to approved alternating cadence
  let bgClass = "bg-[#FDFDFD] text-[#252A2D] border-b border-neutral-200/70";
  if (isDark) {
    bgClass = "bg-[#252A2D] text-white border-b border-white/10";
  } else if (index % 2 === 1) {
    bgClass = "bg-[#F8F8F6] text-[#252A2D] border-b border-neutral-200/70";
  }

  return (
    <section id={service.slug} className={`py-24 sm:py-32 lg:py-36 relative overflow-hidden ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* Content Column */}
          <div
            className={`lg:col-span-6 flex flex-col justify-center ${
              isContentLeft ? "lg:order-1" : "lg:order-2 lg:pl-6 xl:pl-10"
            }`}
          >
            {/* Header: Number & Line Icon */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl sm:text-4xl font-heading font-black text-[#BE933C] tracking-tight">
                {service.number}
              </span>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDark ? "bg-white/10 text-[#BE933C]" : "bg-[#BE933C]/10 text-[#BE933C]"
                }`}
              >
                <IconComponent className="w-5 h-5" />
              </div>
            </div>

            {/* Approved Service Name */}
            <h3
              className={`text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight leading-[1.12] mb-6 ${
                isDark ? "text-white" : "text-[#252A2D]"
              }`}
            >
              {service.name}
            </h3>

            {/* Approved Service Description */}
            <p
              className={`text-lg sm:text-xl font-normal leading-relaxed mb-8 max-w-xl ${
                isDark ? "text-neutral-300" : "text-[#52525B]"
              }`}
            >
              {service.description}
            </p>

            {/* Action Link: Explore Service → */}
            <div>
              <Link
                href={`/services/${service.slug}`}
                className={`inline-flex items-center gap-3 text-sm sm:text-base font-semibold group transition-colors ${
                  isDark
                    ? "text-[#BE933C] hover:text-white"
                    : "text-[#252A2D] hover:text-[#BE933C]"
                }`}
              >
                <span>Explore Service</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5 text-[#BE933C]" />
              </Link>
            </div>
          </div>

          {/* Visual Column */}
          <div
            className={`lg:col-span-6 ${
              isContentLeft ? "lg:order-2" : "lg:order-1"
            }`}
          >
            {hasSecondaryImage ? (
              /* Service 04 Juxtaposition: Exterior Facade + Refined Interior */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 border border-black/[0.06] shadow-sm group">
                  <Image
                    src={service.signatureImage}
                    alt={`${service.name} - Exterior Architecture`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[11px] uppercase tracking-wider text-white/90 font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded">
                      Exterior Architecture
                    </span>
                  </div>
                </div>

                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 border border-black/[0.06] shadow-sm group sm:translate-y-6">
                  <Image
                    src={service.secondaryImage!}
                    alt={`${service.name} - Bespoke Interior Design`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[11px] uppercase tracking-wider text-white/90 font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded">
                      Interior Architecture
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Single Expansive Architectural Visual */
              <div className="relative w-full aspect-[4/3] sm:h-[480px] lg:h-[520px] rounded-2xl lg:rounded-3xl overflow-hidden bg-neutral-900 border border-black/[0.06] shadow-sm group">
                <Image
                  src={service.signatureImage}
                  alt={service.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
