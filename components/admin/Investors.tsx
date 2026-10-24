"use client";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Metric, Status, label } from "@/components/portal/Investments";
import { formatCurrency as money } from "@/lib/utils";

import { exportCsv } from "./csv";
import type { ActionProps } from "./types";
import DirectProfile from "./DirectProfile";
import Audit from "./Audit";
export default function Investors({
  data,
  canReview,
  busy,
  act,
}: { data: any; canReview: boolean } & ActionProps) {
  const [query, setQuery] = useState(""),
    [status, setStatus] = useState("ALL"),
    [selectedId, setSelectedId] = useState(""),
    [reason, setReason] = useState(""),
    [create, setCreate] = useState(false),
    [edit, setEdit] = useState<any>(null),
    [form, setForm] = useState({
      fullName: "",
      email: "",
      phone: "",
      country: "Nigeria",
      password: "",
    });
  const selected = data.investors.find((u: any) => u.id === selectedId);
  const investors = data.investors.filter(
    (u: any) =>
      (status === "ALL" || (u.kycStatus || "NOT_STARTED") === status) &&
      `${u.fullName} ${u.email} ${u.phone} ${u.country} ${u.referenceId}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  if (selected)
    return (
      <div className="space-y-5">
        <button
          className="inline-flex gap-2 text-sm items-center"
          onClick={() => {
            setSelectedId("");
            setEdit(null);
          }}
        >
          <ArrowLeft size={16} />
          Investors
        </button>
        <div className="panel space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">{selected.fullName}</h2>
              <p className="text-sm text-neutral-500 break-all mt-1">
                {selected.email} · {selected.referenceId}
              </p>
            </div>
            <Status value={selected.kycStatus || "NOT_STARTED"} />
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            <Metric title="Phone" value={selected.phone || "—"} />
            <Metric title="Country" value={selected.country} />
            <Metric title="Verification" value={label(selected.kycStatus)} />
          </div>
          {canReview && selected.biodata?.isSubmitted && selected.kycStatus !== "APPROVED" && (
            <>
              <label className="field">
                Review note
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for a decline or request for information"
                />
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  ["APPROVED", "Approve KYC"],
                  ["INFO_REQUESTED", "Request information"],
                  ["DECLINED", "Reject KYC"],
                ].map(([s, t]) => (
                  <button
                    key={s}
                    className={`action ${s === "APPROVED" ? "" : "secondary"}`}
                    disabled={busy}
                    onClick={() =>
                      act({
                        action: "REVIEW",
                        userId: selected.id,
                        status: s,
                        reason,
                      })
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <section className="panel space-y-5">
          <div className="flex justify-between gap-3">
            <h2 className="font-semibold">Profile</h2>
            {selected.biodata && canReview && (
              <button
                className="text-sm underline"
                onClick={() => setEdit(edit ? null : { ...selected.biodata })}
              >
                {edit ? "Cancel" : "Edit contact details"}
              </button>
            )}
          </div>
          {selected.biodata ? (
            <>
              {edit ? (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      "phone",
                      "residentialAddress",
                      "city",
                      "stateProvince",
                      "postalCode",
                      "employerName",
                      "jobTitle",
                      "businessAddress",
                      "nokFullName",
                      "nokPhone",
                      "nokAddress",
                    ].map((k) => (
                      <label key={k} className="field capitalize">
                        {k.replace(/([A-Z])/g, " $1")}
                        <input
                          value={edit[k] || ""}
                          onChange={(e) =>
                            setEdit({ ...edit, [k]: e.target.value })
                          }
                        />
                      </label>
                    ))}
                  </div>
                  <button
                    className="action"
                    disabled={busy}
                    onClick={async () => {
                      if (
                        await act({
                          action: "SAVE_BIODATA",
                          userId: selected.id,
                          data: edit,
                        })
                      )
                        setEdit(null);
                    }}
                  >
                    Save profile
                  </button>
                </>
              ) : (
                <dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Object.entries(selected.biodata)
                    .filter(
                      ([k]) =>
                        ![
                          "id",
                          "userId",
                          "completedSteps",
                          "currentStep",
                          "createdAt",
                          "updatedAt",
                        ].includes(k),
                    )
                    .map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-xs text-neutral-500 capitalize">
                          {k.replace(/([A-Z])/g, " $1")}
                        </dt>
                        <dd className="text-sm mt-1 break-words">
                          {Array.isArray(v) ? v.join(", ") : String(v ?? "—")}
                        </dd>
                      </div>
                    ))}
                </dl>
              )}
            </>
          ) : (
            <p className="text-sm text-neutral-500">Profile not started.</p>
          )}
          {canReview && (
            <DirectProfile investor={selected} busy={busy} act={act} />
          )}
        </section>
        <section className="panel space-y-5">
          <h2 className="font-semibold">Verification documents</h2>
          {selected.documents.length ? (
            selected.documents.map((d: any) => (
              <div key={d.id} className="border rounded-xl p-4 space-y-4">
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold capitalize">
                      {label(d.documentType)}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 break-all">
                      {d.fileName}
                    </p>
                  </div>
                  <Status value={d.status} />
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    className="action secondary"
                    href={`/api/portal/kyc-files/${d.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View document
                  </a>
                  {canReview && selected.biodata?.isSubmitted &&
                    [
                      ["APPROVED", "Approve"],
                      ["INFO_REQUESTED", "Request replacement"],
                      ["REJECTED", "Reject"],
                    ].map(([s, t]) => (
                      <button
                        key={s}
                        disabled={busy}
                        className="action secondary"
                        onClick={() =>
                          act({
                            action: "DOCUMENT",
                            userId: selected.id,
                            documentId: d.id,
                            status: s,
                            reason,
                          })
                        }
                      >
                        {t}
                      </button>
                    ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-neutral-500">No documents uploaded.</p>
          )}
          <p className="text-xs text-neutral-500">
            Use the review note above when requesting a replacement or rejecting
            a document.
          </p>
        </section>
        <section className="panel space-y-4">
          <h2 className="font-semibold">Investments</h2>
          {selected.investments.map((i: any) => (
            <div
              key={i.id}
              className="flex flex-wrap gap-3 justify-between border-b py-3"
            >
              <span>
                {i.referenceId} · {money(i.capitalKobo / 100)}
              </span>
              <Status value={i.status} />
            </div>
          ))}
          {!selected.investments.length && (
            <p className="text-sm text-neutral-500">No investments.</p>
          )}
        </section>
        <section className="panel space-y-4">
          <h2 className="font-semibold">Communication log</h2>
          <label className="field">
            Message or internal note
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              className="action"
              disabled={busy || !reason.trim()}
              onClick={async () => {
                if (await act({ action: "NOTE", userId: selected.id, reason }))
                  setReason("");
              }}
            >
              Save internal note
            </button>
            <button
              className="action secondary"
              disabled={busy || !reason.trim()}
              onClick={async () => {
                if (
                  await act({ action: "NOTIFY", userId: selected.id, reason })
                )
                  setReason("");
              }}
            >
              Send in-app message
            </button>
          </div>
          {selected.notes.map((n: any) => (
            <div className="border-t pt-4" key={n.id}>
              <p className="text-sm whitespace-pre-wrap">{n.note}</p>
              <p className="text-xs text-neutral-500 mt-2">
                {n.author} · {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </section>
        <Audit logs={selected.audit} />
      </div>
    );
  return (
    <>
      <div className="flex flex-wrap gap-3">
        <label className="field flex-1">
          <span className="sr-only">Search investors</span>
          <input
            placeholder="Search name, email, phone, country"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="sr-only">Filter status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {[
              "ALL",
              "NOT_STARTED",
              "BIODATA_IN_PROGRESS",
              "APPROVED",
              "INFO_REQUESTED",
              "REJECTED",
              "SUBMITTED",
              "UNDER_REVIEW",
            ].map((s) => (
              <option key={s} value={s}>
                {label(s)}
              </option>
            ))}
          </select>
        </label>
        <button
          className="action secondary"
          onClick={() =>
            exportCsv("investors.csv", [
              ["Name", "Email", "Phone", "Country", "Status", "KYC"],
              ...investors.map((u: any) => [
                u.fullName,
                u.email,
                u.phone,
                u.country,
                u.status,
                u.kycStatus,
              ]),
            ])
          }
        >
          Export CSV
        </button>
        <button className="action" onClick={() => setCreate(!create)}>
          Add investor
        </button>
      </div>
      {create && (
        <form
          className="panel space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            if (await act({ action: "CREATE_INVESTOR", ...form })) {
              setCreate(false);
              setForm({
                fullName: "",
                email: "",
                phone: "",
                country: "Nigeria",
                password: "",
              });
            }
          }}
        >
          <h2 className="font-semibold">Create an investor account</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.keys(form).map((k) => (
              <label className="field capitalize" key={k}>
                {k === "password"
                  ? "Temporary password"
                  : k.replace(/([A-Z])/g, " $1")}
                <input
                  required={!["phone"].includes(k)}
                  type={
                    k === "password"
                      ? "password"
                      : k === "email"
                        ? "email"
                        : "text"
                  }
                  value={(form as any)[k]}
                  onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                />
              </label>
            ))}
          </div>
          <p className="text-sm text-neutral-500">
            The investor must change their temporary password and complete
            verification before investing.
          </p>
          <button disabled={busy} className="action">
            Create account
          </button>
        </form>
      )}
      <div className="panel !p-0 overflow-hidden">
        <div className="overflow-x-auto" role="region" aria-label="Investor directory" tabIndex={0}>
          <table className="w-full min-w-[760px] text-sm text-left">
            <caption className="sr-only">Investors and submitted KYC status</caption>
            <thead className="bg-neutral-50 text-xs text-neutral-500">
              <tr>{["Investor", "Email", "Country", "KYC status", "Registered", ""].map((heading) => <th key={heading} scope="col" className="p-4 font-medium">{heading}</th>)}</tr>
            </thead>
            <tbody className="divide-y">
              {investors.map((u: any) => (
                <tr key={u.id} className="hover:bg-neutral-50">
                  <th scope="row" className="p-4 font-medium"><button className="text-left underline underline-offset-4" onClick={() => { setSelectedId(u.id); setReason(""); }}>{u.fullName}</button><p className="text-xs text-neutral-500 font-normal mt-1">{u.referenceId}</p></th>
                  <td className="p-4">{u.email}</td><td className="p-4">{u.country}</td>
                  <td className="p-4"><Status value={u.kycStatus || "NOT_STARTED"} /></td>
                  <td className="p-4 whitespace-nowrap">{new Date(u.createdAt).toLocaleDateString("en-GB")}</td>
                  <td className="p-4"><button className="action secondary whitespace-nowrap" aria-label={`View ${u.fullName}`} onClick={() => { setSelectedId(u.id); setReason(""); }}>View investor</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {!investors.length && (
        <div className="panel text-sm text-neutral-500">
          No investors match this view.
        </div>
      )}
    </>
  );
}
