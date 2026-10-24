"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/ui/BrandLogo";
import { COMPANY_INFO } from "@/lib/copy-data";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Suppress public marketing footer on dedicated auth and portal shells
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
    <footer className="bg-[#202528] text-white border-t border-white/10 pt-24 sm:pt-28 lg:pt-32 pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ====================================================
            TOP BRAND & NAVIGATION GRID
            ==================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-16 sm:pb-20 border-b border-white/10">
          {/* Brand Area (~40% on desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <BrandLogo variant="light" className="h-10 sm:h-11" />

              <p className="text-base sm:text-lg font-heading font-semibold text-white tracking-tight mt-6">
                Premium Real Estate. Trusted Investment. Lasting Legacy.
              </p>

              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-normal mt-3 max-w-md">
                For over 18 years, Jeje-Ola Properties has helped families,
                executives, and diaspora investors own verified property and
                build enduring wealth in Abuja and across Nigeria.
              </p>
            </div>

            {/* Authentic Company Information — Normal Clean Typography */}
            <div className="text-xs sm:text-sm text-neutral-500 font-medium">
              RC.1317171 · 18+ Years Experience · 900+ Properties Delivered
            </div>
          </div>

          {/* Navigation Area (~60% on desktop) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10">
            {/* Column 1: Explore */}
            <div className="space-y-4">
              <span className="text-sm font-semibold uppercase tracking-wider text-white block">
                Explore
              </span>
              <ul className="space-y-3 text-sm sm:text-base text-neutral-400">
                <li>
                  <Link
                    href="/invest"
                    className="hover:text-white transition-colors"
                  >
                    Invest
                  </Link>
                </li>
                <li>
                  <Link
                    href="/insights"
                    className="hover:text-white transition-colors"
                  >
                    Insights
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Investment */}
            <div className="space-y-4">
              <span className="text-sm font-semibold uppercase tracking-wider text-white block">
                Investment
              </span>
              <ul className="space-y-3 text-sm sm:text-base text-neutral-400">
                <li>
                  <Link
                    href="/invest/giap"
                    className="hover:text-white transition-colors"
                  >
                    GIAP (70/30)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/invest/wealthstream"
                    className="hover:text-white transition-colors"
                  >
                    WealthStream (20–24%)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="space-y-4 col-span-2 sm:col-span-1">
              <span className="text-sm font-semibold uppercase tracking-wider text-white block">
                Company
              </span>
              <ul className="space-y-3 text-sm sm:text-base text-neutral-400">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="hover:text-white transition-colors"
                  >
                    Investor Portal
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ====================================================
            CLEAN CONTACT DETAILS AREA
            ==================================================== */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-white/10 text-sm sm:text-base">
          <div>
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-1">
              Office
            </span>
            <span className="text-white font-medium block">
              {COMPANY_INFO.headquarters.name}
            </span>
            <span className="text-neutral-400 text-sm block mt-0.5">
              {COMPANY_INFO.headquarters.address}
            </span>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-1">
              Phone
            </span>
            <div className="space-y-1">
              <a
                href={`tel:${COMPANY_INFO.headquarters.phone[0].replace(/\s+/g, "")}`}
                className="text-neutral-300 hover:text-white block transition-colors"
              >
                {COMPANY_INFO.headquarters.phone[0]}
              </a>
              {COMPANY_INFO.headquarters.phone[1] && (
                <a
                  href={`tel:${COMPANY_INFO.headquarters.phone[1].replace(/\s+/g, "")}`}
                  className="text-neutral-400 hover:text-white block text-sm transition-colors"
                >
                  {COMPANY_INFO.headquarters.phone[1]}
                </a>
              )}
            </div>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-1">
              Email
            </span>
            <a
              href={`mailto:${COMPANY_INFO.headquarters.email}`}
              className="text-neutral-300 hover:text-white block transition-colors"
            >
              {COMPANY_INFO.headquarters.email}
            </a>
          </div>
        </div>

        {/* ====================================================
            RESTRAINED LEGAL & COPYRIGHT ROW
            ==================================================== */}
        <div className="pt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm text-neutral-500">
          <div>
            © {currentYear} {COMPANY_INFO.name} All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href="/legal/terms"
              className="hover:text-neutral-300 transition-colors"
            >
              Terms of Use
            </Link>
            <Link
              href="/legal/privacy"
              className="hover:text-neutral-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal/cookies"
              className="hover:text-neutral-300 transition-colors"
            >
              Cookie Policy
            </Link>
            <Link
              href="/legal/refund"
              className="hover:text-neutral-300 transition-colors"
            >
              Refund &amp; Exit Policy
            </Link>
            <Link
              href="/legal/disclaimer"
              className="hover:text-neutral-300 transition-colors"
            >
              Investment Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
