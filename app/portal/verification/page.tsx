"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PortalShell from "@/components/portal/PortalShell";
import { Status } from "@/components/portal/Investments";
import { usePortal, request } from "@/components/portal/usePortal";
export default function Verification() {
  const { user, refresh } = usePortal();
  const [documents, setDocuments] = useState<any[]>([]),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function load() {
    try {
      const d = await request("/api/portal/documents");
      setDocuments(d.documents);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  useEffect(() => {
    if (user) load();
  }, [user]);
  const status = user?.kycStatus || "NOT_STARTED";
  return (
    <PortalShell user={user} currentTitle="Verification">
      <div className="max-w-3xl mx-auto space-y-6">
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <div className="panel space-y-5">
          <Status value={status} />
          <h2 className="text-xl font-semibold">
            {status === "APPROVED"
              ? "You’re verified"
              : ["SUBMITTED", "UNDER_REVIEW"].includes(status)
                ? "Your profile is under review"
                : ["INFO_REQUESTED", "REJECTED"].includes(status)
                  ? "Your KYC needs an update"
                  : "Complete your profile"}
          </h2>
          <p className="text-sm text-neutral-500">
            {status === "APPROVED"
              ? "You can create and manage your investments."
              : ["SUBMITTED", "UNDER_REVIEW"].includes(status)
                ? "We’ll notify you when your review is complete."
                : "Submit your personal details, ID, proof of address, and signature."}
          </p>
          <Link
            className="action"
            href={
              status === "APPROVED"
                ? "/portal/investments"
                : ["INFO_REQUESTED", "REJECTED"].includes(status)
                  ? "/portal/biodata"
                  : "/portal/biodata"
            }
          >
            {status === "APPROVED"
              ? "My investments"
              : ["INFO_REQUESTED", "REJECTED"].includes(status)
                ? "Update KYC"
                : "View profile"}
          </Link>
        </div>
        {user?.staffInquiry && <p className="panel text-sm">{user.staffInquiry}</p>}
        {status === "REJECTED" && user?.declineReason && <p className="panel text-sm">{user.declineReason}</p>}
        <div className="panel space-y-4">
          <h2 className="font-semibold">Documents</h2>
          {[
            ["GOVERNMENT_ID", "Government-issued ID"],
            ["PROOF_OF_ADDRESS", "Proof of address"],
            ["SPECIMEN_SIGNATURE", "Specimen signature"],
          ].map(([type, title]) => {
            const doc = documents.find((d) => d.documentType === type);
            return (
              <div key={type} className="border-t pt-4">
                <div className="flex flex-wrap justify-between gap-3">
                  <h3 className="text-sm">{title}</h3>
                  <Status value={doc?.status || "NOT_UPLOADED"} />
                </div>
                {doc?.rejectionReason && (
                  <p className="text-sm text-rose-700 mt-2">
                    {doc.rejectionReason}
                  </p>
                )}
              </div>
            );
          })}
          {documents.some((d) =>
            ["UPLOADED", "INFO_REQUESTED"].includes(d.status),
          ) && (
            <button
              className="action"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setError("");
                try {
                  await request("/api/portal/documents/submit", {});
                  await refresh();
                  await load();
                } catch (e) {
                  setError((e as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? "Submitting…" : "Submit updated documents"}
            </button>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
