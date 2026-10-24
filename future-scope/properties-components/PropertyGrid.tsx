"use client";

import React, { useState, useMemo } from "react";
import { PropertyItem } from "@/lib/copy-data";
import PropertyFilters, { FilterState } from "./PropertyFilters";
import PropertyCard from "./PropertyCard";
import { RotateCcw } from "lucide-react";

interface PropertyGridProps {
  initialProperties: PropertyItem[];
}

const DEFAULT_FILTERS: FilterState = {
  category: "all",
  district: "all",
  status: "all",
  sortBy: "recommended",
};

export default function PropertyGrid({ initialProperties }: PropertyGridProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Filter and Sort Logic
  const filteredProperties = useMemo(() => {
    let result = [...initialProperties];

    // Filter by Category
    if (filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }

    // Filter by District / Location
    if (filters.district !== "all") {
      result = result.filter((p) => p.district === filters.district);
    }

    // Filter by Status
    if (filters.status !== "all") {
      result = result.filter((p) => p.status === filters.status);
    }

    // Sort
    if (filters.sortBy === "price-asc") {
      result.sort((a, b) => (a.priceNumeric ?? 0) - (b.priceNumeric ?? 0));
    } else if (filters.sortBy === "price-desc") {
      result.sort((a, b) => (b.priceNumeric ?? 0) - (a.priceNumeric ?? 0));
    }

    return result;
  }, [initialProperties, filters]);

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <div className="bg-[#FDFDFD] text-[#252A2D]">
      {/* 1. Filter and Discovery Controls */}
      <PropertyFilters
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={handleClearFilters}
        totalCount={filteredProperties.length}
      />

      {/* 2. Property Results Grid */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 items-stretch">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="py-20 text-center max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-[#F8F8F6] border border-neutral-200 flex items-center justify-center mx-auto mb-4 text-[#BE933C]">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#252A2D] tracking-tight">
                No properties match these filters.
              </h3>
              <p className="mt-2 text-sm sm:text-base text-[#52525B] leading-relaxed">
                Adjust or clear your filter criteria to explore other available developments in our portfolio.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#252A2D] text-white hover:bg-neutral-800 text-sm font-semibold transition-colors"
                >
                  <RotateCcw className="w-4 h-4 text-[#BE933C]" />
                  <span>Clear All Filters</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
