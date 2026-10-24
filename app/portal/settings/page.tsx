"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
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
      <div className="max-w-3xl mx-auto space-y-6">
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
          <h2 className="font-semibold text-lg">Change password</h2>
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
        <form
          className="panel space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            patch({ action: "PREFERENCES", preferences: prefs });
          }}
        >
          <h2 className="font-semibold text-lg">Notification preferences</h2>
          {[
            ["emailAlerts", "Email updates"],
            ["smsAlerts", "SMS updates"],
            ["quarterlyDigest", "Quarterly summary"],
          ].map(([key, title]) => (
            <label key={key} className="flex gap-3 items-center text-sm">
              <input
                type="checkbox"
                checked={(prefs as any)[key]}
                onChange={(e) =>
                  setPrefs({ ...prefs, [key]: e.target.checked })
                }
              />
              {title}
            </label>
          ))}
          <button className="action secondary" disabled={busy}>
            Save preferences
          </button>
        </form>
        {user && user.role !== "INVESTOR" && (
          <Link className="action" href="/admin">
            Return to operations
          </Link>
        )}
      </div>
    </PortalShell>
  );
}
