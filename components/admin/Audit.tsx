"use client";
import { useState } from "react";
import { label } from "@/components/portal/Investments";
import { exportCsv } from "./csv";

export default function Audit({ logs, compact = false }: { logs: any[]; compact?: boolean }) {
  const [search, setSearch] = useState("");
  const filtered = logs.filter(l => `${l.actorEmail} ${l.targetUserEmail} ${l.action} ${l.notes} ${l.reason} ${l.timestamp}`.toLowerCase().includes(search.toLowerCase()));
  const searchField = <label className="field"><span className="sr-only">Search audit trail</span><input placeholder="Search person, action, or date" value={search} onChange={e => setSearch(e.target.value)} /></label>;
  const exportButton = <button className="action secondary" onClick={() => exportCsv("audit.csv", [["Time", "Actor", "Role", "Target", "Action", "Notes"], ...filtered.map(l => [l.timestamp, l.actorEmail, l.actorRole, l.targetUserEmail, l.action, l.notes || l.reason])])}>Export CSV</button>;
  return <div className="space-y-6">
    {!compact && <div className="admin-audit-toolbar">{searchField}{exportButton}</div>}
    <section className="panel space-y-5">
      <div className="admin-audit-heading"><h2>Audit trail</h2>{compact && <div className="admin-audit-toolbar">{searchField}{exportButton}</div>}</div>
      <div className="data-table"><table><thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Investor / target</th><th>Details</th></tr></thead><tbody>{filtered.map(l => <tr key={l.id}>
        <td className="whitespace-nowrap">{new Date(l.timestamp).toLocaleString()}</td><td className="break-words">{l.actorEmail}<small className="block capitalize text-neutral-500">{label(l.actorRole)}</small></td><td className="capitalize">{label(l.action)}</td><td className="break-words">{l.targetUserEmail}</td><td className="min-w-[220px] max-w-md break-words">{l.notes || l.reason}</td>
      </tr>)}</tbody></table></div>
      {!filtered.length && <p className="text-sm text-neutral-500">No matching activity.</p>}
    </section>
  </div>;
}
