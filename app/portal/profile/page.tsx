"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PortalShell from "@/components/portal/PortalShell";
import { usePortal, request } from "@/components/portal/usePortal";
import { biodataSteps } from "@/lib/kyc/fields";
export default function Profile() {
  const { user } = usePortal();
  const [bio, setBio] = useState<any>(null),
    [error, setError] = useState("");
  useEffect(() => {
    if (user)
      request("/api/portal/biodata")
        .then((d) => setBio(d.biodata))
        .catch((e) => setError(e.message));
  }, [user]);
  return (
    <PortalShell user={user} currentTitle="Profile">
      <div className="max-w-4xl mx-auto space-y-6">
        {error && <p className="error">{error}</p>}
        <div className="panel flex flex-wrap justify-between items-center gap-4">
          <div>
            <h2 className="font-semibold text-xl">{user?.fullName}</h2>
            <p className="text-sm text-neutral-500 break-all mt-1">
              {user?.email}
            </p>
          </div>
          <Link
            className="action secondary"
            href={bio?.isSubmitted ? "/portal/documents" : "/portal/biodata"}
          >
            {bio?.isSubmitted ? "Manage documents" : "Complete profile"}
          </Link>
        </div>
        {bio &&
          biodataSteps.slice(0, 6).map((step) => (
            <section key={step.title} className="panel">
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
