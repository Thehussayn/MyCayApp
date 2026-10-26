"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
export default function PreviewBar() {
  const barRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [role, setRole] = useState("INVESTOR");
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        setPreview(d.preview);
        setRole(d.user?.role || "INVESTOR");
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    const bar = barRef.current;
    const workspace = bar?.closest<HTMLElement>(".workspace");
    if (!bar || !workspace) return;
    const update = () => workspace.style.setProperty("--preview-bar-height", `${bar.getBoundingClientRect().height}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(bar);
    return () => { observer.disconnect(); workspace.style.removeProperty("--preview-bar-height"); };
  }, [preview]);
  if (!preview) return null;
  async function switchRole(value: string) {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: value }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      window.location.assign(d.redirect);
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }
  return (
    <div ref={barRef} className="preview-bar">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p>
          <strong>Preview</strong>
          <span className="ml-2 text-neutral-600">
            Changes stay in this workspace.
          </span>
        </p>
        <div className="flex items-center gap-3">
          <label className="sr-only" htmlFor="preview-role">
            Preview role
          </label>
          <select
            id="preview-role"
            value={role}
            disabled={busy}
            onChange={(e) => switchRole(e.target.value)}
          >
            {["INVESTOR", "STAFF", "FINANCE", "ADMIN", "SUPER_ADMIN"].map(
              (r) => (
                <option key={r} value={r}>
                  {r.replaceAll("_", " ").toLowerCase()}
                </option>
              ),
            )}
          </select>
          {role === "INVESTOR" && (
            <Link href="/portal/biodata">Complete KYC</Link>
          )}
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.assign("/login");
            }}
          >
            Exit
          </button>
        </div>
      </div>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
