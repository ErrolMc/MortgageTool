import { useState } from 'react';
import {
  DEFAULT_HOUSE_PRICE,
  DEFAULT_DEPOSIT,
  DEFAULT_RATE,
  DEFAULT_TERM_YEARS,
  DEFAULT_FREQUENCY,
  DEFAULT_AGE_OF_MORTGAGE,
} from '@/constants/mortgage';
import { Frequency, AgeOfMortgage } from '@/app/src/types/mortgageTypes';

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

export function useBaseMortgageInputForm() {
  const [price, setPrice] = useState<number>(DEFAULT_HOUSE_PRICE);
  const [deposit, setDeposit] = useState<number>(DEFAULT_DEPOSIT);
  const [rate, setRate] = useState<number>(DEFAULT_RATE);
  const [termYears, setTermYears] = useState<number>(DEFAULT_TERM_YEARS);
  const [frequency, setFrequency] = useState<Frequency>(DEFAULT_FREQUENCY);
  const [ageOfMortgage, setAgeOfMortgage] = useState<AgeOfMortgage>(DEFAULT_AGE_OF_MORTGAGE);

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
    setAgeOfMortgage(DEFAULT_AGE_OF_MORTGAGE);
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
    ageOfMortgage,
    setAgeOfMortgage,

    // Errors
    validationErrors,

    // Actions
    resetForm,
  };
}
