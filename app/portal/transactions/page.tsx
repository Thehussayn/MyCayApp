"use client";
import { useEffect, useState } from "react";
import PortalShell from "@/components/portal/PortalShell";
import { usePortal, request } from "@/components/portal/usePortal";
import { Status } from "@/components/portal/Investments";
import { useMoney } from "@/components/portal/Currency";
export default function Transactions() {
  const money = useMoney();
  const { user } = usePortal();
  const [transactions, setTransactions] = useState<any[]>([]),
    [search, setSearch] = useState(""),
    [filter, setFilter] = useState("ALL"),
    [status, setStatus] = useState("ALL"),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user)
      request("/api/portal/transactions")
        .then((d) => setTransactions(d.transactions))
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
  }, [user]);
  const filtered = transactions.filter(
    (t) =>
      (filter === "ALL" || t.direction === filter) && (status === "ALL" || t.status === status) &&
      `${t.reference} ${t.title}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <PortalShell user={user} currentTitle="Transactions & Receipts">
      <div className="max-w-6xl mx-auto space-y-6">
        {error && <p className="error">{error}</p>}
        <div className="investor-filter-bar flex flex-col sm:flex-row gap-3">
          <label className="field flex-1">
            <span className="sr-only">Search transactions</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transaction or reference"
            />
          </label>
          <label className="field">
            <span className="sr-only">Transaction type</span>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="ALL">All transactions</option>
              <option value="DEBIT">Deposits</option>
              <option value="CREDIT">Payouts</option>
            </select>
          </label>
          <label className="field"><span className="sr-only">Transaction status</span><select value={status} onChange={e => setStatus(e.target.value)}><option value="ALL">All statuses</option>{Array.from(new Set(transactions.map(t => t.status))).map(s => <option key={s}>{s}</option>)}</select></label>
        </div>
        <div className="panel">
          {loading ? (
            <p className="text-sm text-neutral-500">Loading…</p>
          ) : filtered.length ? (
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Reference</th><th>Transaction details</th><th>Plan / Asset</th><th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id}>
                      <td className="text-xs">{t.reference}</td>
                      <td>
                        {t.title}
                        <p className="text-xs text-neutral-500 mt-1">
                          {t.reference}
                        </p>
                      </td>
                      <td>{t.plan || "—"}</td><td className="whitespace-nowrap">{t.date}</td><td className={`whitespace-nowrap ${t.direction === "CREDIT" ? "text-emerald-700" : ""}`}>{t.direction === "CREDIT" ? "+" : ""}{money(t.amount)}</td>
                      <td>
                        <Status value={t.status} />
                      </td>
                      <td>
                        {t.status === "COMPLETED" && (
                          <a
                            className="underline"
                            href={`/api/portal/files/${t.id}`}
                          >
                            Download PDF
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-neutral-500 py-6 text-center">
              {transactions.length
                ? "No matching transactions."
                : "Your deposits and payouts will appear here."}
            </p>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
