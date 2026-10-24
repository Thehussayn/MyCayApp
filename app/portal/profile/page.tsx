"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Status } from "@/components/portal/Investments";
import PortalShell from "@/components/portal/PortalShell";
import { usePortal, request } from "@/components/portal/usePortal";
import { biodataSteps } from "@/lib/kyc/fields";
export default function Profile() {
  const { user } = usePortal();
  const [bio, setBio] = useState<any>(null),
    [error, setError] = useState(""),
    [documents, setDocuments] = useState<any[]>([]);
  useEffect(() => {
    if (user)
      request("/api/portal/biodata")
        .then((d) => setBio(d.biodata))
        .catch((e) => setError(e.message));
    if(user) request("/api/portal/documents").then(d=>setDocuments(d.documents)).catch(e=>setError(e.message));
  }, [user]);
  const needsUpdate = ["INFO_REQUESTED", "REJECTED"].includes(user?.kycStatus || "");
  return (
    <PortalShell user={user} currentTitle="My Profile">
      <div className="max-w-4xl mx-auto space-y-6">
        {error && <p className="error">{error}</p>}
        <div className="investor-profile-card flex flex-wrap justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl">{user?.fullName}</h2><p className="text-xs text-brand-gold mt-2">{user?.referenceId}</p>
            <p className="text-sm text-neutral-500 break-all mt-1">
              {user?.email}
            </p>
          </div>
          <Status value={user?.kycStatus || "NOT_STARTED"}/><Link
            className="action secondary"
            href={bio?.isSubmitted && !needsUpdate ? "/portal/documents" : "/portal/biodata"}
          >
            {needsUpdate ? "Update KYC" : bio?.isSubmitted ? "Manage documents" : "Complete KYC"}
          </Link>
        </div>
        <section className="panel"><h2 className="investor-panel-heading mb-6">Biodata registration</h2><div className="investor-profile-groups">{bio &&
          biodataSteps.slice(0, 6).map((step) => (
            <section key={step.title} className="investor-profile-group">
              <h2 className="font-semibold mb-5">{step.title}</h2>
              <dl className="grid sm:grid-cols-2 gap-5">
                {step.fields.map((f) => (
                  <div key={f.key}>
                    <dt className="text-xs text-neutral-500">{f.label}</dt>
                    <dd className="text-sm mt-1 break-words">
                      {f.key === "bankCode"
                        ? bio.bankName || "—"
                        : bio[f.key] || "—"}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div></section>
        <section className="panel"><div className="investor-panel-heading"><h2>Compliance documents</h2><Link className="investor-text-link" href="/portal/documents">Document Center →</Link></div>{documents.length?documents.map(d=><div className="investor-doc-row" key={d.id}><div><a className="text-sm underline" href={`/api/portal/kyc-files/${d.id}`} target="_blank" rel="noreferrer">{d.fileName}</a><p className="text-xs text-neutral-500 mt-1">{d.documentType.replaceAll("_", " ")}</p></div><Status value={d.status}/></div>):<p className="text-sm text-neutral-500">No documents uploaded.</p>}</section>
        {bio?.isSubmitted && (
          <p className="text-sm text-neutral-500">
            To update verified identity or bank details,{" "}
            <Link className="underline" href="/contact">
              contact support
            </Link>
            .
          </p>
        )}
      </div>
    </PortalShell>
  );
}
