import { useMemo, useState } from 'react';
import {
  useBaseMortgageInputForm,
  formatCurrency,
  type ValidationErrors,
} from '@/hooks/useBaseMortgageCalculator';
import { calculateMortgage } from '@/app/src/calculations/mortgageCalculations';
import { MortgageInputs, MortgageResults } from '@/app/src/types/mortgageTypes';

// Extend ValidationErrors for sale price and extra repayments
interface MortgageValidationErrors extends ValidationErrors {
  salePrice?: string;
  extraRepayments?: string;
}

// Re-export for convenience
export { formatCurrency };

export function useMortgageCalculator() {
  const {
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
    validationErrors: baseValidationErrors,
    resetForm: baseResetForm,
  } = useBaseMortgageInputForm();

  // Add sale price and extra repayments state
  const [salePrice, setSalePrice] = useState<number>(0);
  const [extraRepayments, setExtraRepayments] = useState<number>(0);

  // Extended validation for sale price
  const validationErrors: MortgageValidationErrors = {
    ...baseValidationErrors,
  };

  if (salePrice < 0)
    validationErrors.salePrice = 'Sale price cannot be negative';
  
  if (extraRepayments < 0)
    validationErrors.extraRepayments = 'Extra repayments cannot be negative';

  const results: MortgageResults = useMemo(() => {
    const inputs: MortgageInputs = {
      price,
      deposit,
      rate,
      termYears,
      frequency,
      salePrice,
      ageOfMortgage,
      extraRepayments,
    };

    return calculateMortgage(inputs);
  }, [price, deposit, rate, termYears, frequency, salePrice, ageOfMortgage, extraRepayments]);

  const resetForm = () => {
    baseResetForm();
    setSalePrice(0);
    setExtraRepayments(0);
  };

  return {
    // State
    price,
    setPrice,
    deposit,
    setDeposit,
    salePrice,
    setSalePrice,
    extraRepayments,
    setExtraRepayments,
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

    // Computed values
    results,
    validationErrors,

    // Actions
    resetForm,
  };
}
