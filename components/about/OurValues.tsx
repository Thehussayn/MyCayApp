import React from "react";
import { ABOUT_COPY } from "@/lib/copy-data";

export default function OurValues() {
  const { values } = ABOUT_COPY;

  return (
    <section className="py-24 lg:py-32 bg-[#FDFDFD] text-[#252A2D] border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20 lg:mb-24">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-3">
            What We Stand For
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-[#252A2D] leading-[1.12]">
            Our Core Values
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#52525B] leading-relaxed font-normal">
            The principles that govern every transaction, title search, and advisory relationship we build.
          </p>
        </div>

        {/* Editorial Value Sequence — Unboxed, Typography-Led */}
        <div className="border-t border-neutral-200/80">
          {values.map((val) => (
            <div
              key={val.number}
              className="py-10 sm:py-14 border-b border-neutral-200/80 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 md:gap-12 items-baseline"
            >
              {/* Number Index */}
              <div className="md:col-span-2">
                <span className="text-xl sm:text-2xl font-heading font-bold text-[#BE933C] tracking-widest">
                  {val.number}
                </span>
              </div>

              {/* Principle Heading */}
              <div className="md:col-span-4">
                <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#252A2D] tracking-tight leading-snug">
                  {val.title}
                </h3>
              </div>

              {/* Supporting Approved Copy */}
              <div className="md:col-span-6">
                <p className="text-base sm:text-lg text-[#52525B] leading-relaxed font-normal">
                  {val.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
