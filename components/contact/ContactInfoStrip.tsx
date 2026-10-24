import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { CONTACT_PAGE_DATA } from "@/lib/copy-data";

export default function ContactInfoStrip() {
  const { office } = CONTACT_PAGE_DATA;

  return (
    <section className="bg-[#252A2D] text-white py-16 sm:py-20 border-b border-white/10 relative overflow-hidden">
      {/* Subtle warm ambient depth */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-[#BE933C]/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          {/* 1. Office Location */}
          <div className="lg:pr-8 pt-6 lg:pt-0">
            <div className="w-9 h-9 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-[#BE933C] mb-4">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-2">
              Primary Office
            </span>
            <h2 className="text-base font-bold text-white mb-2">
              {office.title}
            </h2>
            <address className="not-italic text-sm text-neutral-300 leading-relaxed font-normal">
              {office.address.line1}
              <br />
              {office.address.city}, {office.address.country}
            </address>
          </div>

          {/* 2. Direct Telephone Lines */}
          <div className="lg:px-8 pt-6 lg:pt-0">
            <div className="w-9 h-9 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-[#BE933C] mb-4">
              <Phone className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-2">
              Telephone
            </span>
            <h2 className="text-base font-bold text-white mb-2">
              Direct Advisory Lines
            </h2>
            <div className="flex flex-col space-y-1.5 text-sm">
              {office.phones.map((phone) => (
                <a
                  key={phone.value}
                  href={`tel:${phone.value}`}
                  className="text-neutral-300 hover:text-[#BE933C] transition-colors font-medium"
                >
                  {phone.display}
                </a>
              ))}
            </div>
          </div>

          {/* 3. Electronic Mail */}
          <div className="lg:px-8 pt-6 lg:pt-0">
            <div className="w-9 h-9 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-[#BE933C] mb-4">
              <Mail className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-2">
              Email
            </span>
            <h2 className="text-base font-bold text-white mb-2">
              Client Inquiries
            </h2>
            <a
              href={`mailto:${office.email}`}
              className="text-sm text-neutral-300 hover:text-[#BE933C] transition-colors break-all font-medium inline-block"
            >
              {office.email}
            </a>
          </div>

          {/* 4. Advisory Hours */}
          <div className="lg:pl-8 pt-6 lg:pt-0">
            <div className="w-9 h-9 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-[#BE933C] mb-4">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-2">
              Operating Hours
            </span>
            <h2 className="text-base font-bold text-white mb-2">
              Advisory &amp; Boardroom
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed font-normal">
              {office.hours}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
