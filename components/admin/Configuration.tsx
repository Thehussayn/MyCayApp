"use client";
import { useState, useEffect } from "react";

import { label } from "@/components/portal/Investments";

import { capabilities, defaultPermissions } from "@/lib/platform/permissions";

import type { ActionProps } from "./types";

export default function Configuration({
  data,
  busy,
  act,
  onTitleChange,
}: { data: any; onTitleChange?: (title: string) => void } & ActionProps) {
  const [config, setConfig] = useState(data), [tab,setTab] = useState("plans");
  useEffect(()=>{onTitleChange?.(tab === "plans" ? "Plan settings" : "Role permissions")},[tab,onTitleChange]);
  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        act({ action: "CONFIG", config });
      }}
    >
      <nav className="admin-settings-tabs" aria-label="Settings sections"><button type="button" className={`action ${tab === "plans" ? "active" : "secondary"}`} onClick={()=>setTab("plans")}>Plan settings</button><button type="button" className={`action ${tab === "roles" ? "active" : "secondary"}`} onClick={()=>setTab("roles")}>Role permissions</button></nav>
      {tab === "plans" && <>
      <section className="panel space-y-5"><h2>Plan limits</h2><div className="grid sm:grid-cols-2 gap-5">{[
            ["giapMin", "GIAP minimum (NGN)"],
            ["giapMax", "GIAP maximum (NGN)"],
            ["wealthstreamMin", "WealthStream minimum (NGN)"],
            ["wealthstreamMax", "WealthStream maximum (NGN)"],
          ].map(([key, title]) => (
            <label className="field" key={key}>
              {title}
              <input
                type="number"
                min="0"
                step={key.includes("Rate") ? "0.01" : "1"}
                required
                value={
                  key.includes("Rate")
                    ? Math.round(config[key] * 10000) / 100
                    : config[key]
                }
                onChange={(e) =>
                  setConfig({
                    ...config,
                    [key]:
                      Number(e.target.value) / (key.includes("Rate") ? 100 : 1),
                  })
                }
              />
            </label>
))}</div></section>
      <section className="panel space-y-5"><h2>WealthStream terms</h2><div className="grid sm:grid-cols-2 gap-5">{[
            ["monthlyRate", "Monthly tier annual rate (%)"],
            ["annualRate", "Annual tier annual rate (%)"],
            ["noticeDays", "Withdrawal notice (days)"],
            ["ngnPerUsd", "NGN per 1 USD"],
          ].map(([key, title]) => (
            <label className="field" key={key}>
              {title}
              <input
                type="number"
                min="0"
                step={key.includes("Rate") ? "0.01" : "1"}
                required
                value={
                  key.includes("Rate")
                    ? Math.round(config[key] * 10000) / 100
                    : config[key]
                }
                onChange={(e) =>
                  setConfig({
                    ...config,
                    [key]:
                      Number(e.target.value) / (key.includes("Rate") ? 100 : 1),
                  })
                }
              />
            </label>
))}</div></section>
      <section className="panel space-y-5"><h2>Account investment rules</h2>        {[
          ["allowMultipleInvestments", "Allow multiple active investments"],
          ["allowMultiplePlans", "Allow both plan types on one account"],
        ].map(([key, title]) => (
          <label key={key} className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="admin-rule-checkbox"
              checked={config[key]}
              onChange={(e) =>
                setConfig({ ...config, [key]: e.target.checked })
              }
            />
            {title}
          </label>
        ))}
</section></>}
      {tab === "roles" &&       <div className="panel space-y-5">
        <h2 className="font-semibold">Role permissions</h2>
        <p className="text-sm text-neutral-500">
          Super Admin retains full access. Changes apply immediately.
        </p>
        <div className="grid gap-4 sm:hidden">
          {["STAFF", "FINANCE", "ADMIN"].map((r) => {
            const list =
              config.permissions[r] ||
              defaultPermissions[r as keyof typeof defaultPermissions];
            return (
              <div key={r} className="border rounded-xl p-4 space-y-4">
                <h3 className="font-semibold capitalize">{label(r)}</h3>
                {capabilities.map((c) => (
                  <label
                    key={c}
                    className="flex items-center justify-between gap-3 text-sm capitalize"
                  >
                    {c}
                    <input
                      type="checkbox"
                      checked={list.includes(c)}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          permissions: {
                            ...config.permissions,
                            [r]: e.target.checked
                              ? [...list, c]
                              : list.filter((p: string) => p !== c),
                          },
                        })
                      }
                    />
                  </label>
                ))}
              </div>
            );
          })}
        </div>
        <div className="data-table hidden sm:block">
          <table>
            <thead>
              <tr>
                <th>Capability</th>
                {["STAFF", "FINANCE", "ADMIN"].map((r) => (
                  <th key={r}>{label(r)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {capabilities.map((c) => (
                <tr key={c}>
                  <td className="capitalize">{c}</td>
                  {["STAFF", "FINANCE", "ADMIN"].map((r) => {
                    const list =
                      config.permissions[r] ||
                      defaultPermissions[r as keyof typeof defaultPermissions];
                    return (
                      <td key={r}>
                        <input
                          type="checkbox"
                          aria-label={`${r}: ${c}`}
                          checked={list.includes(c)}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              permissions: {
                                ...config.permissions,
                                [r]: e.target.checked
                                  ? [...list, c]
                                  : list.filter((p: string) => p !== c),
                              },
                            })
                          }
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      }
      <button className="action" disabled={busy}>
        Save settings
      </button>
    </form>
  );
}
