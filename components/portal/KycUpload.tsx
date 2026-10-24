"use client";
import { useEffect, useState } from "react";
import { request } from "./usePortal";
export default function KycUpload({
  type,
  title,
  userId,
}: {
  type: string;
  title: string;
  userId?: string;
}) {
  const [doc, setDoc] = useState<any>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    request(
      `/api/portal/documents${userId ? `?userId=${encodeURIComponent(userId)}` : ""}`,
    )
      .then((d) =>
        setDoc(d.documents.find((d: any) => d.documentType === type)),
      )
      .catch(() => {});
  }, [type, userId]);
  async function upload(file: File) {
    setError("");
    setBusy(true);
    try {
      const allowed =
        type === "SPECIMEN_SIGNATURE"
          ? ["image/jpeg", "image/png"]
          : ["application/pdf", "image/jpeg", "image/png"];
      if (!allowed.includes(file.type) || file.size > 10 * 1024 * 1024)
        throw Error("Use a supported file up to 10 MB.");
      const fileUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const d = await request("/api/portal/documents", {
        userId,
        documentType: type,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        fileUrl,
      });
      setDoc(d.document);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="border border-dashed border-neutral-300 rounded-xl p-4 space-y-3">
      <label className="field">
        {title}
        <input
          type="file"
          accept={
            type === "SPECIMEN_SIGNATURE"
              ? "image/jpeg,image/png"
              : "application/pdf,image/jpeg,image/png"
          }
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
          }}
        />
      </label>
      <p className="text-xs text-neutral-500">
        {type === "SPECIMEN_SIGNATURE" ? "JPG or PNG" : "PDF, JPG, or PNG"} · Up
        to 10 MB
        {type === "PROOF_OF_ADDRESS"
          ? " · Issued within the last 3 months"
          : ""}
      </p>
      {busy && <p className="text-sm">Uploading…</p>}
      {doc && (
        <p className="text-sm break-all">
          <a
            className="underline"
            href={`/api/portal/kyc-files/${doc.id}`}
            target="_blank"
            rel="noreferrer"
          >
            {doc.fileName}
          </a>
          <span className="text-neutral-500 ml-2 capitalize">
            {doc.status.replaceAll("_", " ").toLowerCase()}
          </span>
          {doc.rejectionReason && (
            <span className="block text-rose-700 mt-2">
              {doc.rejectionReason}
            </span>
          )}
        </p>
      )}
      {error && (
        <p className="text-sm text-rose-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
