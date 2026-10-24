"use client";
import { useState } from "react";
import BrandLogo from "@/components/ui/BrandLogo";
export default function PreviewLauncher() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <div className="workspace min-h-screen flex items-center justify-center p-4">
      <div className="panel max-w-md w-full space-y-6">
        <BrandLogo className="h-8" />
        <h1 className="workspace-title">Preview the app</h1>
        <p className="text-sm text-neutral-500">
          Walk through onboarding, investments, and the operations app. Changes
          stay in a separate workspace.
        </p>
        {error && <p className="error">{error}</p>}
        <button
          className="action w-full"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              const r = await fetch("/api/preview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: "INVESTOR" }),
              });
              const d = await r.json();
              if (!r.ok) throw Error(d.error);
              window.location.assign(d.redirect);
            } catch (e) {
              setError((e as Error).message);
              setBusy(false);
            }
          }}
        >
          {busy ? "Opening…" : "Open preview workspace"}
        </button>
      </div>
    </div>
  );
}
