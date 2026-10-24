"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InvestorLogo, InvestorFooter, FigmaIcon } from "@/components/portal/FigmaAsset";
import PreviewBar from "@/components/portal/PreviewBar";
import KycUpload from "@/components/portal/KycUpload";
import { usePortal, request } from "@/components/portal/usePortal";
import { biodataSteps } from "@/lib/kyc/fields";
import { CBN_BANKS } from "@/lib/kyc/constants";
export default function Biodata() {
  const { user, preview } = usePortal(),
    router = useRouter();
  const [data, setData] = useState<any>(null),
    [step, setStep] = useState(1),
    [errors, setErrors] = useState<Record<string, string>>({}),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [saved, setSaved] = useState(false);
  useEffect(() => {
    let cancelled = false;
    if (user)
      request("/api/portal/biodata")
        .then((d) => {
          if (cancelled) return;
          if (
            d.biodata.isSubmitted &&
            !preview &&
            !["INFO_REQUESTED", "REJECTED"].includes(user.kycStatus || "")
          ) {
            router.replace("/portal/profile");
            return;
          }
          setData(d.biodata);
          setStep(d.biodata.currentStep || 1);
        })
        .catch((e) => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, [user?.id, preview, router]);
  function field(key: string, value: any) {
    setData({ ...data, [key]: value });
    setSaved(false);
    setErrors({ ...errors, [key]: "" });
  }
  async function save(final = false, exit = false) {
    setBusy(true);
    setError("");
    setErrors({});
    try {
      const r = await fetch("/api/portal/biodata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step,
          data,
          isFinalSubmit: final,
          isSaveAndExit: exit || preview,
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        setErrors(d.errors || {});
        throw Error(
          d.error === "Validation failed"
            ? "Check the highlighted fields."
            : d.error,
        );
      }
      setData(d.biodata);
      setSaved(true);
      if (final) router.push("/portal/onboarding-complete");
      else if (exit) router.push("/portal/dashboard");
      else {
        setStep(Math.min(7, step + 1));
        window.scrollTo({ top: 0 });
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const definition = biodataSteps[step - 1];
  return (
    <div className="workspace kyc-workspace"><PreviewBar/>
      <header className="kyc-header"><div className="kyc-header-inner"><div className="kyc-header-brand"><InvestorLogo /><span>BIODATA</span></div><nav className="kyc-header-actions"><button disabled={busy || !data} onClick={() => save(false, true)}>Save &amp; Exit</button><Link href="/portal/dashboard">Dashboard</Link></nav></div></header>
      <div className="kyc-main space-y-6">
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {data && (
          <>
            <section className="kyc-progress">
              <div className="flex justify-between gap-4 items-center"><div><p className="text-xs tracking-widest text-brand-gold mb-2">STEP {step} OF 7</p><h1>{definition.title}</h1></div><p className="text-sm text-neutral-500">{Math.round(((step - 1) / 7) * 100)}% completed</p></div>
              <div className="kyc-progress-track"><div style={{width: `${((step - 1) / 7) * 100}%`}} /></div>
              <nav className="kyc-step-tabs" aria-label="KYC progress">{biodataSteps.map((s, i) => <button type="button" key={s.title} aria-current={step === i + 1 ? "step" : undefined} className={step === i + 1 ? "active" : ""} disabled={!preview && i + 1 > step} onClick={() => {setStep(i + 1);setError("");setErrors({});}}><span><FigmaIcon file={(["98482.svg", "18d9b.svg", "1c1d4.svg", "02d9a.svg", "2ea96.svg", "18d9b.svg", "d3969.svg"] as const)[i]} />{i + 1}</span>{["Personal", "Contact", "Identity", "Occupation", "Next of Kin", "Bank Account", "Declaration"][i]}</button>)}</nav>
              {preview && <label className="field mt-4"><span className="text-xs">Preview: jump to any step</span><select aria-label="Jump to onboarding step" value={step} onChange={e => setStep(Number(e.target.value))}>{biodataSteps.map((s,i) => <option key={s.title} value={i+1}>{i+1}. {s.title}</option>)}</select></label>}
              {saved && <p role="status" className="text-xs mt-3">Progress saved</p>}
            </section>
            <form
              className="kyc-form panel"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                save(step === 7);
              }}
            >
              <div className="kyc-form-heading"><h2>{step}. {definition.title}</h2></div>
              {step < 7 ? (
                <div className="grid sm:grid-cols-2 gap-5">
                  {definition.fields
                    .filter(
                      (f) =>
                        !(
                          step === 4 &&
                          [
                            "employerName",
                            "jobTitle",
                            "businessAddress",
                          ].includes(f.key) &&
                          ![
                            "Employed",
                            "Self-Employed / Business Owner",
                          ].includes(data.employmentStatus)
                        ),
                    )
                    .map((f) => (
                      <label className={`field ${["fullName", "maritalStatus", "residentialAddress", "businessAddress", "nokAddress"].includes(f.key) ? "sm:col-span-2" : ""}`} key={f.key}>
                        {f.label}
                        {f.key === "bankCode" ? (
                          <select
                            value={data.bankCode || ""}
                            onChange={(e) => {
                              const bank = CBN_BANKS.find(
                                (b) => b.code === e.target.value,
                              );
                              setData({
                                ...data,
                                bankCode: e.target.value,
                                bankName: bank?.name || "",
                              });
                            }}
                          >
                            <option value="">Select bank</option>
                            {CBN_BANKS.map((b) => (
                              <option key={b.code} value={b.code}>
                                {b.name}
                              </option>
                            ))}
                          </select>
                        ) : f.options ? (
                          <select
                            value={data[f.key] || ""}
                            onChange={(e) => field(f.key, e.target.value)}
                            aria-invalid={!!errors[f.key]}
                          >
                            <option value="">Select</option>
                            {f.options.map((o) => (
                              <option key={o}>{o}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={f.type || "text"}
                            inputMode={
                              f.key === "accountNumber" ? "numeric" : undefined
                            }
                            readOnly={["fullName", "email", "country"].includes(f.key)}
                            value={data[f.key] || ""}
                            onChange={(e) => field(f.key, e.target.value)}
                            aria-invalid={!!errors[f.key]}
                          />
                        )}{" "}
                        {errors[f.key] && (
                          <span className="text-xs text-rose-700" role="alert">
                            {errors[f.key]}
                          </span>
                        )}
                      </label>
                    ))}
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {biodataSteps.slice(0, 6).map((s, i) => (
                      <details
                        key={s.title}
                        className="border-b pb-4"
                        open
                      >
                        <summary className="font-medium cursor-pointer">
                          {s.title}
                        </summary>
                        <dl className="grid sm:grid-cols-2 gap-4 pt-4">
                          {s.fields.map((f) => (
                            <div key={f.key}>
                              <dt className="text-xs text-neutral-500">
                                {f.label}
                              </dt>
                              <dd className="text-sm mt-1 break-words">
                                {f.key === "bankCode"
                                  ? data.bankName || "—"
                                  : data[f.key] || "—"}
                              </dd>
                            </div>
                          ))}
                        </dl>
                        <button
                          type="button"
                          className="underline text-sm mt-3"
                          onClick={() => setStep(i + 1)}
                        >
                          Edit
                        </button>
                      </details>
                    ))}
                  </div>
                  <label className="field">
                    Digital signature
                    <input
                      value={data.digitalSignature || ""}
                      onChange={(e) =>
                        field("digitalSignature", e.target.value)
                      }
                      placeholder="Type your full legal name"
                    />
                    {errors.digitalSignature && (
                      <span className="text-rose-700 text-xs">
                        {errors.digitalSignature}
                      </span>
                    )}
                  </label>
                  <p className="text-xs text-neutral-500">
                    Signed on{" "}
                    {new Date().toLocaleDateString("en-GB", {
                      timeZone: "Africa/Lagos",
                    })}
                  </p>
                </>
              )}
              {step === 3 && (
                <KycUpload type="GOVERNMENT_ID" title="Government-issued ID" />
              )}
              {step === 6 && (
                <KycUpload type="PROOF_OF_ADDRESS" title="Proof of address" />
              )}
              {step === 7 && (
                <>
                  <KycUpload
                    type="SPECIMEN_SIGNATURE"
                    title="Specimen signature"
                  />
                  {[
                    [
                      "acceptTerms",
                      "I confirm these details are accurate and accept the investment terms.",
                    ],
                    ["acceptPrivacy", "I accept the privacy policy."],
                  ].map(([key, text]) => (
                    <label key={key} className="flex items-start gap-3 text-sm">
                      <input
                        className="mt-1 h-4 w-4 shrink-0"
                        type="checkbox"
                        checked={!!data[key]}
                        onChange={(e) => field(key, e.target.checked)}
                      />
                      <span>
                        {text}
                        {errors[key] && (
                          <span className="block text-rose-700 text-xs mt-1">
                            {errors[key]}
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                </>
              )}
              <div className="kyc-form-actions flex flex-wrap gap-3 justify-between border-t pt-5">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="action secondary"
                    disabled={busy || step === 1}
                    onClick={() => {
                      setStep(step - 1);
                      setErrors({});
                      setError("");
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="action secondary"
                    disabled={busy}
                    onClick={() => save(false, true)}
                  >
                    Save & exit
                  </button>
                </div>
                <button className="action" disabled={busy}>
                  {busy
                    ? "Saving…"
                    : step === 7
                      ? "Submit for review"
                      : "Save & Continue"}
                </button>
              </div>
            </form>
          </>
        )}
        {!data && !error && <div className="panel">Loading profile…</div>}
      </div>
    <InvestorFooter /></div>
  );
}
