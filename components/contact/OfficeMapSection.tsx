import React from "react";
import { Navigation, ExternalLink } from "lucide-react";
import { CONTACT_PAGE_DATA } from "@/lib/copy-data";

export default function OfficeMapSection() {
  const { office } = CONTACT_PAGE_DATA;

  // Standard safe embed query for Google Maps
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    office.map.embedQuery
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="location" className="py-20 sm:py-28 bg-[#252A2D] text-white border-b border-white/10 relative overflow-hidden">
      {/* Subtle warm ambient depth */}
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#BE933C]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-3">
              Location &amp; Access
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-white leading-[1.12] mb-4">
              Visit the Guzape Smart Office
            </h2>
            <p className="text-base sm:text-lg text-neutral-400 font-normal leading-relaxed">
              Located in the diplomatic and elevated corridor of Guzape, Abuja. Visitors and clients are received for private consultations and boardroom governance during official business hours.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={office.map.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center font-medium transition-all duration-200 tracking-wide rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BE933C]/50 active:scale-[0.98] text-sm px-5 py-2.5 gap-2 bg-transparent text-[#BE933C] border border-[#BE933C]/40 hover:border-[#BE933C] hover:bg-[#BE933C]/5 shrink-0 group"
            >
              <span>Get Driving Directions</span>
              <ExternalLink className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[540px] rounded-sm overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl">
          <iframe
            title="Jeje-Ola Properties Guzape Office Location"
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full grayscale-[40%] contrast-125 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
          />

          {/* Floating Address Overlay Card */}
          <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md bg-[#252A2D]/95 backdrop-blur-md border border-white/15 p-5 rounded-sm shadow-xl text-left pointer-events-auto">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-sm bg-[#BE933C]/10 border border-[#BE933C]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#BE933C]">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-1">
                  Abuja Headquarters
                </span>
                <p className="text-sm font-bold text-white mb-1">
                  {office.address.line1}
                </p>
                <p className="text-xs text-neutral-400">
                  {office.address.city}, {office.address.country} · {office.hours}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
