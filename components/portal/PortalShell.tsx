"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import BrandLogo from "@/components/ui/BrandLogo";
import PreviewBar from "./PreviewBar";
import Currency from "./Currency";
import { KycStatus } from "@/lib/db/types";
import {
  LayoutDashboard,
  Briefcase,
  Receipt,
  FileText,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
interface Props {
  children: React.ReactNode;
  user: {
    fullName?: string;
    email?: string;
    referenceId?: string;
    status?: string;
    kycStatus?: KycStatus;
  } | null;
  kycStatus?: KycStatus;
  currentTitle?: string;
  unreadNotificationsCount?: number;
}
export default function PortalShell({
  children,
  user,
  kycStatus,
  currentTitle,
  unreadNotificationsCount = 0,
}: Props) {
  const pathname = usePathname(),
    router = useRouter();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [unread, setUnread] = useState(unreadNotificationsCount);
  useEffect(() => {
    setOpen(false);
    fetch("/api/portal/notifications")
      .then((r) => r.json())
      .then((d) => setUnread(d.unreadCount || 0))
      .catch(() => {});
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const nodes = Array.from(
          document.querySelectorAll<HTMLElement>(
            "[data-portal-drawer] a, [data-portal-drawer] button",
          ),
        );
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  const items = [
    { label: "Overview", href: "/portal/dashboard", icon: LayoutDashboard },
    { label: "My investments", href: "/portal/investments", icon: Briefcase },
    { label: "Transactions", href: "/portal/transactions", icon: Receipt },
    { label: "Documents", href: "/portal/documents", icon: FileText },
    { label: "Verification", href: "/portal/verification", icon: ShieldCheck },
    { label: "Notifications", href: "/portal/notifications", icon: Bell },
    { label: "Profile", href: "/portal/profile", icon: User },
    { label: "Settings", href: "/portal/settings", icon: Settings },
  ];
  const navigation = (
    <>
      <div className="px-3 mb-6">
        <p className="font-semibold truncate">
          {user?.fullName || "Your account"}
        </p>
        <p className="text-xs text-neutral-500 mt-1 break-all">
          {user?.referenceId}
        </p>
      </div>
      <nav aria-label="Investor navigation" className="space-y-1">
        {items.map(({ label, href, icon: Icon }) => {
          const active =
            pathname.startsWith(href) ||
            (href === "/portal/investments" &&
              ["/portal/plans", "/portal/giap", "/portal/wealthstream"].some(
                (p) => pathname.startsWith(p),
              ));
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={active ? "page" : undefined}
              className={`workspace-nav ${active ? "active" : ""}`}
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === "Notifications" && unread > 0 && (
                <span className="ml-auto text-xs">{unread}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 border-t pt-4">
        <Link className="workspace-nav" href="/contact">
          <ArrowUpRight size={18} />
          Contact support
        </Link>
        <button
          className="workspace-nav w-full"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
          }}
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </>
  );
  return (
    <div className="workspace min-h-screen">
      <PreviewBar />
      <header className="workspace-header">
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="icon-button lg:hidden"
            aria-label="Open navigation"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu size={22} />
          </button>
          <BrandLogo
            href="/portal/dashboard"
            variant="dark"
            className="h-7 sm:h-8"
          />
          <span className="hidden sm:block border-l pl-5 ml-3 text-sm text-neutral-500">
            Investor portal
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Currency />
          <Link
            className="icon-button relative"
            href="/portal/notifications"
            aria-label={
              unread ? `${unread} unread notifications` : "Notifications"
            }
          >
            <Bell size={20} />
            {unread > 0 && (
              <span className="absolute right-1 top-1 w-2 h-2 bg-brand-gold rounded-full" />
            )}
          </Link>
        </div>
      </header>
      <div className="flex mx-auto max-w-[1600px]">
        <aside className="hidden lg:block w-60 xl:w-64 shrink-0 border-r bg-white p-5 min-h-[calc(100vh-80px)]">
          <div className="sticky top-24">{navigation}</div>
        </aside>
        <main
          id="portal-content"
          className="min-w-0 flex-1 px-4 py-6 sm:p-8 lg:p-10"
        >
          {currentTitle && (
            <h1 className="workspace-title mb-7">{currentTitle}</h1>
          )}
          {children}
        </main>
      </div>
      {open && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <div
            className="absolute inset-0 bg-brand-charcoal/50"
            onClick={() => setOpen(false)}
          />
          <aside
            data-portal-drawer
            className="relative h-full w-80 max-w-[88vw] overflow-y-auto bg-white p-5 shadow-xl"
          >
            <div className="flex items-center justify-between mb-7">
              <BrandLogo variant="dark" className="h-7" />
              <button
                ref={closeRef}
                className="icon-button"
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
              >
                <X size={22} />
              </button>
            </div>
            {navigation}
          </aside>
        </div>
      )}
    </div>
  );
}
