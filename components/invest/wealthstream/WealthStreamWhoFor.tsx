import React from "react";
import { WEALTHSTREAM_PAGE_DATA } from "@/lib/copy-data";

export default function WealthStreamWhoFor() {
  const { kicker, heading, subheading, profiles } = WEALTHSTREAM_PAGE_DATA.whoIsItFor;

  return (
    <section className="bg-[#FDFDFD] text-[#252A2D] py-28 sm:py-36 lg:py-44 border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Intro */}
        <div className="max-w-3xl mb-16 sm:mb-24">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-4">
            {kicker}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-[#252A2D] leading-[1.12]">
            {heading}
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#52525B] leading-relaxed font-normal">
            {subheading}
          </p>
        </div>

        {/* 3-Column Editorial Grid (Cardless) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 pt-12 border-t border-neutral-200/80">
          {profiles.map((profile, idx) => (
            <div key={idx} className="flex flex-col justify-between py-2">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#BE933C] block mb-3">
                  Profile 0{idx + 1}
                </span>

                <h3 className="text-xl lg:text-2xl font-heading font-extrabold text-[#252A2D] tracking-tight">
                  {profile.title}
                </h3>

                <p className="text-base text-[#52525B] leading-relaxed mt-3 font-normal">
                  {profile.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-100 text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                Strategic Fit
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
