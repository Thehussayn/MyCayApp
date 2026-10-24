"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PortalShell from "@/components/portal/PortalShell";
import { usePortal, request } from "@/components/portal/usePortal";
export default function Notifications() {
  const { user } = usePortal();
  const [list, setList] = useState<any[]>([]),
    [error, setError] = useState(""),
    [filter, setFilter] = useState("ALL");
  async function load() {
    try {
      const d = await request("/api/portal/notifications");
      setList(d.notifications);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  useEffect(() => {
    if (user) load();
  }, [user]);
  async function mark(body: any) {
    try {
      const r = await fetch("/api/portal/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw Error("Unable to update notifications.");
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  const filtered = list.filter((n) => filter === "ALL" || !n.isRead);
  return (
    <PortalShell
      user={user}
      currentTitle="Notifications"
      unreadNotificationsCount={list.filter((n) => !n.isRead).length}
    >
      <div className="max-w-4xl mx-auto space-y-5">
        {error && <p className="error">{error}</p>}
        <div className="flex flex-wrap justify-between gap-3">
          <div className="flex gap-2">
            {["ALL", "UNREAD"].map((f) => (
              <button
                key={f}
                className={`action ${filter === f ? "" : "secondary"}`}
                onClick={() => setFilter(f)}
              >
                {f === "ALL" ? "All" : "Unread"}
              </button>
            ))}
          </div>
          <button
            className="action secondary"
            onClick={() => mark({ markAll: true })}
            disabled={!list.some((n) => !n.isRead)}
          >
            Mark all as read
          </button>
        </div>
        {filtered.map((n) => (
          <article className="panel space-y-3" key={n.id}>
            <div className="flex items-start gap-3">
              <span
                className={`mt-2 w-2 h-2 rounded-full shrink-0 ${n.isRead ? "bg-neutral-200" : "bg-brand-gold"}`}
              />
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold">{n.title}</h2>
                <p className="text-sm text-neutral-600 mt-2">{n.message}</p>
                <p className="text-xs text-neutral-400 mt-3">
                  {new Date(n.timestamp).toLocaleString()}
                </p>
                <div className="flex flex-wrap gap-4 mt-4 text-sm">
                  {n.actionUrl && (
                    <Link
                      className="underline"
                      href={n.actionUrl}
                      onClick={() => mark({ notificationId: n.id })}
                    >
                      View details
                    </Link>
                  )}
                  {!n.isRead && (
                    <button
                      className="underline"
                      onClick={() => mark({ notificationId: n.id })}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
        {!filtered.length && (
          <div className="panel text-sm text-neutral-500">
            {filter === "UNREAD"
              ? "You’re all caught up."
              : "Your account updates will appear here."}
          </div>
        )}
      </div>
    </PortalShell>
  );
}
