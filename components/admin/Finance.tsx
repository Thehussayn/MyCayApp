"use client";
import { useState } from "react";

import { Metric, Status, label } from "@/components/portal/Investments";
import { formatCurrency as money } from "@/lib/utils";

import { exportCsv } from "./csv";
import type { ActionProps } from "./types";

export default function Finance({
  data,
  busy,
  act,
}: { data: any } & ActionProps) {
  const [tab, setTab] = useState("ledger"),
    [selected, setSelected] = useState(""),
    [reference, setReference] = useState(""),
    [reason, setReason] = useState(""),
    [allocation, setAllocation] = useState({
      propertyName: "",
      location: "",
      valuation: "",
    }),
    [salePrice, setSalePrice] = useState(""),
    [rate, setRate] = useState(String(data.ngnPerUsd || "")),
    [matches, setMatches] = useState<any[]>([]),
    [parseError, setParseError] = useState("");
  const name = (id: string) =>
    data.investors.find((u: any) => u.id === id)?.fullName || id;
  const investments = [
    ...data.giap.map((i: any) => ({ ...i, plan: "GIAP" })),
    ...data.wealthStream.map((i: any) => ({ ...i, plan: "WealthStream" })),
  ];
  const bank = (id: string) => {
    const b = data.investors.find((u: any) => u.id === id)?.payoutBank;
    return b
      ? `${b.name} · ${b.accountNumber} · ${b.accountHolder}`
      : "Bank details not provided";
  };
  const current = investments.find((i: any) => i.id === selected);
  const today = new Date().toISOString().slice(0, 10);
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {["ledger", "payouts", "withdrawals", "reconciliation", "reports"].map(
          (t) => (
            <button
              key={t}
              className={`action capitalize ${tab === t ? "" : "secondary"}`}
              onClick={() => {
                setTab(t);
                setSelected("");
                setReference("");
              }}
            >
              {t}
            </button>
          ),
        )}
      </div>
      {tab === "ledger" && (
        <>
          <div className="panel">
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Investor</th>
                    <th>Plan</th>
                    <th>Capital</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((i: any) => (
                    <tr key={i.id}>
                      <td>{name(i.userId)}</td>
                      <td>
                        {i.plan}
                        <small className="block text-neutral-500">
                          {i.referenceId}
                        </small>
                      </td>
                      <td>{money(i.capitalKobo / 100)}</td>
                      <td>
                        <Status value={i.status} />
                      </td>
                      <td>
                        <button
                          className="underline"
                          onClick={() => {
                            setSelected(i.id);
                            setReference("");
                          }}
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!investments.length && (
              <p className="text-sm text-neutral-500 py-4">
                No investments funded yet.
              </p>
            )}
          </div>
          {current && (
            <section className="panel space-y-5">
              <h2 className="font-semibold">
                {current.referenceId} · {name(current.userId)}
              </h2>
              {current.plan === "GIAP" ? (
                <>
                  {current.status === "FUNDED" && (
                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        act({
                          action: "ALLOCATE",
                          investmentId: current.id,
                          ...allocation,
                        });
                      }}
                    >
                      <h3 className="font-medium">
                        Assign property and deploy funds
                      </h3>
                      <div className="grid sm:grid-cols-3 gap-4">
                        {Object.keys(allocation).map((k) => (
                          <label className="field capitalize" key={k}>
                            {k.replace(/([A-Z])/g, " $1")}
                            <input
                              required
                              type={k === "valuation" ? "number" : "text"}
                              value={(allocation as any)[k]}
                              onChange={(e) =>
                                setAllocation({
                                  ...allocation,
                                  [k]: e.target.value,
                                })
                              }
                            />
                          </label>
                        ))}
                      </div>
                      <button className="action" disabled={busy}>
                        Assign & activate
                      </button>
                    </form>
                  )}
                  {current.status === "ACTIVE" && (
                    <>
                      <p className="text-sm">
                        {current.propertyTitle} · {current.propertyLocation}
                      </p>
                      <button
                        className="action"
                        disabled={busy}
                        onClick={() =>
                          act({
                            action: "LIST_RESALE",
                            investmentId: current.id,
                          })
                        }
                      >
                        List for resale
                      </button>
                    </>
                  )}
                  {current.status === "LISTED_FOR_RESALE" && (
                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        act({
                          action: "SELL",
                          investmentId: current.id,
                          salePrice,
                        });
                      }}
                    >
                      <label className="field">
                        Sale price (NGN)
                        <input
                          type="number"
                          required
                          min={current.initialInvestment}
                          value={salePrice}
                          onChange={(e) => setSalePrice(e.target.value)}
                        />
                      </label>
                      {Number(salePrice) >= current.initialInvestment && (
                        <p className="text-sm">
                          Investor payout:{" "}
                          {money(
                            current.initialInvestment +
                              (Number(salePrice) - current.initialInvestment) *
                                0.7,
                          )}
                        </p>
                      )}
                      <button className="action" disabled={busy}>
                        Record sale & create payout
                      </button>
                    </form>
                  )}
                  {["READY_FOR_PAYOUT", "CLOSED"].includes(current.status) && (
                    <p className="text-sm">
                      {current.status === "CLOSED"
                        ? "Sale payout completed."
                        : "The sale payout is in the payouts queue."}
                    </p>
                  )}
                </>
              ) : (
                <div className="grid sm:grid-cols-3 gap-5">
                  <Metric
                    title="Annual return"
                    value={`${current.annualRate * 100}%`}
                  />
                  <Metric
                    title="Next payout"
                    value={money(current.nextPayoutAmount)}
                  />
                  <Metric
                    title="Next date"
                    value={current.nextPayoutDate || "—"}
                  />
                </div>
              )}
            </section>
          )}
        </>
      )}
      {tab === "payouts" && (
        <div className="space-y-4">
          {data.payouts
            .filter((p: any) => p.status !== "COMPLETED")
            .sort((a: any, b: any) => a.payoutDate.localeCompare(b.payoutDate))
            .map((p: any) => (
              <div className="panel space-y-4" key={p.id}>
                <div className="flex flex-wrap gap-3 justify-between">
                  <div>
                    <h2 className="font-semibold">
                      {money(p.amount)} · {name(p.userId)}
                    </h2>
                    <p className="text-sm text-neutral-500 mt-1">
                      {p.payoutDate} ·{" "}
                      {
                        investments.find((i: any) => i.id === p.investmentId)
                          ?.referenceId
                      }
                    </p>
                  </div>
                  <Status value={p.payoutDate <= today ? "DUE" : "SCHEDULED"} />
                </div>
                <p className="text-sm text-neutral-500 break-words">
                  {bank(p.userId)}
                </p>
                {selected === p.id ? (
                  <form
                    className="flex flex-wrap items-end gap-3"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (
                        await act({
                          action: "PAY_PAYOUT",
                          payoutId: p.id,
                          reference,
                        })
                      ) {
                        setSelected("");
                        setReference("");
                      }
                    }}
                  >
                    <label className="field flex-1">
                      Completed bank transfer reference
                      <input
                        required
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                      />
                    </label>
                    <button className="action" disabled={busy}>
                      Record completed payout
                    </button>
                  </form>
                ) : (
                  p.payoutDate <= today && (
                    <button
                      className="action secondary"
                      onClick={() => {
                        setSelected(p.id);
                        setReference("");
                      }}
                    >
                      Record transfer
                    </button>
                  )
                )}
              </div>
            ))}
          {!data.payouts.some((p: any) => p.status !== "COMPLETED") && (
            <div className="panel text-sm text-neutral-500">
              No payouts scheduled.
            </div>
          )}
        </div>
      )}
      {tab === "withdrawals" && (
        <div className="space-y-4">
          {data.withdrawals.map((w: any) => (
            <section className="panel space-y-4" key={w.id}>
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <h2 className="font-semibold">
                    {name(w.userId)} · {money(w.principal)}
                  </h2>
                  <p className="text-sm text-neutral-500 mt-2">
                    {w.reason}
                    {w.note ? ` · ${w.note}` : ""}
                  </p>
                </div>
                <Status value={w.status} />
              </div>
              <p className="text-sm text-neutral-500 break-words">
                {bank(w.userId)}
              </p>
              {["PENDING_REVIEW", "PENDING_INFORMATION"].includes(w.status) && (
                <>
                  <label className="field">
                    Review note
                    <textarea
                      value={selected === w.id ? reason : ""}
                      onChange={(e) => {
                        setSelected(w.id);
                        setReason(e.target.value);
                      }}
                    />
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      ["APPROVE", "Approve & start notice"],
                      ["REQUEST_INFO", "Request information"],
                      ["REJECT", "Reject"],
                    ].map(([d, t]) => (
                      <button
                        className="action secondary"
                        disabled={busy}
                        key={d}
                        onClick={() =>
                          act({
                            action: "REVIEW_WITHDRAWAL",
                            withdrawalId: w.id,
                            decision: d,
                            reason: selected === w.id ? reason : "",
                          })
                        }
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {w.status === "IN_NOTICE_PERIOD" && (
                <>
                  <p className="text-sm">
                    Principal return due: {w.noticeEndDate?.slice(0, 10)}
                  </p>
                  {new Date(w.noticeEndDate) <= new Date() && (
                    <form
                      className="flex flex-wrap items-end gap-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        act({
                          action: "RETURN_PRINCIPAL",
                          withdrawalId: w.id,
                          reference: selected === w.id ? reference : "",
                        });
                      }}
                    >
                      <label className="field flex-1">
                        Completed transfer reference
                        <input
                          required
                          value={selected === w.id ? reference : ""}
                          onChange={(e) => {
                            setSelected(w.id);
                            setReference(e.target.value);
                          }}
                        />
                      </label>
                      <button className="action" disabled={busy}>
                        Confirm principal returned
                      </button>
                    </form>
                  )}
                </>
              )}
            </section>
          ))}
          {!data.withdrawals.length && (
            <div className="panel text-sm text-neutral-500">
              No withdrawal requests.
            </div>
          )}
        </div>
      )}
      {tab === "reconciliation" && (
        <section className="panel space-y-5">
          <h2 className="font-semibold">Match bank transactions</h2>
          <p className="text-sm text-neutral-500">
            Upload a CSV with reference and amount columns. Amounts should be in
            NGN.
          </p>
          <label className="field">
            Bank statement CSV
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setParseError("");
                try {
                  const text = await file.text();
                  const rows = parseCsv(text);
                  const headers =
                    rows.shift()?.map((x) => x.trim().toLowerCase()) || [];
                  const ri = headers.indexOf("reference"),
                    ai = headers.indexOf("amount");
                  if (ri < 0 || ai < 0)
                    throw Error("The CSV needs reference and amount columns.");
                  setMatches(
                    rows
                      .filter((r) => r.some(Boolean))
                      .map((row) => {
                        const ref = row[ri]?.trim(),
                          amount = Number(row[ai]?.replaceAll(",", ""));
                        if (!ref || !Number.isFinite(amount))
                          throw Error(
                            "A row has an invalid reference or amount.",
                          );
                        return {
                          reference: ref,
                          amount,
                          matched: data.transactions.some(
                            (t: any) =>
                              t.reference === ref &&
                              Math.abs(t.amount - amount) < 0.005,
                          ),
                        };
                      }),
                  );
                } catch (err) {
                  setParseError((err as Error).message);
                  setMatches([]);
                }
              }}
            />
          </label>
          {parseError && <p className="error">{parseError}</p>}
          {matches.length > 0 && (
            <>
              <p className="text-sm">
                {matches.filter((m) => m.matched).length} matched ·{" "}
                {matches.filter((m) => !m.matched).length} unmatched
              </p>
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Amount</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((m, i) => (
                      <tr key={i}>
                        <td>{m.reference}</td>
                        <td>{money(m.amount)}</td>
                        <td>{m.matched ? "Matched" : "Unmatched"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                className="action secondary"
                onClick={() =>
                  exportCsv("reconciliation.csv", [
                    ["Reference", "Amount", "Matched"],
                    ...matches.map((m) => [m.reference, m.amount, m.matched]),
                  ])
                }
              >
                Export results
              </button>
            </>
          )}
        </section>
      )}
      {tab === "reports" && (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="panel">
              <Metric
                title="Capital under management"
                value={money(
                  investments
                    .filter(
                      (i: any) =>
                        !["CLOSED", "COMPLETED", "EXITED"].includes(i.status),
                    )
                    .reduce((s: number, i: any) => s + i.capitalKobo / 100, 0),
                )}
              />
            </div>
            <div className="panel">
              <Metric
                title="Completed payouts"
                value={money(
                  data.transactions
                    .filter((t: any) => t.direction === "CREDIT")
                    .reduce((s: number, t: any) => s + t.amount, 0),
                )}
              />
            </div>
          </div>
          <section className="panel space-y-5">
            <h2 className="font-semibold">Reports</h2>
            <div className="flex flex-wrap gap-3">
              <button
                className="action secondary"
                onClick={() =>
                  exportCsv("investment-ledger.csv", [
                    ["Reference", "Investor", "Plan", "Capital", "Status"],
                    ...investments.map((i: any) => [
                      i.referenceId,
                      name(i.userId),
                      i.plan,
                      i.capitalKobo / 100,
                      i.status,
                    ]),
                  ])
                }
              >
                Investment ledger CSV
              </button>
              <button
                className="action secondary"
                onClick={() =>
                  exportCsv("transactions.csv", [
                    [
                      "Date",
                      "Reference",
                      "Investor",
                      "Type",
                      "Amount",
                      "Status",
                    ],
                    ...data.transactions.map((t: any) => [
                      t.date,
                      t.reference,
                      name(t.userId),
                      t.type,
                      t.amount,
                      t.status,
                    ]),
                  ])
                }
              >
                Transactions CSV
              </button>
              <a
                className="action secondary"
                href="/api/admin/report"
                target="_blank"
                rel="noreferrer"
              >
                Download report PDF
              </a>
            </div>
          </section>
          <form
            className="panel space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              act({ action: "FX", rate });
            }}
          >
            <label className="field">
              NGN per 1 USD
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </label>
            <button className="action" disabled={busy}>
              Update exchange rate
            </button>
          </form>
        </>
      )}
    </>
  );
}
function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [],
    cell = "",
    quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else quoted = !quoted;
    } else if (c === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if (c === "\n" && !quoted) {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (quoted) throw Error("The CSV has an unclosed quoted field.");
  if (cell || row.length) {
    row.push(cell.replace(/\r$/, ""));
    rows.push(row);
  }
  return rows;
}
