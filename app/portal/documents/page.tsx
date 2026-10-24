"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PortalShell from "@/components/portal/PortalShell";
import KycUpload from "@/components/portal/KycUpload";
import { usePortal, request } from "@/components/portal/usePortal";
export default function Documents() {
  const { user } = usePortal();
  const [documents, setDocuments] = useState<any[]>([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user)
      request("/api/portal/documents")
        .then((d) => setDocuments(d.portalDocuments || []))
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
  }, [user]);
  return (
    <PortalShell user={user} currentTitle="Documents">
      <div className="max-w-5xl mx-auto space-y-6">
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <section className="panel space-y-5">
          <h2 className="font-semibold text-lg">Investment documents</h2>
          {loading ? (
            <p className="text-sm text-neutral-500">Loading…</p>
          ) : documents.length ? (
            documents.map((d) => (
              <div
                key={d.id}
                className="border-t py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
              >
                <div>
                  <p className="font-medium break-words">{d.name}</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {d.uploadDate} · {d.category.toLowerCase()}
                  </p>
                </div>
                <a
                  className="action secondary shrink-0"
                  href={`/api/portal/files/${d.id}`}
                >
                  Download PDF
                </a>
              </div>
            ))
          ) : (
            <p className="text-sm text-neutral-500">
              Your investment agreements will appear here after funding.
            </p>
          )}
        </section>
        <section className="panel space-y-5">
          <div className="flex flex-wrap gap-3 justify-between">
            <h2 className="font-semibold text-lg">Verification documents</h2>
            <Link className="text-sm underline" href="/portal/verification">
              Verification status
            </Link>
          </div>
          <KycUpload type="GOVERNMENT_ID" title="Government-issued ID" />
          <KycUpload type="PROOF_OF_ADDRESS" title="Proof of address" />
          <KycUpload type="SPECIMEN_SIGNATURE" title="Specimen signature" />
        </section>
      </div>
    </PortalShell>
  );
}
