"use client";

import { useMemo, useState } from "react";
import {
  DEFAULT_HOUSE_PRICE,
  DEFAULT_DEPOSIT,
  DEFAULT_RATE,
  DEFAULT_TERM_YEARS,
  DEFAULT_FREQUENCY,
  DEFAULT_SELECTED_YEAR,
} from "@/constants/mortgage";

type Frequency = "yearly" | "monthly" | "fortnightly" | "weekly";
type YearOption = "first" | "5" | "10" | "15" | "20" | "25" | "30";

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

const YEAR_OPTIONS: { value: YearOption; label: string }[] = [
  { value: "first", label: "First payment" },
  { value: "5", label: "Year 5" },
  { value: "10", label: "Year 10" },
  { value: "15", label: "Year 15" },
  { value: "20", label: "Year 20" },
  { value: "25", label: "Year 25" },
  { value: "30", label: "Year 30" },
];

const INPUT_CONSTRAINTS = {
  rate: {
    min: 0,
    max: 99,
    step: 0.01,
  },
  termYears: {
    min: 1,
    max: 40,
    step: 1,
  },
  housePrice: {
    min: 0,
    step: 1000,
  },
  deposit: {
    min: 0,
    step: 1000,
  },
} as const;

function formatNumber(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

function formatCurrency(n: number) {
  return `$${formatNumber(n)}`;
}

export default function MortgageCalculatorPage() {
  const [price, setPrice] = useState<number>(DEFAULT_HOUSE_PRICE);
  const [deposit, setDeposit] = useState<number>(DEFAULT_DEPOSIT);
  const [rate, setRate] = useState<number>(DEFAULT_RATE);
  const [termYears, setTermYears] = useState<number>(DEFAULT_TERM_YEARS);
  const [frequency, setFrequency] = useState<Frequency>(DEFAULT_FREQUENCY);
  const [selectedYear, setSelectedYear] = useState<YearOption>(DEFAULT_SELECTED_YEAR);

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
    
    // Calculate principal and interest portions for the selected year
    let paymentPrincipal = 0;
    let paymentInterest = 0;
    
    if (selectedYear === "first") {
      // First payment
      const firstPaymentInterest = principal * r;
      paymentPrincipal = payment - firstPaymentInterest;
      paymentInterest = firstPaymentInterest;
    } else {
      // Calculate for specific year
      const yearNumber = parseInt(selectedYear);
      if (yearNumber <= termYears) {
        const periodsToYear = yearNumber * periodsPerYear;
        let remainingBalance = principal;
        
        // Calculate remaining balance after payments up to the selected year
        for (let i = 0; i < periodsToYear; i++) {
          const periodInterest = remainingBalance * r;
          const periodPrincipal = payment - periodInterest;
          remainingBalance -= periodPrincipal;
        }
        
        // Calculate the payment breakdown for the first payment of the selected year
        paymentInterest = remainingBalance * r;
        paymentPrincipal = payment - paymentInterest;
      }
    }
    
    return { 
      payment, 
      totalPaid, 
      principal, 
      interest, 
      n, 
      periodsPerYear, 
      paymentPrincipal, 
      paymentInterest 
    };
  }, [principal, frequency, rate, termYears, selectedYear]);

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
              min={INPUT_CONSTRAINTS.housePrice.min}
              step={INPUT_CONSTRAINTS.housePrice.step}
              value={Number.isFinite(price) ? price : 0}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Deposit</label>
            <input
              type="number"
              className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2"
              min={INPUT_CONSTRAINTS.deposit.min}
              step={INPUT_CONSTRAINTS.deposit.step}
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
                min={INPUT_CONSTRAINTS.rate.min}
                max={INPUT_CONSTRAINTS.rate.max}
                step={INPUT_CONSTRAINTS.rate.step}
                value={Number.isFinite(rate) ? rate : 0}
                onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Term (years)</label>
              <input
                type="number"
                className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2"
                min={INPUT_CONSTRAINTS.termYears.min}
                max={INPUT_CONSTRAINTS.termYears.max}
                step={INPUT_CONSTRAINTS.termYears.step}
                value={Number.isFinite(termYears) ? termYears : DEFAULT_TERM_YEARS}
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
            
            <div className="mt-3">
              <label className="block text-sm mb-2">Payment breakdown for:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value as YearOption)}
                className="w-full rounded-md border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 px-3 py-2 text-sm text-black dark:text-white [&>option]:bg-black/5 [&>option]:dark:bg-white/5 [&>option]:text-black [&>option]:dark:text-white"
                style={{
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)'
                }}
              >
                {YEAR_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mt-3 space-y-1">
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

