"use client";
import { useState } from "react";

import { Status, label } from "@/components/portal/Investments";

import type { ActionProps } from "./types";

export default function Team({ data, busy, act }: { data: any } & ActionProps) {
  const [form, setForm] = useState({
      fullName: "",
      email: "",
      password: "",
      role: "STAFF",
    }),
    [create, setCreate] = useState(false),
    [resetId, setResetId] = useState(""),
    [password, setPassword] = useState("");
  return (
    <>
      <button className="action" onClick={() => setCreate(!create)}>
        Add team member
      </button>
      {create && (
        <form
          className="panel space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (await act({ action: "CREATE_USER", ...form })) {
              setCreate(false);
              setForm({ fullName: "", email: "", password: "", role: "STAFF" });
            }
          }}
        >
          <div className="grid sm:grid-cols-2 gap-4">
            {["fullName", "email", "password"].map((k) => (
              <label className="field capitalize" key={k}>
                {k === "password"
                  ? "Temporary password"
                  : k.replace(/([A-Z])/g, " $1")}
                <input
                  required
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
            <label className="field">
              Role
              <select
                value={form.role}
                disabled={!data.canAssignRoles}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                {["STAFF", "FINANCE", "ADMIN", "SUPER_ADMIN"].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
          </div>
          <p className="text-sm text-neutral-500">
            Password requires 8 characters, an uppercase letter, a number, and a
            special character.
          </p>
          <button className="action" disabled={busy}>
            Create account
          </button>
        </form>
      )}
      <div className="grid xl:grid-cols-2 gap-4">
        {data.users.map((u: any) => (
          <div className="panel space-y-4" key={u.id}>
            <h2 className="font-semibold capitalize">{u.fullName}</h2>
            <p className="text-sm text-neutral-500 break-all">{u.email}</p>
            <Status value={u.disabled ? "DISABLED" : u.role} />
            <div className="flex flex-wrap gap-3">
              <label className="field">
                <span className="sr-only">Role for {u.fullName}</span>
                <select
                  value={u.role}
                  disabled={!data.canAssignRoles || busy}
                  onChange={(e) =>
                    act({
                      action: "UPDATE_USER",
                      userId: u.id,
                      role: e.target.value,
                      disabled: u.disabled,
                    })
                  }
                >
                  {["STAFF", "FINANCE", "ADMIN", "SUPER_ADMIN"].map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </label>
              <button
                className="action secondary"
                disabled={busy}
                onClick={() =>
                  act({
                    action: "UPDATE_USER",
                    userId: u.id,
                    role: u.role,
                    disabled: !u.disabled,
                  })
                }
              >
                {u.disabled ? "Reactivate" : "Deactivate"}
              </button>
              <button
                className="action secondary"
                onClick={() => {
                  setResetId(resetId === u.id ? "" : u.id);
                  setPassword("");
                }}
              >
                Reset password
              </button>
            </div>
            {resetId === u.id && (
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (
                    await act({
                      action: "RESET_PASSWORD",
                      userId: u.id,
                      password,
                    })
                  ) {
                    setResetId("");
                    setPassword("");
                  }
                }}
              >
                <label className="field">
                  Temporary password
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
                <button className="action" disabled={busy}>
                  Set temporary password
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
