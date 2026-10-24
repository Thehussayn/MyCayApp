"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PortalShell from "@/components/portal/PortalShell";
import { usePortal, request } from "@/components/portal/usePortal";
import { Metric, Status } from "@/components/portal/Investments";
import { useMoney } from "@/components/portal/Currency";
export default function Dashboard() {
  const money = useMoney();
  const { user, preview } = usePortal();
  const [investments, setInvestments] = useState<any[]>([]),
    [notifications, setNotifications] = useState<any[]>([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) return;
    Promise.all([
      request("/api/portal/investments"),
      request("/api/portal/notifications"),
    ])
      .then(([i, n]) => {
        setInvestments([...i.giap, ...i.wealthStream]);
        setNotifications(n.notifications.slice(0, 5));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);
  const active = investments.filter(
    (i) => !["CLOSED", "COMPLETED", "EXITED"].includes(i.status),
  );
  const capital = active.reduce((s, i) => s + i.capitalKobo / 100, 0),
    earnings = investments.reduce(
      (s, i) => s + (i.totalPayoutsReceived || i.realizedInvestorProfit || 0),
      0,
    );
  const next = active
    .filter((i) => i.nextPayoutDate)
    .sort((a, b) => a.nextPayoutDate.localeCompare(b.nextPayoutDate))[0];
  return (
    <PortalShell user={user}>
      <div className="max-w-6xl mx-auto space-y-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="workspace-title">
              Hello{user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}
            </h1>
            <p className="text-sm text-neutral-500 mt-2">
              Your investments at a glance.
            </p>
          </div>
          <Link className="action" href="/portal/investments/new">
            New investment
          </Link>
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {user?.kycStatus !== "APPROVED" && (
          <div className="notice flex flex-wrap justify-between items-center gap-4">
            <div>
              <p className="font-semibold">
                {["SUBMITTED", "UNDER_REVIEW"].includes(user?.kycStatus || "")
                  ? "Your profile is under review"
                  : "Complete your profile"}
              </p>
              <p className="text-sm mt-1">
                {["SUBMITTED", "UNDER_REVIEW"].includes(user?.kycStatus || "")
                  ? "We’ll let you know when verification is complete."
                  : "Add your details and documents to start investing."}
              </p>
            </div>
            <Link
              className="action secondary"
              href={
                ["SUBMITTED", "UNDER_REVIEW"].includes(user?.kycStatus || "")
                  ? "/portal/verification"
                  : "/portal/biodata"
              }
            >
              View profile
            </Link>
          </div>
        )}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="panel">
            <Metric title="Invested capital" value={money(capital)} />
          </div>
          <div className="panel">
            <Metric title="Earnings to date" value={money(earnings)} />
          </div>
          <div className="panel">
            <Metric title="Open investments" value={active.length} />
          </div>
          <div className="panel">
            <Metric
              title="Next payout"
              value={next ? money(next.nextPayoutAmount) : "—"}
            />
            {next && (
              <p className="text-xs text-neutral-500 mt-2">
                {next.nextPayoutDate}
              </p>
            )}
          </div>
        </div>
        <section className="panel space-y-5">
          <div className="flex flex-wrap justify-between gap-3">
            <h2 className="font-semibold text-lg">My investments</h2>
            <Link className="text-sm underline" href="/portal/investments">
              View all
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-neutral-500">Loading…</p>
          ) : active.length ? (
            active.slice(0, 4).map((i) => (
              <Link
                className="flex flex-wrap justify-between gap-4 py-4 border-t"
                key={i.id}
                href={`/portal/investments/${i.id}`}
              >
                <div>
                  <p className="font-semibold">
                    {"principal" in i ? "WealthStream" : "GIAP"}
                  </p>
                  <p className="text-sm text-neutral-500 mt-1">
                    {money(i.capitalKobo / 100)}
                  </p>
                </div>
                <Status value={i.status} />
              </Link>
            ))
          ) : (
            <div className="py-8 text-center">
              <h3 className="font-medium">No investments yet</h3>
              <p className="text-sm text-neutral-500 mt-2 mb-5">
                Choose a plan when you’re ready.
              </p>
              <Link className="action secondary" href="/portal/investments/new">
                View plans
              </Link>
            </div>
          )}
        </section>
        <section className="panel space-y-5">
          <h2 className="font-semibold text-lg">Recent activity</h2>
          {notifications.length ? (
            notifications.map((n) => (
              <Link
                key={n.id}
                className="block border-t pt-4"
                href={n.actionUrl || "/portal/notifications"}
              >
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-sm text-neutral-500 mt-1">{n.message}</p>
              </Link>
            ))
          ) : (
            <p className="text-sm text-neutral-500">
              Your account updates will appear here.
            </p>
          )}
        </section>
      </div>
    </PortalShell>
  );
}
