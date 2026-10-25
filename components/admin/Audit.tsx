"use client";
import { useState } from "react";

import { label } from "@/components/portal/Investments";

import { exportCsv } from "./csv";

export default function Audit({ logs }: { logs: any[] }) {
  const [search, setSearch] = useState("");
  const filtered = logs.filter((l) =>
    `${l.actorEmail} ${l.targetUserEmail} ${l.action} ${l.notes} ${l.timestamp}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <div className="space-y-6">
      <label className="field">
        <span>Search audit trail</span>
        <input
          placeholder="Search person, action, or date"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
    <section className="panel space-y-5">
      <div className="flex flex-wrap gap-3 justify-between">
        <h2 className="font-semibold">Audit trail</h2>

      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Investor / target</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id}>
                <td className="whitespace-nowrap">
                  {new Date(l.timestamp).toLocaleString()}
                </td>
                <td>
                  {l.actorEmail}
                  <small className="block capitalize text-neutral-500">
                    {label(l.actorRole)}
                  </small>
                </td>
                <td className="capitalize">{label(l.action)}</td>
                <td>{l.targetUserEmail}</td>
                <td className="min-w-[220px] max-w-md break-words">
                  {l.notes || l.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!filtered.length && (
        <p className="text-sm text-neutral-500">No matching activity.</p>
      )}
    </section>
        <button
          className="action secondary"
          onClick={() =>
            exportCsv("audit.csv", [
              ["Time", "Actor", "Role", "Target", "Action", "Notes"],
              ...filtered.map((l) => [
                l.timestamp,
                l.actorEmail,
                l.actorRole,
                l.targetUserEmail,
                l.action,
                l.notes,
              ]),
            ])
          }
        >
          Export CSV
        </button>
    </div>
  );
}
