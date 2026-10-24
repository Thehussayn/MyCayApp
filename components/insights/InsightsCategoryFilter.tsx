"use client";

import React from "react";
import { INSIGHTS_PAGE_DATA } from "@/lib/copy-data";

interface InsightsCategoryFilterProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function InsightsCategoryFilter({
  activeCategory,
  onSelectCategory,
}: InsightsCategoryFilterProps) {
  const categories = INSIGHTS_PAGE_DATA.categories;

  return (
    <div className="bg-[#FDFDFD] border-b border-neutral-200/80 sticky top-16 sm:top-20 z-20 backdrop-blur-md bg-[#FDFDFD]/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar py-4"
          aria-label="Filter insights by category"
        >
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onSelectCategory(category)}
                className={`text-xs sm:text-sm font-semibold uppercase tracking-wider whitespace-nowrap transition-colors relative py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BE933C] ${
                  isActive
                    ? "text-[#252A2D] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#BE933C]"
                    : "text-neutral-500 hover:text-[#252A2D]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
