"use client";
import { useEffect, useState } from "react";
export function useMoney() {
  const [currency, setCurrency] = useState("NGN"),
    [rate, setRate] = useState(0);
  useEffect(() => {
    function update() {
      setCurrency(localStorage.getItem("mycayapp-currency") || "NGN");
      setRate(Number(localStorage.getItem("mycayapp-fx") || 0));
    }
    update();
    window.addEventListener("currencychange", update);
    return () => window.removeEventListener("currencychange", update);
  }, []);
  return (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency === "USD" && rate > 0 ? "USD" : "NGN",
      maximumFractionDigits: 2,
    }).format(currency === "USD" && rate > 0 ? amount / rate : amount);
}
export default function Currency() {
  const [currency, setCurrency] = useState("NGN"),
    [rate, setRate] = useState(0);
  useEffect(() => {
    setCurrency(localStorage.getItem("mycayapp-currency") || "NGN");
    fetch("/api/portal/plans")
      .then((r) => r.json())
      .then((d) => {
        const rate = Number(d.config?.ngnPerUsd || 0);
        setRate(rate);
        localStorage.setItem("mycayapp-fx", String(rate));
        window.dispatchEvent(new Event("currencychange"));
      })
      .catch(() => {});
  }, []);
  return (
    <label className="text-sm">
      <span className="sr-only">Display currency</span>
      <select
        className="bg-transparent min-h-[44px] px-2"
        value={currency}
        onChange={(e) => {
          setCurrency(e.target.value);
          localStorage.setItem("mycayapp-currency", e.target.value);
          window.dispatchEvent(new Event("currencychange"));
        }}
      >
        <option value="NGN">NGN</option>
        <option value="USD" disabled={!rate}>
          USD{!rate ? " (rate unavailable)" : ""}
        </option>
      </select>
    </label>
  );
}
