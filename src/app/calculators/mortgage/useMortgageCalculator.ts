import { useMemo, useState } from 'react';
import {
  useBaseMortgageInputForm,
  formatCurrency,
  type ValidationErrors,
} from '@/hooks/useBaseMortgageCalculator';
import { calculateMortgage } from '@/app/src/calculations/mortgageCalculations';
import { type MortgageInputs, type MortgageResults } from '@/app/src/types/mortgageTypes';

// Extend ValidationErrors for sale price
interface MortgageValidationErrors extends ValidationErrors {
  salePrice?: string;
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
    ageOfMortgage,
    setAgeOfMortgage,
    validationErrors: baseValidationErrors,
    resetForm: baseResetForm,
    FREQUENCY_LABEL,
    YEAR_OPTIONS,
    INPUT_CONSTRAINTS,
  } = useBaseMortgageInputForm();

  // Add sale price state
  const [salePrice, setSalePrice] = useState<number>(0);

  // Extended validation for sale price
  const validationErrors: MortgageValidationErrors = {
    ...baseValidationErrors,
  };

  if (salePrice < 0)
    validationErrors.salePrice = 'Sale price cannot be negative';

  const results: MortgageResults = useMemo(() => {
    const inputs: MortgageInputs = {
      price,
      deposit,
      rate,
      termYears,
      frequency,
      salePrice,
      ageOfMortgage,
    };

    return calculateMortgage(inputs);
  }, [price, deposit, rate, termYears, frequency, salePrice, ageOfMortgage]);

  const resetForm = () => {
    baseResetForm();
    setSalePrice(0);
  };

  return {
    // State
    price,
    setPrice,
    deposit,
    setDeposit,
    salePrice,
    setSalePrice,
    rate,
    setRate,
    termYears,
    setTermYears,
    frequency,
    setFrequency,
    ageOfMortgage,
    setAgeOfMortgage,

    // Computed values
    results,
    validationErrors,

    // Actions
    resetForm,

    // Constants
    FREQUENCY_LABEL,
    YEAR_OPTIONS,
    INPUT_CONSTRAINTS,
  };
}
