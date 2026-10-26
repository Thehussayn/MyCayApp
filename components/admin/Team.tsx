"use client";
import { useEffect, useState } from "react";
import { Status, label } from "@/components/portal/Investments";
import type { ActionProps } from "./types";

const roles = ["STAFF", "FINANCE", "ADMIN", "SUPER_ADMIN"];
export default function Team({ data, busy, act }: { data: any } & ActionProps) {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "STAFF" });
  const [create, setCreate] = useState(false), [selectedId, setSelectedId] = useState(data.users[0]?.id || ""), [role, setRole] = useState(data.users[0]?.role || "STAFF"), [reset, setReset] = useState(false), [password, setPassword] = useState("");
  const selected = data.users.find((u: any) => u.id === selectedId);
  useEffect(() => { if (!selected && data.users.length) setSelectedId(data.users[0].id); }, [data.users, selected]);
  useEffect(() => { setRole(selected?.role || "STAFF"); setReset(false); setPassword(""); }, [selectedId, selected?.role]);
  return <>
    <div className="admin-team-actions"><button className="action" onClick={() => setCreate(!create)}>{create ? "Cancel" : "Add team member"}</button></div>
    {create && <form className="panel space-y-5" onSubmit={async e => {e.preventDefault();if(await act({action:"CREATE_USER",...form})){setCreate(false);setForm({fullName:"",email:"",password:"",role:"STAFF"});}}}>
      <h2>Add team member</h2><div className="grid sm:grid-cols-2 gap-5">{["fullName","email","password"].map(k => <label className="field capitalize" key={k}>{k === "password" ? "Temporary password" : k.replace(/([A-Z])/g," $1")}<input required type={k === "password" ? "password" : k === "email" ? "email" : "text"} value={(form as any)[k]} onChange={e => setForm({...form,[k]:e.target.value})}/></label>)}<label className="field">Role<select value={form.role} disabled={!data.canAssignRoles} onChange={e => setForm({...form,role:e.target.value})}>{roles.map(r => <option key={r} value={r}>{label(r)}</option>)}</select></label></div>
      <p className="text-sm text-neutral-500">Use at least 8 characters, an uppercase letter, a number, and a special character.</p><button className="action" disabled={busy}>Create account</button>
    </form>}
    <section className="panel"><h2 className="mb-5">Team accounts</h2><div className="data-table"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead><tbody>{data.users.map((u: any) => <tr key={u.id} className={selectedId === u.id ? "admin-team-selected" : ""}><td><button className="font-bold hover:underline" aria-label={`Manage ${u.fullName}`} onClick={() => setSelectedId(u.id)}>{u.fullName}</button></td><td>{u.email}</td><td className="capitalize">{label(u.role)}</td><td><Status value={u.disabled ? "DISABLED" : "ACTIVE"}/></td></tr>)}</tbody></table></div>{!data.users.length && <p className="py-5 text-sm text-neutral-500">No team accounts.</p>}</section>
    {selected && <section className="panel admin-team-access space-y-5"><h2>Manage account access</h2><div className="grid sm:grid-cols-2 gap-5"><label className="field">Team member<select value={selectedId} onChange={e => setSelectedId(e.target.value)}>{data.users.map((u: any) => <option key={u.id} value={u.id}>{u.fullName}</option>)}</select></label><label className="field">Role<select aria-label={`Role for ${selected.fullName}`} value={role} disabled={!data.canAssignRoles || busy} onChange={e => setRole(e.target.value)}>{roles.map(r => <option key={r} value={r}>{label(r)}</option>)}</select></label></div><div className="flex flex-wrap gap-3">
      <button className="action" disabled={busy || !data.canAssignRoles || role === selected.role} onClick={() => act({action:"UPDATE_USER",userId:selected.id,role,disabled:selected.disabled})}>Save access</button>
      <button className="action secondary" disabled={busy} onClick={() => {setReset(!reset);setPassword("");}}>Reset password</button>
      <button className="action secondary" disabled={busy} onClick={() => act({action:"UPDATE_USER",userId:selected.id,role:selected.role,disabled:!selected.disabled})}>{selected.disabled ? "Reactivate account" : "Deactivate account"}</button>
    </div>{reset && <form className="space-y-4" onSubmit={async e => {e.preventDefault();if(await act({action:"RESET_PASSWORD",userId:selected.id,password})){setReset(false);setPassword("");}}}><label className="field">Temporary password<input type="password" required value={password} onChange={e => setPassword(e.target.value)}/></label><button className="action" disabled={busy}>Set temporary password</button></form>}</section>}
  </>;
}
