import { useState, useEffect, useRef } from 'react';
import {
  DEFAULT_HOUSE_PRICE,
  DEFAULT_DEPOSIT,
  DEFAULT_RATE,
  DEFAULT_TERM_YEARS,
  DEFAULT_FREQUENCY,
  DEFAULT_AGE_OF_MORTGAGE_TYPE,
} from '@/constants/mortgage';
import {
  Frequency,
  AgeOfMortgageType,
  AgeOfMortgage,
} from '@/app/src/types/mortgageTypes';

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
  const [frequency, setFrequencyState] = useState<Frequency>(DEFAULT_FREQUENCY);
  const skipNextEffect = useRef(false);

  const [ageOfMortgageType, setAgeOfMortgageType] = useState<AgeOfMortgageType>(
    DEFAULT_AGE_OF_MORTGAGE_TYPE
  );
  
  // Custom setFrequency that also updates ageOfMortgage when needed
  const setFrequency = (newFrequency: Frequency) => {
    setFrequencyState(newFrequency);
    // If we're currently showing 'first' payment, update ageOfMortgage immediately
    if (ageOfMortgageType === 'first') {
      skipNextEffect.current = true; // Skip the useEffect since we're handling it here
      setAgeOfMortgage(AgeOfMortgage.MakeFromFrequency(newFrequency));
    }
  };
  
  const [ageOfMortgage, setAgeOfMortgage] = useState<AgeOfMortgage>(
    AgeOfMortgage.MakeFromFrequency(DEFAULT_FREQUENCY)
  );

  // Sync ageOfMortgageType changes with AgeOfMortgage object
  useEffect(() => {
    // Skip if we already handled this update in setFrequency
    if (skipNextEffect.current) {
      skipNextEffect.current = false;
      return;
    }
    
    if (ageOfMortgageType === 'first') {
      setAgeOfMortgage(AgeOfMortgage.MakeFromFrequency(frequency));
    } else {
      setAgeOfMortgage(AgeOfMortgage.MakeFromEnum(ageOfMortgageType));
    }
  }, [ageOfMortgageType, frequency]);

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
    setAgeOfMortgageType(DEFAULT_AGE_OF_MORTGAGE_TYPE);
    setAgeOfMortgage(AgeOfMortgage.MakeFromFrequency(DEFAULT_FREQUENCY));
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
    ageOfMortgageType,
    setAgeOfMortgageType,
    ageOfMortgage,
    setAgeOfMortgage,

    // Errors
    validationErrors,

    // Actions
    resetForm,
  };
}
