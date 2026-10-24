"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/lib/db/types";
export function usePortal() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/auth/me");
      if (r.status === 401) {
        router.replace("/login");
        return;
      }
      if (!r.ok) throw Error("Unable to load your account.");
      const d = await r.json();
      if (
        d.user?.mustChangePassword &&
        window.location.pathname !== "/portal/settings"
      ) {
        router.replace("/portal/settings");
        return;
      }
      setUser(d.user);
      setPreview(!!d.preview);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [router]);
  useEffect(() => {
    refresh();
  }, [refresh]);
  return { user, preview, loading, error, refresh };
}
export async function request<T = any>(
  url: string,
  body?: unknown,
): Promise<T> {
  const r = await fetch(
    url,
    body === undefined
      ? undefined
      : {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
  );
  const d = await r.json();
  if (!r.ok) throw Error(d.error || "Please try again.");
  return d;
}
