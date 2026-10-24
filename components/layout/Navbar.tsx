"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Phone, ShieldCheck } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Invest", href: "/invest", isHighlight: true },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Suppress public marketing navbar on dedicated auth and portal shells
  if (
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/forgot-password") ||
    pathname?.startsWith("/reset-password") ||
    pathname?.startsWith("/portal") ||
    pathname?.startsWith("/staff") ||
    pathname?.startsWith("/admin") ||
    pathname === "/preview"
  ) {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-all duration-200 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8">
            {/* Brand Logo (Dark Wordmark on Light Background) */}
            <div className="flex items-center shrink-0">
              <BrandLogo variant="dark" className="h-8 sm:h-9" />
            </div>

            {/* Desktop Navigation Links — Stand Alone Without Any Container */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors relative py-1",
                      isActive
                        ? "text-[#252A2D] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#BE933C]"
                        : "text-[#2B2F36] hover:text-[#BE933C]",
                      link.isHighlight &&
                        "text-[#BE933C] font-semibold hover:text-[#252A2D]",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Items */}
            <div className="hidden sm:flex items-center gap-6 shrink-0">
              <Link
                href="/login"
                className="text-sm font-semibold text-[#252A2D] hover:text-[#BE933C] transition-colors"
              >
                Investor Portal
              </Link>
              <Button
                href="/register"
                variant="primary"
                size="sm"
                icon={<ArrowUpRight className="w-3.5 h-3.5" />}
              >
                Start Investing
              </Button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-[#252A2D] hover:bg-neutral-100 focus:outline-none"
                aria-label="Toggle Navigation"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white overflow-y-auto flex flex-col pt-24 px-6 pb-8 lg:hidden animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
            <span className="text-xs font-medium text-[#BE933C] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#BE933C]" /> RC.1317171 ·
              Compliant
            </span>
            <span className="text-xs font-medium text-neutral-500">
              Abuja, Nigeria
            </span>
          </div>

          <nav className="flex flex-col gap-1 my-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "py-3 text-lg font-heading tracking-tight border-b border-neutral-100 transition-colors flex items-center justify-between",
                  link.isHighlight
                    ? "text-[#BE933C] font-bold"
                    : "text-[#252A2D]",
                )}
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-4 h-4 text-neutral-400" />
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-3">
            <Button
              href="/register"
              variant="primary"
              size="lg"
              className="w-full justify-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Start Investing
            </Button>
            <Button
              href="/login"
              variant="outline"
              size="lg"
              className="w-full justify-center text-[#252A2D] border-neutral-300 hover:bg-neutral-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Investor Portal Login
            </Button>
            <div className="pt-3 text-center">
              <a
                href="tel:+2348066873988"
                className="text-xs font-medium text-neutral-600 hover:text-[#BE933C] inline-flex items-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-[#BE933C]" />
                +234 8066 873 988
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
