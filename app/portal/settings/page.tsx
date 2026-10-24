"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FigmaIcon } from "@/components/portal/FigmaAsset";
import Currency from "@/components/portal/Currency";
import PortalShell from "@/components/portal/PortalShell";
import { usePortal, request } from "@/components/portal/usePortal";
export default function Settings() {
  const { user, refresh } = usePortal();
  const [prefs, setPrefs] = useState({
      emailAlerts: true,
      smsAlerts: false,
      quarterlyDigest: true,
    }),
    [current, setCurrent] = useState(""),
    [password, setPassword] = useState(""),
    [confirm, setConfirm] = useState(""),
    [error, setError] = useState(""),
    [success, setSuccess] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    if (user)
      request("/api/portal/settings")
        .then((d) =>
          setPrefs({
            emailAlerts: d.settings.emailAlerts,
            smsAlerts: d.settings.smsAlerts,
            quarterlyDigest: d.settings.quarterlyDigest,
          }),
        )
        .catch((e) => setError(e.message));
  }, [user]);
  async function patch(body: any) {
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      const r = await fetch("/api/portal/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      setSuccess("Changes saved.");
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  return (
    <PortalShell user={user} currentTitle="Settings">
      <div className="max-w-5xl mx-auto space-y-6">
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p role="status" className="text-sm text-green-700">
            {success}
          </p>
        )}
        {user?.mustChangePassword && (
          <p className="notice">
            Set a new password to continue using your account.
          </p>
        )}
        <form
          className="panel space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            patch({ action: "PREFERENCES", preferences: prefs });
          }}
        >
          <div className="investor-settings-title"><FigmaIcon file="f0899.svg"/><div><h2>Notification Preferences</h2><p>Choose which updates you receive.</p></div></div>
          <div className="investor-preferences">{[
            ["emailAlerts", "Email Disbursement Alerts", "Receive email updates about payouts."],
            ["smsAlerts", "SMS Transaction Alerts", "Receive transaction updates by SMS."],
            ["quarterlyDigest", "Quarterly Investment Digest", "Receive a quarterly portfolio summary."],
          ].map(([key, title, description]) => (
            <label key={key} className="investor-preference flex gap-3 items-center text-sm">
              <div><strong>{title}</strong><p>{description}</p></div><input
                type="checkbox"
                checked={(prefs as any)[key]}
                onChange={(e) =>
                  setPrefs({ ...prefs, [key]: e.target.checked })
                }
              />
            </label>
          ))}</div>
          <div className="flex items-center justify-between text-sm"><span>Display currency</span><Currency /></div>
          <button className="action secondary" disabled={busy}>
            Save preferences
          </button>
        </form>
        <form
          className="panel space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            if (password !== confirm) {
              setError("The new passwords do not match.");
              return;
            }
            if (
              await patch({
                action: "PASSWORD",
                passwordChange: {
                  currentPassword: current,
                  newPassword: password,
                },
              })
            ) {
              setCurrent("");
              setPassword("");
              setConfirm("");
              await refresh();
            }
          }}
        >
          <div className="investor-settings-title"><FigmaIcon file="ae21e.svg"/><div><h2>Change Password</h2><p>Update your login credentials.</p></div></div>
          <label className="field">
            Current password
            <input
              type="password"
              autoComplete="current-password"
              required
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
            />
          </label>
          <label className="field">
            New password
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <p className="text-xs text-neutral-500">
            Use at least 8 characters, an uppercase letter, a number, and a
            special character.
          </p>
          <label className="field">
            Confirm new password
            <input
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </label>
          <button className="action" disabled={busy}>
            Update password
          </button>
        </form>
        <section className="panel space-y-3"><h2 className="investor-panel-heading">Security standards</h2><p className="text-sm text-neutral-500">For help changing verified identity or bank details, contact our team.</p><Link className="investor-text-link" href="/contact">Contact support</Link></section>
        {user && user.role !== "INVESTOR" && (
          <Link className="action" href="/admin">
            Return to operations
          </Link>
        )}
      </div>
    </PortalShell>
  );
}
