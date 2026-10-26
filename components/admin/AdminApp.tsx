"use client";
import { AdminLogo, AdminIcon } from "./Design";
import designSets from "./design-sets.json";
import type dimensions from "./figma-assets.json";
import Content from "./Content";
import Audit from "./Audit";
import Team from "./Team";
import Configuration from "./Configuration";
import Finance from "./Finance";
import Investors from "./Investors";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Landmark,
  FileText,
  Settings,
  History,
} from "lucide-react";

import PreviewBar from "@/components/portal/PreviewBar";
import { request } from "@/components/portal/usePortal";
import { Metric, label } from "@/components/portal/Investments";
import { formatCurrency as money } from "@/lib/utils";

const sections = [
  { id: "overview", name: "Overview", icon: LayoutDashboard, asset: "e43d9.svg" },
  { id: "investors", name: "Investors", icon: Users, asset: "8ca48.svg" },
  { id: "finance", name: "Finance", icon: Landmark, asset: "60ef4.svg" },
  { id: "content", name: "Content", icon: FileText, asset: "d08aa.svg" },
  { id: "users", name: "Team", icon: Users, asset: "8ca48.svg" },
  { id: "audit", name: "Audit log", icon: History, asset: "8f042.svg" },
  { id: "settings", name: "Settings", icon: Settings, asset: "e1445.svg" },
] as const;
export default function AdminApp({ section, investorId }: { section: string; investorId?: string }) {
  const router = useRouter();
  const [pageTitle, setPageTitle] = useState(""),
    [overview, setOverview] = useState<any>(null),
    [data, setData] = useState<any>(null),
    [error, setError] = useState(""),
    [success, setSuccess] = useState(""),
    [busy, setBusy] = useState(false),
    [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  async function load() {
    try {
      const o = await request("/api/admin");
      setOverview(o);
      if (section !== "overview")
        setData(await request(`/api/admin?section=${section}`));
      else setData(o);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  useEffect(() => {
    setData(null);
    setPageTitle("");
    setError("");
    setSuccess("");
    setOpen(false);
    load();
  }, [section]);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const nodes = Array.from(
          document.querySelectorAll<HTMLElement>(
            "[data-admin-drawer] a,[data-admin-drawer] button",
          ),
        );
        if (e.shiftKey && document.activeElement === nodes[0]) {
          e.preventDefault();
          nodes[nodes.length - 1]?.focus();
        } else if (
          !e.shiftKey &&
          document.activeElement === nodes[nodes.length - 1]
        ) {
          e.preventDefault();
          nodes[0]?.focus();
        }
      }
    }
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  async function act(body: any) {
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await request("/api/admin", body);
      setSuccess("Changes saved.");
      await load();
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  const allowed = sections.filter(
    (s) => s.id === "overview" || overview?.permissions.includes(s.id),
  );
  const assetSet = designSets[(investorId ? "profile" : section) as keyof typeof designSets] || designSets.investors;
  const logoFiles = assetSet.logo as (keyof typeof dimensions)[];
  const nav = (
    <>
      <nav aria-label="Operations navigation" className="space-y-1">
        {allowed.map((s) => (
          <Link
            key={s.id}
            href={s.id === "overview" ? "/admin" : `/admin/${s.id}`}
            onClick={() => setOpen(false)}
            className={`workspace-nav ${s.id === section ? "active" : ""}`}
            aria-current={s.id === section ? "page" : undefined}
          >
            <span className="admin-icon-slot"><AdminIcon file={assetSet.icons[s.id] as keyof typeof dimensions} /></span>
            {s.name}
          </Link>
        ))}
      </nav>
      <div className="admin-account"><div><strong>{overview?.user.fullName}</strong><span>{label(overview?.user.role || "")}</span></div><button className="action secondary" onClick={async () => {await fetch("/api/auth/logout", {method:"POST"});router.push("/login");}}>Sign out</button></div>
    </>
  );
  return (
    <div className={`workspace admin-workspace min-h-screen ${section === "overview" ? "admin-overview" : ""}`}>
      <PreviewBar />
      <header className={`admin-mobile-header ${section === "overview" ? "admin-overview-header" : ""}`}>
        <div className="flex gap-3 items-center">
          <button
            className="icon-button lg:hidden"
            aria-label="Open navigation"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu size={22} />
          </button>
          <AdminLogo light={section === "overview"} files={logoFiles} />
          <span className="hidden sm:block border-l pl-5 ml-3 text-sm text-neutral-500">
            Operations
          </span>
        </div>
        <span className="text-xs capitalize text-neutral-500">
          {section === "overview" ? `${overview?.user.fullName || ""} · ` : ""}{label(overview?.user.role || "")}
        </span>
      </header>
      <div className="admin-layout">
        <aside className="admin-sidebar"><AdminLogo light={section === "overview"} files={logoFiles}/>{nav}</aside>
        <main className="admin-main">
          <div className="admin-page space-y-6">
            <h1 className="workspace-title" data-admin-title>
              {pageTitle || sections.find((s) => s.id === section)?.name || "Page not found"}
            </h1>
            {error && (
              <div className="error" role="alert">
                {error}
              </div>
            )}
            {success && (
              <p className="text-sm text-green-700" role="status">
                {success}
              </p>
            )}
            {!data && !error ? (
              <div className="panel">Loading…</div>
            ) : (
              data && (
                <>
                  {section === "overview" && (
                    <>
                      <div className="admin-overview-metrics grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        {[
                          ["Investors", data.counts.investors],
                          ["Awaiting review", data.counts.pending],
                          [
                            "Capital under management",
                            data.counts.capital === undefined
                              ? undefined
                              : money(data.counts.capital),
                          ],
                          ["Withdrawal requests", data.counts.withdrawals],
                        ]
                          .filter(([, v]) => v !== undefined)
                          .map(([title, value]) => (
                            <div className="panel" key={title}>
                              <Metric title={String(title)} value={value} />
                            </div>
                          ))}
                      </div>
                      <div className="admin-module-shortcuts grid md:grid-cols-2 gap-6">
                        {allowed
                          .filter((s) => s.id !== "overview")
                          .map((s) => (
                            <Link
                              key={s.id}
                              href={`/admin/${s.id}`}
                              className="panel flex items-center gap-4 hover:border-brand-gold"
                            >
                              <span className="admin-icon-slot"><AdminIcon file={designSets.overview.icons[s.id] as keyof typeof dimensions} /></span>
                              <span className="font-semibold">{s.name}</span>
                            </Link>
                          ))}
                      </div>
                    </>
                  )}
                  {section === "investors" && (
                    <Investors
                      data={data}
                      investorId={investorId}
                      onTitleChange={setPageTitle}
                      counts={overview.counts}
                      canReview={overview.permissions.includes("review")}
                      busy={busy}
                      act={act}
                    />
                  )}
                  {section === "finance" && (
                    <Finance data={data} busy={busy} act={act} onTitleChange={setPageTitle} />
                  )}
                  {section === "settings" && (
                    <Configuration data={data.config} busy={busy} act={act} onTitleChange={setPageTitle} />
                  )}
                  {section === "users" && (
                    <Team data={data} busy={busy} act={act} />
                  )}
                  {section === "audit" && <Audit logs={data.logs} />}
                  {section === "content" && (
                    <Content data={data} busy={busy} act={act} onTitleChange={setPageTitle} />
                  )}
                </>
              )
            )}
          </div>
        </main>
      </div>
      {open && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Operations navigation"
        >
          <div
            className="absolute inset-0 bg-brand-charcoal/50"
            onClick={() => setOpen(false)}
          />
          <aside
            data-admin-drawer
            className="admin-mobile-drawer relative w-80 max-w-[88vw] h-full overflow-y-auto p-5"
          >
            <div className="flex justify-between items-center mb-6">
              <AdminLogo light={section === "overview"} files={logoFiles} />
              <button
                ref={closeRef}
                className="icon-button"
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
              >
                <X size={22} />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      )}
    </div>
  );
}
