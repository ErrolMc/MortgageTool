import { useMemo, useState } from 'react';
import {
  DEFAULT_HOUSE_PRICE,
  DEFAULT_DEPOSIT,
  DEFAULT_RATE,
  DEFAULT_TERM_YEARS,
  DEFAULT_FREQUENCY,
  DEFAULT_SELECTED_YEAR,
} from '@/constants/mortgage';

export type Frequency = 'yearly' | 'monthly' | 'fortnightly' | 'weekly';
export type YearOption = 'first' | '5' | '10' | '15' | '20' | '25' | '30';

const FREQUENCY_LABEL: Record<Frequency, string> = {
  yearly: 'Yearly',
  monthly: 'Monthly',
  fortnightly: 'Fortnightly',
  weekly: 'Weekly',
};

const PERIODS_PER_YEAR: Record<Frequency, number> = {
  yearly: 1,
  monthly: 12,
  fortnightly: 26,
  weekly: 52,
};

export const YEAR_OPTIONS: { value: YearOption; label: string }[] = [
  { value: 'first', label: 'First payment' },
  { value: '5', label: 'Year 5' },
  { value: '10', label: 'Year 10' },
  { value: '15', label: 'Year 15' },
  { value: '20', label: 'Year 20' },
  { value: '25', label: 'Year 25' },
  { value: '30', label: 'Year 30' },
];

export const INPUT_CONSTRAINTS = {
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

export function formatNumber(n: number) {
  return n.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

export function formatCurrency(n: number) {
  return `$${formatNumber(n)}`;
}

export function useMortgageCalculator() {
  const [price, setPrice] = useState<number>(DEFAULT_HOUSE_PRICE);
  const [deposit, setDeposit] = useState<number>(DEFAULT_DEPOSIT);
  const [rate, setRate] = useState<number>(DEFAULT_RATE);
  const [termYears, setTermYears] = useState<number>(DEFAULT_TERM_YEARS);
  const [frequency, setFrequency] = useState<Frequency>(DEFAULT_FREQUENCY);
  const [selectedYear, setSelectedYear] = useState<YearOption>(
    DEFAULT_SELECTED_YEAR
  );

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

    if (selectedYear === 'first') {
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
      paymentInterest,
    };
  }, [principal, frequency, rate, termYears, selectedYear]);

  return {
    // State
    price,
    setPrice,
    deposit,
    setDeposit,
    rate,
    setRate,
    termYears,
    setTermYears,
    frequency,
    setFrequency,
    selectedYear,
    setSelectedYear,

    // Computed values
    principal,
    results,

    // Constants
    FREQUENCY_LABEL,
    YEAR_OPTIONS,
    INPUT_CONSTRAINTS,
  };
}
