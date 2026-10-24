"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PortalShell from "@/components/portal/PortalShell";
import { usePortal, request } from "@/components/portal/usePortal";
import { formatCurrency as money } from "@/lib/utils";
import { PlatformConfig } from "@/lib/platform/config";
import { ArrowLeft, Check } from "lucide-react";
export default function NewInvestment() {
  const { user, preview } = usePortal(),
    router = useRouter();
  const [config, setConfig] = useState<PlatformConfig | null>(null),
    [plan, setPlan] = useState("GIAP"),
    [capital, setCapital] = useState("5000000"),
    [frequency, setFrequency] = useState("MONTHLY"),
    [step, setStep] = useState(1),
    [terms, setTerms] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [checkout, setCheckout] = useState<any>(null),
    [topUp, setTopUp] = useState(""),
    [existing, setExisting] = useState<any>(null);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setPlan(
      q.get("plan")?.toLowerCase() === "wealthstream" ? "WEALTHSTREAM" : "GIAP",
    );
    const top = q.get("topUp");
    if (top) {
      setTopUp(top);
      request("/api/portal/investments")
        .then((d) => {
          const w = d.wealthStream.find((w: any) => w.id === top);
          setExisting(w);
          if (w) setFrequency(w.payoutFrequency);
        })
        .catch((e) => setError(e.message));
    }
    request("/api/portal/plans")
      .then((d) => setConfig(d.config))
      .catch((e) => setError(e.message));
  }, []);
  const amount = Number(capital),
    rate =
      existing?.annualRate ??
      (frequency === "MONTHLY" ? config?.monthlyRate : config?.annualRate) ??
      0;
  const min = topUp
      ? 1
      : plan === "GIAP"
        ? config?.giapMin
        : config?.wealthstreamMin,
    max = plan === "GIAP" ? config?.giapMax : config?.wealthstreamMax;
  const valid =
    Number.isFinite(amount) &&
    amount > 0 &&
    amount >= (min || 0) &&
    amount <= (max || 0) &&
    (!existing || amount + existing.principal <= (max || 0));
  async function pay() {
    setBusy(true);
    setError("");
    try {
      if (checkout) {
        const d = await request("/api/portal/paystack/verify", {
          reference: checkout.reference,
        });
        router.push(`/portal/investments/${d.investmentId}`);
        return;
      }
      const d = await request("/api/portal/investments/subscribe", {
        plan,
        capital: amount,
        payoutFrequency: frequency,
        acceptTerms: terms,
        topUpId: topUp || undefined,
      });
      if (d.preview) setCheckout(d);
      else window.location.assign(d.authorizationUrl);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <PortalShell user={user}>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          className="inline-flex gap-2 items-center text-sm text-neutral-500"
          href="/portal/investments"
        >
          <ArrowLeft size={16} />
          My investments
        </Link>
        <h1 className="workspace-title">
          {topUp ? "Top up WealthStream" : "New investment"}
        </h1>
        <ol
          className="flex gap-3 sm:gap-6 text-sm"
          aria-label="Investment steps"
        >
          {["Plan & amount", "Review", "Payment"].map((s, i) => (
            <li
              key={s}
              aria-current={step === i + 1 ? "step" : undefined}
              className={step >= i + 1 ? "font-semibold" : "text-neutral-400"}
            >
              {i + 1}. {s}
            </li>
          ))}
        </ol>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {!config ? (
          <div className="panel">Loading plans…</div>
        ) : !preview && user?.kycStatus !== "APPROVED" ? (
          <div className="panel space-y-4">
            <h2 className="text-xl font-semibold">
              Complete verification to invest
            </h2>
            <p className="text-sm text-neutral-500">
              Submit your profile and documents for review.
            </p>
            <Link className="action" href="/portal/biodata">
              Complete profile
            </Link>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div className="panel space-y-7">
                {!topUp && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {["GIAP", "WEALTHSTREAM"].map((p) => (
                      <button
                        key={p}
                        aria-pressed={plan === p}
                        className={`text-left p-5 border rounded-xl ${plan === p ? "border-brand-gold bg-[#FBF7EE]" : "border-neutral-200"}`}
                        onClick={() => {
                          setPlan(p);
                          setTerms(false);
                        }}
                      >
                        <span className="font-semibold text-lg">
                          {p === "GIAP" ? "GIAP" : "WealthStream"}
                        </span>
                        <p className="text-sm text-neutral-500 mt-2">
                          {p === "GIAP"
                            ? "70% of profit when your linked property sells."
                            : "Regular payouts while your capital stays invested."}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
                {plan === "WEALTHSTREAM" && (
                  <label className="field">
                    Payout frequency
                    <select
                      disabled={!!topUp}
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                    >
                      <option value="MONTHLY">
                        Monthly · {config.monthlyRate * 100}% p.a.
                      </option>
                      <option value="ANNUALLY">
                        Annual · {config.annualRate * 100}% p.a.
                      </option>
                    </select>
                  </label>
                )}
                <label className="field">
                  {topUp ? "Additional amount" : "Investment amount"} (NGN)
                  <input
                    type="number"
                    inputMode="decimal"
                    min={min}
                    max={max}
                    step="0.01"
                    value={capital}
                    onChange={(e) => setCapital(e.target.value)}
                  />
                  <span className="font-normal text-xs text-neutral-500">
                    {topUp
                      ? `Maximum total capital: ${money(max || 0)}`
                      : `${money(min || 0)} – ${money(max || 0)}`}
                  </span>
                </label>
                <div className="bg-[#F6F7F6] rounded-xl p-5 space-y-2">
                  {plan === "GIAP" ? (
                    <>
                      <h2 className="font-semibold">
                        Example: a property sold for {money(amount * 1.5)}
                      </h2>
                      <p className="text-sm text-neutral-600">
                        On {money(amount)} capital, gross profit would be{" "}
                        {money(amount * 0.5)}. Your 70% share would be{" "}
                        {money(amount * 0.5 * 0.7)}, plus your capital returned.
                      </p>
                      <p className="text-xs text-neutral-500">
                        Illustration only. Returns depend on the actual resale
                        price.
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="font-semibold">
                        {topUp ? "Updated payout" : "Your payout"}:{" "}
                        {money(
                          ((amount + (existing?.principal || 0)) * rate) /
                            (frequency === "MONTHLY" ? 12 : 1),
                        )}
                        {frequency === "MONTHLY" ? " per month" : " per year"}
                      </h2>
                      <p className="text-sm text-neutral-600">
                        {rate * 100}% annual return on{" "}
                        {money(amount + (existing?.principal || 0))}.
                      </p>
                      {topUp && (
                        <p className="text-sm text-neutral-500">
                          Your next scheduled payout stays unchanged. The
                          increased amount applies to later payouts.
                        </p>
                      )}
                    </>
                  )}
                </div>
                <button
                  className="action w-full sm:w-auto"
                  disabled={!valid}
                  onClick={() => {
                    setStep(2);
                    setError("");
                  }}
                >
                  Review investment
                </button>
              </div>
            )}
            {step === 2 && (
              <div className="panel space-y-6">
                <h2 className="text-xl font-semibold">
                  Review your {topUp ? "top-up" : "investment"}
                </h2>
                <dl className="space-y-4">
                  {[
                    [
                      "Plan",
                      plan === "GIAP"
                        ? "Global Investor Advantage Plan"
                        : "WealthStream",
                    ],
                    [topUp ? "Top-up amount" : "Capital", money(amount)],
                    [
                      "Returns",
                      plan === "GIAP"
                        ? "70% of profit on resale"
                        : `${rate * 100}% p.a. · ${frequency === "MONTHLY" ? "monthly" : "annual"} payouts`,
                    ],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex flex-wrap justify-between gap-2 border-b pb-3"
                    >
                      <dt className="text-sm text-neutral-500">{k}</dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="notice">
                  {plan === "GIAP"
                    ? "Finance assigns your property after deploying your funds. You receive 70% of the profit on resale. The investment exits when the property is sold."
                    : `Withdrawal requires ${config.noticeDays} days’ notice from approval. No returns accrue during notice. Your full principal is returned at the end of the notice period.`}
                </div>
                <label className="flex gap-3 items-start text-sm">
                  <input
                    className="mt-1 h-4 w-4 shrink-0"
                    type="checkbox"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                  />
                  I have reviewed and accept these investment terms.
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    className="action secondary"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </button>
                  <button
                    className="action"
                    disabled={!terms}
                    onClick={() => setStep(3)}
                  >
                    Continue to payment
                  </button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="panel space-y-5">
                <h2 className="text-xl font-semibold">
                  {preview ? "Preview payment" : "Pay for your investment"}
                </h2>
                <p className="text-3xl font-bold">{money(amount)}</p>
                <p className="text-sm text-neutral-500">{user?.email}</p>
                {preview ? (
                  <p className="notice">
                    No money will be charged. Confirm to see the investment and
                    its next steps in this preview workspace.
                  </p>
                ) : (
                  <p className="text-sm text-neutral-500">
                    Continue to Paystack to pay by card, transfer, or another
                    available method.
                  </p>
                )}
                <div className="flex flex-wrap gap-3">
                  <button
                    disabled={busy}
                    className="action secondary"
                    onClick={() => {
                      setStep(2);
                      setCheckout(null);
                    }}
                  >
                    Back
                  </button>
                  <button disabled={busy} className="action" onClick={pay}>
                    {busy
                      ? "Please wait…"
                      : preview
                        ? checkout
                          ? "Confirm preview payment"
                          : "Prepare preview payment"
                        : "Continue to Paystack"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PortalShell>
  );
}
