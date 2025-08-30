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
export type YearOption = 'first' | '5' | '10' | '15' | '20' | '25' | '27' | '29' | '30';

export const FREQUENCY_LABEL: Record<Frequency, string> = {
  yearly: 'Yearly',
  monthly: 'Monthly',
  fortnightly: 'Fortnightly',
  weekly: 'Weekly',
};

export const PERIODS_PER_YEAR: Record<Frequency, number> = {
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
  { value: '27', label: 'Year 27' },
  { value: '29', label: 'Year 29' },
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

export function formatNumber(n: number): string {
  return n.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

export function formatCurrency(n: number) {
  return `$${formatNumber(n)}`;
}

export function formatInputNumber(value: number): string {
  return value.toLocaleString();
}

export function parseInputNumber(value: string): number {
  return parseFloat(value.replace(/,/g, '')) || 0;
}

export interface ValidationErrors {
  price?: string;
  deposit?: string;
  rate?: string;
  termYears?: string;
  person1Deposit?: string;
  person2Deposit?: string;
  person1RepaymentShare?: string;
}

export function useBaseMortgageCalculator() {
  const [price, setPrice] = useState<number>(DEFAULT_HOUSE_PRICE);
  const [deposit, setDeposit] = useState<number>(DEFAULT_DEPOSIT);
  const [rate, setRate] = useState<number>(DEFAULT_RATE);
  const [termYears, setTermYears] = useState<number>(DEFAULT_TERM_YEARS);
  const [frequency, setFrequency] = useState<Frequency>(DEFAULT_FREQUENCY);
  const [selectedYear, setSelectedYear] = useState<YearOption>(DEFAULT_SELECTED_YEAR);

  const principal: number = Math.max(0, (price || 0) - (deposit || 0));

  const validationErrors: ValidationErrors = {};

  // Validate inputs
  if (price < 0) validationErrors.price = 'House price cannot be negative';
  if (deposit < 0) validationErrors.deposit = 'Deposit cannot be negative';
  if (deposit > price) validationErrors.deposit = 'Deposit cannot exceed house price';
  if (rate < 0) validationErrors.rate = 'Interest rate cannot be negative';
  if (rate > 99) validationErrors.rate = 'Interest rate cannot exceed 99%';
  if (termYears < 1) validationErrors.termYears = 'Term must be at least 1 year';
  if (termYears > 40) validationErrors.termYears = 'Term cannot exceed 40 years';

  const resetForm = () => {
    setPrice(DEFAULT_HOUSE_PRICE);
    setDeposit(DEFAULT_DEPOSIT);
    setRate(DEFAULT_RATE);
    setTermYears(DEFAULT_TERM_YEARS);
    setFrequency(DEFAULT_FREQUENCY);
    setSelectedYear(DEFAULT_SELECTED_YEAR);
  };

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
    validationErrors,

    // Actions
    resetForm,

    // Constants
    FREQUENCY_LABEL,
    YEAR_OPTIONS,
    INPUT_CONSTRAINTS,
  };
}
