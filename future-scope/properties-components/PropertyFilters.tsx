"use client";

import React, { useState } from "react";
import { SlidersHorizontal, X, ChevronDown, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterState {
  category: string;
  district: string;
  status: string;
  sortBy: string;
}

interface PropertyFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  totalCount: number;
}

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "Residential", label: "Residential" },
  { value: "Commercial", label: "Commercial" },
  { value: "Land", label: "Land & Plots" },
];

const DISTRICT_OPTIONS = [
  { value: "all", label: "All Locations" },
  { value: "Guzape", label: "Guzape" },
  { value: "Maitama", label: "Maitama" },
  { value: "Katampe", label: "Katampe" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "Available", label: "Available" },
  { value: "Off-Plan", label: "Off-Plan" },
  { value: "Delivered", label: "Delivered" },
];

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function PropertyFilters({
  filters,
  onFilterChange,
  onClearFilters,
  totalCount,
}: PropertyFiltersProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Calculate number of active filters (excluding default "all" and "recommended")
  const activeFilterCount = [
    filters.category !== "all",
    filters.district !== "all",
    filters.status !== "all",
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  const handleSelectChange = (key: keyof FilterState, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-[#FDFDFD] border-b border-neutral-200/80 py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Discovery Bar: Results Count + Desktop Filters + Sort */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Result Counter */}
          <div className="flex items-center gap-3">
            <span className="text-sm sm:text-base font-heading font-bold text-[#252A2D]">
              {totalCount} {totalCount === 1 ? "Property" : "Properties"} Available
            </span>
            {hasActiveFilters && (
              <span className="text-xs bg-[#BE933C]/10 text-[#BE933C] px-2.5 py-0.5 rounded-full font-medium">
                {activeFilterCount} Active
              </span>
            )}
          </div>

          {/* Desktop Filter Controls (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Category Select */}
            <div className="relative">
              <select
                value={filters.category}
                onChange={(e) => handleSelectChange("category", e.target.value)}
                className={cn(
                  "appearance-none bg-white border rounded-lg px-3.5 py-2 pr-9 text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-[#BE933C]",
                  filters.category !== "all"
                    ? "border-[#BE933C] text-[#252A2D] bg-[#BE933C]/5 font-semibold"
                    : "border-neutral-200 text-[#2B2F36] hover:border-neutral-300"
                )}
                aria-label="Filter by Property Category"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Location Select */}
            <div className="relative">
              <select
                value={filters.district}
                onChange={(e) => handleSelectChange("district", e.target.value)}
                className={cn(
                  "appearance-none bg-white border rounded-lg px-3.5 py-2 pr-9 text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-[#BE933C]",
                  filters.district !== "all"
                    ? "border-[#BE933C] text-[#252A2D] bg-[#BE933C]/5 font-semibold"
                    : "border-neutral-200 text-[#2B2F36] hover:border-neutral-300"
                )}
                aria-label="Filter by Location"
              >
                {DISTRICT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Status Select */}
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => handleSelectChange("status", e.target.value)}
                className={cn(
                  "appearance-none bg-white border rounded-lg px-3.5 py-2 pr-9 text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-[#BE933C]",
                  filters.status !== "all"
                    ? "border-[#BE933C] text-[#252A2D] bg-[#BE933C]/5 font-semibold"
                    : "border-neutral-200 text-[#2B2F36] hover:border-neutral-300"
                )}
                aria-label="Filter by Status"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Clear Filters Button (Visible only when filters active) */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-[#252A2D] px-2.5 py-2 transition-colors"
                aria-label="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}

            {/* Sort Dropdown */}
            <div className="relative ml-2 pl-3 border-l border-neutral-200">
              <select
                value={filters.sortBy}
                onChange={(e) => handleSelectChange("sortBy", e.target.value)}
                className="appearance-none bg-white border border-neutral-200 rounded-lg px-3.5 py-2 pr-9 text-xs sm:text-sm font-medium text-[#2B2F36] hover:border-neutral-300 transition-colors focus:outline-none focus:ring-1 focus:ring-[#BE933C]"
                aria-label="Sort properties"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

          </div>

          {/* Mobile Filter & Sort Triggers */}
          <div className="flex items-center justify-between gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className={cn(
                "flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors",
                hasActiveFilters
                  ? "border-[#BE933C] text-[#BE933C] bg-[#BE933C]/5"
                  : "border-neutral-200 text-[#252A2D] bg-white hover:bg-neutral-50"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters {hasActiveFilters && `(${activeFilterCount})`}</span>
            </button>

            <div className="relative flex-1">
              <select
                value={filters.sortBy}
                onChange={(e) => handleSelectChange("sortBy", e.target.value)}
                className="w-full appearance-none bg-white border border-neutral-200 rounded-lg px-3.5 py-2.5 pr-8 text-sm font-medium text-[#2B2F36] focus:outline-none"
                aria-label="Sort properties"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Active Filter Pills Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-neutral-100">
            <span className="text-xs text-neutral-400 font-medium">Applied:</span>
            
            {filters.category !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F8F8F6] border border-neutral-200 text-[#252A2D]">
                Category: {filters.category}
                <button
                  type="button"
                  onClick={() => handleSelectChange("category", "all")}
                  className="hover:text-red-600"
                  aria-label="Remove category filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.district !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F8F8F6] border border-neutral-200 text-[#252A2D]">
                Location: {filters.district}
                <button
                  type="button"
                  onClick={() => handleSelectChange("district", "all")}
                  className="hover:text-red-600"
                  aria-label="Remove location filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.status !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F8F8F6] border border-neutral-200 text-[#252A2D]">
                Status: {filters.status}
                <button
                  type="button"
                  onClick={() => handleSelectChange("status", "all")}
                  className="hover:text-red-600"
                  aria-label="Remove status filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs text-[#BE933C] hover:underline font-semibold ml-2"
            >
              Clear All
            </button>
          </div>
        )}

      </div>

      {/* Mobile Accessible Filter Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex flex-col justify-end">
          <div className="bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto p-6 space-y-6 animate-in slide-in-from-bottom duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <span className="text-lg font-heading font-extrabold text-[#252A2D]">
                Filter Properties
              </span>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-md text-neutral-500 hover:bg-neutral-100"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs uppercase tracking-wider text-[#BE933C] font-semibold block mb-2">
                Property Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectChange("category", opt.value)}
                    className={cn(
                      "py-2.5 px-3 rounded-lg border text-xs font-medium text-left transition-colors",
                      filters.category === opt.value
                        ? "border-[#BE933C] bg-[#BE933C]/10 text-[#252A2D] font-bold"
                        : "border-neutral-200 text-[#52525B]"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-xs uppercase tracking-wider text-[#BE933C] font-semibold block mb-2">
                Location
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DISTRICT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectChange("district", opt.value)}
                    className={cn(
                      "py-2.5 px-3 rounded-lg border text-xs font-medium text-left transition-colors",
                      filters.district === opt.value
                        ? "border-[#BE933C] bg-[#BE933C]/10 text-[#252A2D] font-bold"
                        : "border-neutral-200 text-[#52525B]"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="text-xs uppercase tracking-wider text-[#BE933C] font-semibold block mb-2">
                Availability Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectChange("status", opt.value)}
                    className={cn(
                      "py-2.5 px-3 rounded-lg border text-xs font-medium text-left transition-colors",
                      filters.status === opt.value
                        ? "border-[#BE933C] bg-[#BE933C]/10 text-[#252A2D] font-bold"
                        : "border-neutral-200 text-[#52525B]"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="pt-4 border-t border-neutral-200 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onClearFilters();
                  setMobileDrawerOpen(false);
                }}
                className="flex-1 py-3 text-sm font-semibold border border-neutral-300 rounded-full text-[#252A2D] hover:bg-neutral-50 transition-colors text-center"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1 py-3 text-sm font-semibold bg-[#BE933C] hover:bg-[#A9802E] text-[#252A2D] rounded-full transition-colors text-center"
              >
                View {totalCount} Properties
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
