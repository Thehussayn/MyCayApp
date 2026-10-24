import type { Metadata } from "next";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Home,
  Building2,
  KeyRound,
  Compass,
  Trees,
  Cpu,
  CheckCircle2
} from "lucide-react";
import Button from "@/components/ui/Button";
import { SERVICES_PAGE_DATA, ServiceItem } from "@/lib/copy-data";

interface ServiceDetailPageProps {
  params: {
    slug: string;
  };
}

const ICON_MAP = {
  Home,
  Building2,
  KeyRound,
  Compass,
  Trees,
  Cpu
};

export function generateStaticParams() {
  return SERVICES_PAGE_DATA.services.map((service) => ({
    slug: service.slug,
  }));
}

export function generateMetadata({ params }: ServiceDetailPageProps): Metadata {
  const service = SERVICES_PAGE_DATA.services.find((s) => s.slug === params.slug);

  if (!service) {
    return {
      title: "Service Not Found — Jeje-Ola Properties",
    };
  }

  return {
    title: `${service.name} — Jeje-Ola Properties`,
    description: service.description,
    openGraph: {
      title: `${service.name} — Jeje-Ola Properties`,
      description: service.description,
      images: [
        {
          url: service.signatureImage,
          width: 1200,
          height: 630,
          alt: service.name,
        },
      ],
    },
    alternates: {
      canonical: `https://jejeolaproperties.com.ng/services/${service.slug}`,
    },
  };
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const service = SERVICES_PAGE_DATA.services.find((s) => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  const IconComponent = ICON_MAP[service.iconName] || Home;

  return (
    <div className="bg-[#FDFDFD] text-[#252A2D] pt-28 sm:pt-36 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500 mb-8 sm:mb-12">
          <Link href="/" className="hover:text-[#252A2D] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/services" className="hover:text-[#252A2D] transition-colors">
            Services
          </Link>
          <span>/</span>
          <span className="text-[#252A2D] font-semibold">{service.name}</span>
        </div>

        {/* Back Link */}
        <div className="mb-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#252A2D] hover:text-[#BE933C] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Return to All Services</span>
          </Link>
        </div>

        {/* Editorial Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#BE933C]">
              Service {service.number}
            </span>
            <span className="text-neutral-300">·</span>
            <div className="w-7 h-7 rounded-full bg-[#BE933C]/10 text-[#BE933C] flex items-center justify-center">
              <IconComponent className="w-3.5 h-3.5" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-[#252A2D] leading-[1.08] mb-6">
            {service.name}
          </h1>

          <p className="text-xl sm:text-2xl text-[#52525B] font-normal leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Photography Showcase */}
        <div className="mb-16 sm:mb-20">
          {service.secondaryImage ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200/80 shadow-sm">
                <Image
                  src={service.signatureImage}
                  alt={`${service.name} - Architectural Exterior`}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200/80 shadow-sm">
                <Image
                  src={service.secondaryImage}
                  alt={`${service.name} - Architectural Interior`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          ) : (
            <div className="relative w-full aspect-[16/9] sm:h-[500px] lg:h-[580px] rounded-2xl lg:rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200/80 shadow-sm">
              <Image
                src={service.signatureImage}
                alt={service.imageAlt}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
          )}
        </div>

        {/* Advisory Consultation Notice & Action Block */}
        <div className="p-8 sm:p-12 lg:p-16 rounded-2xl bg-[#F8F8F6] border border-neutral-200/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-8">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-3">
                Tailored Engagements
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#252A2D] mb-4">
                Consult With Our Specialists on {service.name}
              </h2>
              <p className="text-base sm:text-lg text-[#52525B] leading-relaxed max-w-2xl mb-6">
                Full architectural blueprints, site assessments, and operational frameworks for this discipline are reviewed during private advisory sessions at our Guzape Smart Office Complex or via secure teleconference.
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-600 font-medium">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#BE933C]" />
                  Direct Founder &amp; Advisory Access
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#BE933C]" />
                  Transparent Feasibility Analysis
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#BE933C]" />
                  Guaranteed Institutional Standards
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-4">
              <Button
                href="/contact"
                variant="primary"
                size="lg"
                icon={<ArrowUpRight className="w-4 h-4" />}
                className="w-full"
              >
                Book Free Consultation
              </Button>

              <div className="text-center pt-2">
                <span className="text-xs text-neutral-400 block font-normal">
                  Inquiries &amp; Site Visits
                </span>
                <a
                  href="tel:+2348066873988"
                  className="text-sm font-semibold text-[#252A2D] hover:text-[#BE933C] transition-colors mt-0.5 inline-block"
                >
                  +234 8066 873 988
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
