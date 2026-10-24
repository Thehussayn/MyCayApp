"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import PreviewBar from "./PreviewBar";
import { FigmaIcon, InvestorLogo } from "./FigmaAsset";
import type { KycStatus } from "@/lib/db/types";
interface Props {
  children: React.ReactNode;
  user: { fullName?: string; email?: string; referenceId?: string; status?: string; kycStatus?: KycStatus } | null;
  kycStatus?: KycStatus;
  currentTitle?: string;
  subtitle?: string;
  unreadNotificationsCount?: number;
}
const navigationItems = [
  { label: "Overview", href: "/portal/dashboard", icon: "ae72a.svg", selected: "56215.svg" },
  { label: "My Investments", href: "/portal/investments", icon: "ad808.svg", selected: "e7a01.svg" },
  { label: "Transactions", href: "/portal/transactions", icon: "c08c1.svg", selected: "9ab7c.svg" },
  { label: "Documents", href: "/portal/documents", icon: "fb05e.svg", selected: "43caa.svg" },
  { label: "Notifications", href: "/portal/notifications", icon: "b1e8a.svg", selected: "f0899.svg" },
  { label: "My Profile", href: "/portal/profile", icon: "ce358.svg", selected: "6f34a.svg" },
  { label: "Settings", href: "/portal/settings", icon: "ec2c5.svg", selected: "79996.svg" },
] as const;
export default function PortalShell({ children, user, currentTitle, subtitle, unreadNotificationsCount = 0 }: Props) {
  const pathname = usePathname(), router = useRouter();
  const [open, setOpen] = useState(false), [unread, setUnread] = useState(unreadNotificationsCount);
  const closeRef = useRef<HTMLButtonElement>(null), menuRef = useRef<HTMLButtonElement>(null);
  const name = user?.fullName || "Your account", firstName = name.split(" ")[0];
  const initials = name.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
  useEffect(() => { setOpen(false); fetch("/api/portal/notifications").then(r => r.json()).then(d => setUnread(d.unreadCount || 0)).catch(() => {}); }, [pathname, unreadNotificationsCount]);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus(); const previous = document.body.style.overflow; document.body.style.overflow = "hidden";
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-portal-drawer] a, [data-portal-drawer] button"));
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    }
    document.addEventListener("keydown", key);
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", key); menuRef.current?.focus(); };
  }, [open]);
  const navigation = <div className="investor-sidebar-content">
    <nav aria-label="Investor navigation" className="investor-navigation">
      {navigationItems.map(item => {
        const active = pathname.startsWith(item.href) || (item.href === "/portal/investments" && ["/portal/plans", "/portal/giap", "/portal/wealthstream"].some(p => pathname.startsWith(p))) || (item.href === "/portal/documents" && pathname === "/portal/verification");
        return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined} className={`investor-nav-link ${active ? "active" : ""}`}><FigmaIcon file={active ? item.selected : item.icon} /><span>{item.label}</span>{item.label === "Notifications" && unread > 0 && <span className="investor-unread">{unread}</span>}</Link>;
      })}
    </nav>
    <div className="investor-support"><Link href="/contact"><span>Need Advisory Assistance?</span><FigmaIcon file="29f99.svg" /></Link></div>
    <div className="investor-account"><Link href="/portal/profile" className="investor-account-person"><span className="investor-avatar">{initials}</span><span className="min-w-0"><strong>{name}</strong><small>{user?.referenceId}</small></span></Link><button onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/login"); }}><FigmaIcon file="c6430.svg" />Sign Out</button></div>
  </div>;
  return <div className="workspace investor-workspace">
    <PreviewBar />
    <header className="investor-header"><div className="investor-header-inner"><div className="investor-header-brand"><button ref={menuRef} className="investor-menu-button" aria-label="Open navigation" aria-expanded={open} onClick={() => setOpen(true)}><Menu size={20} /></button><InvestorLogo /><span className="investor-header-divider" /></div><div className="investor-header-actions"><Link href="/portal/notifications" className="investor-header-notification" aria-label={unread ? `${unread} unread notifications` : "Notifications"}><FigmaIcon file="0fad7.svg" />{unread > 0 && <span />}</Link><Link href="/portal/profile" className="investor-header-profile"><span className="investor-avatar">{initials[0]}</span><span>{firstName}</span></Link></div></div></header>
    <div className="investor-layout"><aside className="investor-sidebar">{navigation}</aside><main id="portal-content" className="investor-main">{currentTitle && <div className="investor-page-heading"><h1 className="workspace-title">{currentTitle}</h1>{subtitle && <p>{subtitle}</p>}</div>}{children}</main></div>
    {open && <div className="investor-mobile-overlay" role="dialog" aria-modal="true" aria-label="Navigation"><div className="investor-mobile-backdrop" onClick={() => setOpen(false)} /><aside data-portal-drawer className="investor-mobile-drawer"><div className="investor-mobile-drawer-header"><InvestorLogo dark /><button ref={closeRef} className="icon-button" aria-label="Close navigation" onClick={() => setOpen(false)}><X size={22} /></button></div>{navigation}</aside></div>}
  </div>;
}
