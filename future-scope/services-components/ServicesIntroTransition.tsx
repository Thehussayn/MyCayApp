import React from "react";

export default function ServicesIntroTransition() {
  return (
    <div id="services-list" className="bg-[#FDFDFD] pt-16 sm:pt-20 pb-8 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-200/80">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#BE933C] block mb-2">
              Practice Areas
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-[#252A2D] tracking-tight">
              Six Integrated Disciplines
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#52525B] max-w-md font-normal">
            A cohesive suite of architectural, development, and asset management services tailored for discerning private and institutional clients.
          </p>
        </div>
      </div>
    </div>
  );
}
