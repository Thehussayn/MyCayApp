"use client";
import { useState } from "react";
import { biodataSteps } from "@/lib/kyc/fields";
import { CBN_BANKS } from "@/lib/kyc/constants";
import KycUpload from "@/components/portal/KycUpload";
export default function DirectProfile({
  investor,
  busy,
  act,
}: {
  investor: any;
  busy: boolean;
  act: (body: any) => Promise<boolean>;
}) {
  const [data, setData] = useState<any>({
    ...investor.biodata,
    fullName: investor.biodata?.fullName || investor.fullName,
    email: investor.email,
    country: investor.country,
    phone: investor.phone,
  });
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-4">
      <button className="action secondary" onClick={() => setOpen(!open)}>
        {open ? "Close form" : "Complete profile on behalf of investor"}
      </button>
      {open && (
        <div className="space-y-6">
          {biodataSteps.slice(0, 6).map((step, i) => (
            <details
              key={step.title}
              className="border rounded-xl p-4"
              open={i === 0}
            >
              <summary className="font-medium cursor-pointer">
                {i + 1}. {step.title}
              </summary>
              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                {step.fields.map((f) => (
                  <label className="field" key={f.key}>
                    {f.label}
                    {f.key === "bankCode" ? (
                      <select
                        value={data.bankCode || ""}
                        onChange={(e) =>
                          setData({
                            ...data,
                            bankCode: e.target.value,
                            bankName:
                              CBN_BANKS.find((b) => b.code === e.target.value)
                                ?.name || "",
                          })
                        }
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
                        onChange={(e) =>
                          setData({ ...data, [f.key]: e.target.value })
                        }
                      >
                        <option value="">Select</option>
                        {f.options.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={f.type || "text"}
                        readOnly={f.key === "email"}
                        value={data[f.key] || ""}
                        onChange={(e) =>
                          setData({ ...data, [f.key]: e.target.value })
                        }
                      />
                    )}
                  </label>
                ))}
              </div>
              {i === 2 && (
                <div className="mt-5">
                  <KycUpload
                    userId={investor.id}
                    type="GOVERNMENT_ID"
                    title="Government-issued ID"
                  />
                </div>
              )}
              {i === 5 && (
                <div className="mt-5">
                  <KycUpload
                    userId={investor.id}
                    type="PROOF_OF_ADDRESS"
                    title="Proof of address"
                  />
                </div>
              )}
            </details>
          ))}
          <KycUpload
            userId={investor.id}
            type="SPECIMEN_SIGNATURE"
            title="Specimen signature"
          />
          <label className="field">
            Investor’s signed name
            <input
              value={data.digitalSignature || ""}
              onChange={(e) =>
                setData({ ...data, digitalSignature: e.target.value })
              }
            />
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={!!data.acceptTerms}
              onChange={(e) =>
                setData({
                  ...data,
                  acceptTerms: e.target.checked,
                  acceptPrivacy: e.target.checked,
                })
              }
            />
            The investor has reviewed these details, signed, and accepted the
            terms and privacy policy.
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              className="action secondary"
              disabled={busy}
              onClick={() =>
                act({
                  action: "DIRECT_PROFILE",
                  userId: investor.id,
                  data,
                  submit: false,
                })
              }
            >
              Save draft
            </button>
            <button
              className="action"
              disabled={busy}
              onClick={async () => {
                if (
                  await act({
                    action: "DIRECT_PROFILE",
                    userId: investor.id,
                    data,
                    submit: true,
                  })
                )
                  setOpen(false);
              }}
            >
              Submit profile for review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
