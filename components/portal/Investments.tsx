"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PortalShell from "./PortalShell";
import { request, usePortal } from "./usePortal";
import { GiapInvestment, WealthStreamInvestment } from "@/lib/db/types";
import { Withdrawal } from "@/lib/platform/types";
import { useMoney } from "@/components/portal/Currency";
import { ArrowLeft, ArrowRight, Briefcase, Plus } from "lucide-react";
export const label = (s: string) => s.replaceAll("_", " ").toLowerCase();
export function Status({ value }: { value: string }) {
  return (
    <span className={`status ${value.toLowerCase()}`}>{label(value)}</span>
  );
}
export default function Investments({ id }: { id?: string }) {
  const formatCurrency = useMoney();
  const { user, preview, error: authError } = usePortal();
  const [giap, setGiap] = useState<GiapInvestment[]>([]),
    [ws, setWs] = useState<WealthStreamInvestment[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]),
    [filter, setFilter] = useState("ALL"),
    [status, setStatus] = useState("ALL"),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  const [withdraw, setWithdraw] = useState(false),
    [reason, setReason] = useState("Personal needs"),
    [note, setNote] = useState(""),
    [accept, setAccept] = useState(false),
    [busy, setBusy] = useState(false),
    [noticeDays, setNoticeDays] = useState(30);
  async function load() {
    try {
      const [d, w, c] = await Promise.all([
        request("/api/portal/investments"),
        request("/api/portal/withdrawals"),
        request("/api/portal/plans"),
      ]);
      setGiap(d.giap);
      setWs(d.wealthStream);
      setWithdrawals(w.withdrawals);
      setNoticeDays(c.config.noticeDays);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (!user) return;
    load();
    const ref = new URLSearchParams(window.location.search).get("reference");
    if (ref)
      request("/api/portal/paystack/verify", { reference: ref })
        .then(() => {
          window.history.replaceState(null, "", "/portal/investments");
          load();
        })
        .catch((e) => setError(e.message));
  }, [user]);
  const all = [
    ...giap.map((i) => ({
      ...i,
      plan: "GIAP" as const,
      capital: i.initialInvestment,
    })),
    ...ws.map((i) => ({
      ...i,
      plan: "WEALTHSTREAM" as const,
      capital: i.principal,
    })),
  ];
  const selected = all.find((i) => i.id === id);
  const activeWithdrawal = withdrawals.find(
    (w) =>
      w.investmentId === id && !["REJECTED", "COMPLETED"].includes(w.status),
  );
  const filtered = all.filter(
    (i) =>
      (filter === "ALL" || i.plan === filter) &&
      (status === "ALL" ||
        (status === "OPEN"
          ? !["CLOSED", "COMPLETED", "EXITED"].includes(i.status)
          : ["CLOSED", "COMPLETED", "EXITED"].includes(i.status))),
  );
  async function submitWithdrawal() {
    setBusy(true);
    setError("");
    try {
      await request("/api/portal/withdrawals", {
        investmentId: id,
        reason,
        note,
        acceptTerms: accept,
      });
      setWithdraw(false);
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <PortalShell user={user} kycStatus={user?.kycStatus}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            {id && (
              <Link
                className="text-sm text-neutral-500 inline-flex items-center gap-2 mb-3"
                href="/portal/investments"
              >
                <ArrowLeft size={16} />
                My investments
              </Link>
            )}
            <h1 className="workspace-title">
              {id
                ? selected?.plan === "GIAP"
                  ? "GIAP"
                  : "WealthStream"
                : "My investments"}
            </h1>
            <p className="text-sm text-neutral-500 mt-2">
              {id
                ? selected?.referenceId
                : "Track your capital, returns, and payouts."}
            </p>
          </div>
          {!id && (
            <Link className="action" href="/portal/investments/new">
              <Plus size={17} />
              New investment
            </Link>
          )}
        </div>
        {(error || authError) && (
          <p className="error" role="alert">
            {error || authError}
          </p>
        )}
        {loading ? (
          <div className="panel">Loading investments…</div>
        ) : id ? (
          selected ? (
            <>
              <div className="panel investment-summary">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <h2 className="investor-summary-label">Investment summary</h2>
                  <Status value={selected.status} />
                </div>
                <div className="grid sm:grid-cols-3 gap-6">
                  <Metric
                    title="Capital"
                    value={formatCurrency(selected.capital)}
                  />
                  <Metric
                    title="Started"
                    value={
                      "investmentDate" in selected
                        ? selected.investmentDate
                        : selected.startDate
                    }
                  />
                  <Metric
                    title={
                      "principal" in selected
                        ? "Total earnings"
                        : "Profit share"
                    }
                    value={
                      "principal" in selected
                        ? formatCurrency(selected.totalPayoutsReceived)
                        : "70% on resale"
                    }
                  />
                </div>
              </div>
              {"initialInvestment" in selected ? (
                <>
                  <section className="panel space-y-4">
                    <h2 className="font-semibold">Linked property</h2>
                    {selected.linkedPropertyId || selected.propertyId ? (
                      <>
                        <h3 className="text-xl font-semibold">
                          {selected.propertyTitle}
                        </h3>
                        <p className="text-neutral-500 text-sm">
                          {selected.propertyLocation}
                        </p>
                        <div className="grid sm:grid-cols-2 gap-5">
                          <Metric
                            title="Current valuation"
                            value={formatCurrency(selected.currentEvaluation)}
                          />
                          <Metric
                            title={
                              selected.isResaleCompleted
                                ? "Realised profit"
                                : "Projected profit share"
                            }
                            value={formatCurrency(
                              selected.isResaleCompleted
                                ? selected.realizedInvestorProfit
                                : selected.projectedInvestorShare,
                            )}
                          />
                        </div>
                        <p className="text-sm text-neutral-500">
                          {selected.isResaleCompleted
                            ? "Profit recorded from the completed sale."
                            : "Estimates depend on the final sale price. Your investment exits when the property is sold."}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-neutral-500">
                        Finance will assign a property after deploying your
                        funds. Your agreement will update when it is assigned.
                      </p>
                    )}
                  </section>
                  {selected.milestones.length > 0 && (
                    <section className="panel space-y-5">
                      <h2 className="font-semibold">Timeline</h2>
                      {selected.milestones.map((m) => (
                        <div
                          key={m.id}
                          className="border-l-2 border-brand-gold pl-4"
                        >
                          <p className="font-medium">{m.title}</p>
                          <p className="text-sm text-neutral-500">{m.date}</p>
                        </div>
                      ))}
                    </section>
                  )}
                </>
              ) : (
                <>
                  <section className="grid sm:grid-cols-3 gap-4">
                    <div className="panel">
                      <Metric
                        title="Annual return"
                        value={`${selected.annualRate * 100}%`}
                      />
                    </div>
                    <div className="panel">
                      <Metric
                        title="Payout frequency"
                        value={label(selected.payoutFrequency)}
                      />
                    </div>
                    <div className="panel">
                      <Metric
                        title="Next payout"
                        value={
                          selected.nextPayoutDate
                            ? `${formatCurrency(selected.nextPayoutAmount)} · ${selected.nextPayoutDate}`
                            : "No payout scheduled"
                        }
                      />
                    </div>
                  </section>
                  {activeWithdrawal && (
                    <div className="notice space-y-2">
                      <Status value={activeWithdrawal.status} />
                      <p>
                        {activeWithdrawal.noticeEndDate
                          ? `Principal return in ${Math.max(0, Math.ceil((new Date(activeWithdrawal.noticeEndDate).getTime() - Date.now()) / 86400000))} days · ${activeWithdrawal.noticeEndDate.slice(0, 10)}`
                          : "Finance is reviewing your withdrawal request."}
                      </p>
                      {activeWithdrawal.reviewNote && (
                        <p>{activeWithdrawal.reviewNote}</p>
                      )}
                      {activeWithdrawal.status === "PENDING_INFORMATION" && (
                        <>
                          <label className="field">
                            Your reply
                            <textarea
                              value={note}
                              onChange={(e) => setNote(e.target.value)}
                            />
                          </label>
                          <button
                            className="action"
                            disabled={busy || !note.trim()}
                            onClick={async () => {
                              setBusy(true);
                              try {
                                await request("/api/portal/withdrawals", {
                                  action: "REPLY",
                                  withdrawalId: activeWithdrawal.id,
                                  note,
                                });
                                await load();
                              } catch (e) {
                                setError((e as Error).message);
                              } finally {
                                setBusy(false);
                              }
                            }}
                          >
                            Send reply
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  <section className="panel">
                    <div className="flex flex-wrap gap-3 justify-between items-center mb-5">
                      <h2 className="font-semibold">Payout schedule</h2>
                      {selected.status === "ACTIVE" && !activeWithdrawal && (
                        <div className="flex flex-wrap gap-2">
                          <Link
                            className="action secondary"
                            href={`/portal/investments/new?plan=wealthstream&topUp=${selected.id}`}
                          >
                            Top up
                          </Link>
                          <button
                            className="action secondary"
                            onClick={() => setWithdraw(!withdraw)}
                          >
                            Withdraw principal
                          </button>
                        </div>
                      )}
                    </div>
                    {withdraw && (
                      <div className="notice mb-6 space-y-4">
                        <h3 className="font-semibold">
                          Withdraw {formatCurrency(selected.principal)}
                        </h3>
                        <p>
                          Your notice period is{" "}
                          {selected.withdrawalNoticeDays ?? noticeDays} days
                          from approval. No returns accrue after approval, and
                          your full principal is returned at the end of the
                          notice period. Approved requests cannot be reversed.
                        </p>
                        <label className="field">
                          Reason
                          <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                          >
                            {["Personal needs", "Reinvestment", "Other"].map(
                              (r) => (
                                <option key={r}>{r}</option>
                              ),
                            )}
                          </select>
                        </label>
                        <label className="field">
                          Note (optional)
                          <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                          />
                        </label>
                        <label className="flex gap-3 items-start">
                          <input
                            type="checkbox"
                            checked={accept}
                            onChange={(e) => setAccept(e.target.checked)}
                            className="mt-1"
                          />
                          I understand the withdrawal terms.
                        </label>
                        <div className="flex gap-3">
                          <button
                            className="action"
                            disabled={!accept || busy}
                            onClick={submitWithdrawal}
                          >
                            {busy ? "Submitting…" : "Submit request"}
                          </button>
                          <button
                            className="action secondary"
                            onClick={() => setWithdraw(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    {(selected.payoutSchedule || []).length ? (
                      <div className="data-table">
                        <table>
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Amount</th>
                              <th>Status</th>
                              <th>Reference</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selected.payoutSchedule?.map((p) => (
                              <tr key={p.id}>
                                <td>{p.payoutDate}</td>
                                <td>{formatCurrency(p.amount)}</td>
                                <td>
                                  <Status value={p.status} />
                                </td>
                                <td>{p.reference || "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-neutral-500">
                        No payouts scheduled.
                      </p>
                    )}
                  </section>
                </>
              )}
              <section className="panel flex flex-wrap justify-between gap-4 items-center">
                <div>
                  <h2 className="font-semibold">Investment documents</h2>
                  <p className="text-sm text-neutral-500 mt-1">
                    Your agreement and payment records.
                  </p>
                </div>
                <Link className="action secondary" href="/portal/documents">
                  View documents
                </Link>
              </section>
            </>
          ) : (
            <div className="panel">
              Investment not found.{" "}
              <Link className="underline" href="/portal/investments">
                View your investments
              </Link>
            </div>
          )
        ) : (
          <>
            <div className="flex flex-wrap gap-4 justify-between">
              <div
                className="investor-tabs gold flex flex-wrap gap-2"
                role="group"
                aria-label="Filter by plan"
              >
                {[
                  ["ALL", "All plans"],
                  ["GIAP", "GIAP"],
                  ["WEALTHSTREAM", "WealthStream"],
                ].map(([value, text]) => (
                  <button
                    key={value}
                    className={`action ${filter === value ? "" : "secondary"}`}
                    aria-pressed={filter === value}
                    onClick={() => setFilter(value)}
                  >
                    {text}
                  </button>
                ))}
              </div>
              <label className="field">
                <span className="sr-only">Investment status</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="ALL">All statuses</option>
                  <option value="OPEN">Open investments</option>
                  <option value="CLOSED">Investment history</option>
                </select>
              </label>
            </div>
            <section className="investor-total"><p>Total investment</p><strong>{formatCurrency(all.reduce((sum, i) => sum + i.capital, 0))}</strong></section>
            {filtered.length ? (
              <div className="grid md:grid-cols-2 gap-5">
                {filtered.map((i) => (
                  <Link
                    key={i.id}
                    href={`/portal/investments/${i.id}`}
                    className="panel block hover:border-brand-gold transition-colors"
                  >
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
                      <h2 className="font-semibold">
                        {i.plan === "GIAP" ? "GIAP" : "WealthStream"}
                      </h2>
                      <Status value={i.status} />
                    </div>
                    <p className="text-2xl font-bold">
                      {formatCurrency(i.capital)}
                    </p>
                    <p className="text-sm text-neutral-500 mt-2">
                      {"initialInvestment" in i
                        ? i.linkedPropertyId || i.propertyId
                          ? i.propertyTitle
                          : "Awaiting property allocation"
                        : `${i.annualRate * 100}% p.a. · ${label(i.payoutFrequency)} payouts`}
                    </p>
                    <div className="mt-6 pt-4 border-t flex items-center justify-between gap-2 text-xs text-neutral-500">
                      <span className="break-all">{i.referenceId}</span>
                      <ArrowRight size={18} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="panel text-center py-14">
                <Briefcase size={28} className="mx-auto text-brand-gold mb-4" />
                <h2 className="font-semibold text-xl">
                  {all.length
                    ? "No matching investments"
                    : "Your investments will appear here"}
                </h2>
                <p className="text-sm text-neutral-500 my-3">
                  {all.length
                    ? "Try a different plan or status."
                    : "Choose a plan to get started."}
                </p>
                {!all.length && (
                  <Link className="action mt-3" href="/portal/investments/new">
                    New investment
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </PortalShell>
  );
}
export function Metric({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="min-w-0">
      <p className="text-sm text-neutral-500 mb-2">{title}</p>
      <p className="text-lg sm:text-xl font-semibold break-words capitalize">
        {value}
      </p>
    </div>
  );
}
