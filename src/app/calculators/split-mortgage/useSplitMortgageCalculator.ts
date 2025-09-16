import { useMemo, useState } from 'react';
import {
  useBaseMortgageInputForm,
  formatCurrency,
  formatInputNumber,
  parseInputNumber,
  type ValidationErrors,
} from '@/hooks/useBaseMortgageCalculator';
import { calculateSplitMortgage } from '@/app/src/calculations/splitMortgageCalculations';
import {
  SplitMortgageInputs,
  SplitMortgageResults,
} from '@/app/src/types/splitMortgageTypes';

// Extend ValidationErrors for split mortgage specific fields
interface SplitValidationErrors extends ValidationErrors {
  salePrice?: string;
  person1VoluntaryRepayment?: string;
  person2VoluntaryRepayment?: string;
}

// Re-export for convenience
export { formatCurrency, formatInputNumber, parseInputNumber };

export function useSplitMortgageCalculator() {
  const baseInputForm = useBaseMortgageInputForm();
  const {
    price,
    setPrice,
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
  } = baseInputForm;

  // Split-specific state
  const [person1Deposit, setPerson1Deposit] = useState<number>(
    baseInputForm.deposit / 2
  );
  const [person2Deposit, setPerson2Deposit] = useState<number>(
    baseInputForm.deposit / 2
  );
  const [person1RepaymentShare, setPerson1RepaymentShare] =
    useState<number>(0.5);
  const [salePrice, setSalePrice] = useState<number>(0);

  const totalDeposit = person1Deposit + person2Deposit;
  const splitPrincipal: number = Math.max(0, (price || 0) - totalDeposit);

  // Extended validation for split mortgage
  const validationErrors: SplitValidationErrors = {
    ...baseValidationErrors,
  };

  // Validate split-specific inputs
  if (person1Deposit < 0)
    validationErrors.person1Deposit = 'Person 1 deposit cannot be negative';
  if (person2Deposit < 0)
    validationErrors.person2Deposit = 'Person 2 deposit cannot be negative';
  if (totalDeposit > price) {
    validationErrors.person1Deposit = 'Total deposit cannot exceed house price';
    validationErrors.person2Deposit = 'Total deposit cannot exceed house price';
  }
  if (person1RepaymentShare < 0)
    validationErrors.person1RepaymentShare =
      'Repayment share cannot be negative';
  if (person1RepaymentShare > 1)
    validationErrors.person1RepaymentShare =
      'Repayment share cannot exceed 100%';
  if (salePrice < 0)
    validationErrors.salePrice = 'Sale price cannot be negative';

  const results = useMemo((): SplitMortgageResults => {
    const inputs: SplitMortgageInputs = {
      // Base mortgage inputs
      price: price || 0,
      deposit: totalDeposit,
      rate: rate || 0,
      termYears: termYears || 0,
      frequency,
      ageOfMortgage,
      salePrice,

      // Split-specific inputs
      person1Deposit,
      person2Deposit,
      person1RepaymentShare,
    };

    return calculateSplitMortgage(inputs);
  }, [
    price,
    person1Deposit,
    person2Deposit,
    totalDeposit,
    person1RepaymentShare,
    rate,
    termYears,
    frequency,
    ageOfMortgage,
    salePrice,
  ]);

  const resetForm = () => {
    baseResetForm();
    setPerson1Deposit(baseInputForm.deposit / 2);
    setPerson2Deposit(baseInputForm.deposit / 2);
    setPerson1RepaymentShare(0.5);
    setSalePrice(0);
  };

  return {
    // State
    price,
    setPrice,
    person1Deposit,
    setPerson1Deposit,
    person2Deposit,
    setPerson2Deposit,
    person1RepaymentShare,
    setPerson1RepaymentShare,
    salePrice,
    setSalePrice,
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
    principal: splitPrincipal,
    totalDeposit,
    results,
    validationErrors,

    // Actions
    resetForm,
  };
}
