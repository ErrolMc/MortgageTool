"use client";

import { useMemo, useState } from "react";

type Frequency = "yearly" | "monthly" | "fortnightly" | "weekly";

const FREQUENCY_LABEL: Record<Frequency, string> = {
  yearly: "Yearly",
  monthly: "Monthly",
  fortnightly: "Fortnightly",
  weekly: "Weekly",
};

const PERIODS_PER_YEAR: Record<Frequency, number> = {
  yearly: 1,
  monthly: 12,
  fortnightly: 26,
  weekly: 52,
};

function formatNumber(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

function formatCurrency(n: number) {
  return `$${formatNumber(n)}`;
}

export default function MortgageCalculatorPage() {
  const [price, setPrice] = useState<number>(500_000);
  const [deposit, setDeposit] = useState<number>(100_000);
  const [rate, setRate] = useState<number>(5.85); // annual %
  const [termYears, setTermYears] = useState<number>(30);
  const [frequency, setFrequency] = useState<Frequency>("monthly");

  const principal = Math.max(0, (price || 0) - (deposit || 0));

  const results = useMemo(() => {
    const freq = frequency;
    const periodsPerYear = PERIODS_PER_YEAR[freq];
    const n = Math.max(1, Math.round((termYears || 0) * periodsPerYear));
    const annualRate = Math.max(0, rate) / 100;
    const r = annualRate / periodsPerYear; // nominal per-period rate

    let payment = 0;
    if (principal <= 0) {
      payment = 0;
    } else if (r === 0) {
      payment = principal / n;
    } else {
      payment = (principal * r) / (1 - Math.pow(1 + r, -n));
    }

    const totalPaid = payment * n;
    const interest = Math.max(0, totalPaid - principal);
    
    // Calculate principal and interest portions of each payment
    const paymentPrincipal = principal / n;
    const paymentInterest = payment - paymentPrincipal;
    
    return { payment, totalPaid, principal, interest, n, periodsPerYear, paymentPrincipal, paymentInterest };
  }, [principal, frequency, rate, termYears]);

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Mortgage Repayment Calculator</h1>
        <p className="text-sm text-black/70 dark:text-white/70">Enter your details to estimate repayments.</p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">House price</label>
            <input
              type="number"
              className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2"
              min={0}
              step={1000}
              value={Number.isFinite(price) ? price : 0}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Deposit</label>
            <input
              type="number"
              className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2"
              min={0}
              step={1000}
              value={Number.isFinite(deposit) ? deposit : 0}
              onChange={(e) => setDeposit(parseFloat(e.target.value) || 0)}
            />
            <p className="mt-1 text-xs text-black/60 dark:text-white/60">
              Loan amount: {formatCurrency(principal)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Rate (%)</label>
              <input
                type="number"
                className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2"
                min={0}
                max={99}
                step={0.01}
                value={Number.isFinite(rate) ? rate : 0}
                onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Term (years)</label>
              <input
                type="number"
                className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2"
                min={1}
                max={40}
                step={1}
                value={Number.isFinite(termYears) ? termYears : 30}
                onChange={(e) => setTermYears(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Repayment frequency</label>
            <div className="inline-flex rounded-md border border-black/10 dark:border-white/15 overflow-hidden">
              {(["yearly", "monthly", "fortnightly", "weekly"] as Frequency[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFrequency(f)}
                  className={
                    "px-3 py-1.5 text-sm border-r last:border-r-0 border-black/10 dark:border-white/15 " +
                    (frequency === f ? "bg-black/10 dark:bg-white/10" : "hover:bg-black/5 dark:hover:bg-white/5")
                  }
                >
                  {FREQUENCY_LABEL[f]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-black/10 dark:border-white/15 p-4">
            <h2 className="font-medium mb-2">{FREQUENCY_LABEL[frequency]} repayment</h2>
            <p className="text-3xl font-semibold">{formatCurrency(results.payment)}</p>
            <div className="mt-2 space-y-1">
              <div className="text-sm">
                <span className="text-black/70 dark:text-white/70">Principal </span>
                <span>{formatCurrency(results.paymentPrincipal)}</span>
              </div>
              <div className="text-sm">
                <span className="text-black/70 dark:text-white/70">Interest </span>
                <span>{formatCurrency(results.paymentInterest)}</span>
              </div>
            </div>
            <p className="text-xs text-black/60 dark:text-white/60 mt-2">
              per {frequency === "yearly" ? "year" : frequency}
            </p>
          </div>

          <div className="rounded-lg border border-black/10 dark:border-white/15 p-4">
            <h3 className="font-medium mb-3">Totals over the loan</h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-black/70 dark:text-white/70">Total payments</dt>
              <dd className="text-right">{formatCurrency(results.totalPaid)}</dd>
              <dt className="text-black/70 dark:text-white/70">Principal</dt>
              <dd className="text-right">{formatCurrency(results.principal)}</dd>
              <dt className="text-black/70 dark:text-white/70">Interest</dt>
              <dd className="text-right">{formatCurrency(results.interest)}</dd>
              <dt className="text-black/70 dark:text-white/70">Number of payments</dt>
              <dd className="text-right">{results.n.toLocaleString()}</dd>
            </dl>
          </div>

          <p className="text-xs text-black/60 dark:text-white/60">
            Note: Uses a nominal annual rate divided by the selected frequency. Actual lender calculations may
            differ slightly. This is for estimation only.
          </p>
        </div>
      </div>
    </div>
  );
}

