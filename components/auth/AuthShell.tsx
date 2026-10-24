import React from "react";
import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";
import { ArrowLeft } from "lucide-react";
interface AuthShellProps {
  children: React.ReactNode;
  kicker?: string;
  title: string;
  subtitle?: string;
}
export default function AuthShell({
  children,
  kicker = "MyCayApp",
  title,
  subtitle,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-white grid lg:grid-cols-12">
      <aside className="hidden lg:flex lg:col-span-5 bg-brand-charcoal text-white p-12 xl:p-16 flex-col justify-between">
        <BrandLogo variant="light" className="h-9" />
        <div className="max-w-md space-y-6">
          <p className="text-brand-gold text-sm">MyCayApp by Jeje-Ola</p>
          <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
            Your investments.
            <br />
            One place.
          </h2>
          <p className="text-neutral-300 text-base leading-relaxed">
            Manage your GIAP and WealthStream investments, documents, and
            payouts.
          </p>
        </div>
        <p className="text-sm text-neutral-400">
          Jeje-Ola Properties Nig. Ltd.
          <br />
          Guzape, Abuja
        </p>
      </aside>
      <section className="lg:col-span-7 flex flex-col min-w-0">
        <header className="p-4 sm:p-6 flex items-center justify-between border-b lg:border-0 gap-4">
          <div className="lg:invisible">
            <BrandLogo className="h-7" />
          </div>
          <Link
            className="text-sm inline-flex items-center gap-2 shrink-0 text-neutral-500"
            href="/"
          >
            <ArrowLeft size={16} />
            Website
          </Link>
        </header>
        <div className="w-full max-w-lg mx-auto px-5 sm:px-8 py-8 sm:py-12 lg:py-16">
          <p className="text-sm text-neutral-500 mb-3">{kicker}</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{title}</h1>
          {subtitle && (
            <p className="text-sm sm:text-base text-neutral-500 leading-relaxed mb-8">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </section>
    </div>
  );
}
