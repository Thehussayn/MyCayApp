"use client";
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
  LogOut,
} from "lucide-react";

import BrandLogo from "@/components/ui/BrandLogo";
import PreviewBar from "@/components/portal/PreviewBar";
import { request } from "@/components/portal/usePortal";
import { Metric, label } from "@/components/portal/Investments";
import { formatCurrency as money } from "@/lib/utils";

const sections = [
  { id: "overview", name: "Overview", icon: LayoutDashboard },
  { id: "investors", name: "Investors", icon: Users },
  { id: "finance", name: "Finance", icon: Landmark },
  { id: "content", name: "Content", icon: FileText },
  { id: "users", name: "Team", icon: Users },
  { id: "audit", name: "Audit log", icon: History },
  { id: "settings", name: "Settings", icon: Settings },
];
export default function AdminApp({ section }: { section: string }) {
  const router = useRouter();
  const [overview, setOverview] = useState<any>(null),
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
  const nav = (
    <>
      <div className="px-3 mb-6">
        <p className="font-semibold capitalize">{overview?.user.fullName}</p>
        <p className="text-xs text-neutral-500 mt-1 capitalize">
          {label(overview?.user.role || "")}
        </p>
      </div>
      <nav aria-label="Operations navigation" className="space-y-1">
        {allowed.map((s) => (
          <Link
            key={s.id}
            href={s.id === "overview" ? "/admin" : `/admin/${s.id}`}
            onClick={() => setOpen(false)}
            className={`workspace-nav ${s.id === section ? "active" : ""}`}
            aria-current={s.id === section ? "page" : undefined}
          >
            <s.icon size={18} />
            {s.name}
          </Link>
        ))}
      </nav>
      <button
        className="workspace-nav w-full mt-8 border-t"
        onClick={async () => {
          await fetch("/api/auth/logout", { method: "POST" });
          router.push("/login");
        }}
      >
        <LogOut size={18} />
        Sign out
      </button>
    </>
  );
  return (
    <div className="workspace min-h-screen">
      <PreviewBar />
      <header className="workspace-header">
        <div className="flex gap-3 items-center">
          <button
            className="icon-button lg:hidden"
            aria-label="Open navigation"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu size={22} />
          </button>
          <BrandLogo href="/admin" variant="dark" className="h-7 sm:h-8" />
          <span className="hidden sm:block border-l pl-5 ml-3 text-sm text-neutral-500">
            Operations
          </span>
        </div>
        <span className="text-xs capitalize text-neutral-500">
          {label(overview?.user.role || "")}
        </span>
      </header>
      <div className="flex max-w-[1600px] mx-auto">
        <aside className="hidden lg:block w-60 shrink-0 bg-white border-r p-5 min-h-[calc(100vh-76px)]">
          <div className="sticky top-24">{nav}</div>
        </aside>
        <main className="min-w-0 flex-1 p-4 py-6 sm:p-8 lg:p-10">
          <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="workspace-title">
              {sections.find((s) => s.id === section)?.name || "Page not found"}
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
                      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
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
                      <div className="grid md:grid-cols-2 gap-4">
                        {allowed
                          .filter((s) => s.id !== "overview")
                          .map((s) => (
                            <Link
                              key={s.id}
                              href={`/admin/${s.id}`}
                              className="panel flex items-center gap-4 hover:border-brand-gold"
                            >
                              <s.icon size={22} className="text-brand-gold" />
                              <span className="font-semibold">{s.name}</span>
                            </Link>
                          ))}
                      </div>
                    </>
                  )}
                  {section === "investors" && (
                    <Investors
                      data={data}
                      canReview={overview.permissions.includes("review")}
                      busy={busy}
                      act={act}
                    />
                  )}
                  {section === "finance" && (
                    <Finance data={data} busy={busy} act={act} />
                  )}
                  {section === "settings" && (
                    <Configuration data={data.config} busy={busy} act={act} />
                  )}
                  {section === "users" && (
                    <Team data={data} busy={busy} act={act} />
                  )}
                  {section === "audit" && <Audit logs={data.logs} />}
                  {section === "content" && (
                    <Content data={data} busy={busy} act={act} />
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
            className="relative w-80 max-w-[88vw] h-full overflow-y-auto bg-white p-5"
          >
            <div className="flex justify-between items-center mb-6">
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
            {nav}
          </aside>
        </div>
      )}
    </div>
  );
}
