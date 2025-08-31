import { useMemo, useState } from 'react';
import {
  useBaseMortgageInputForm,
  formatCurrency,
  formatInputNumber,
  parseInputNumber,
  type ValidationErrors,
} from '@/hooks/useBaseMortgageCalculator';
import { calculateSplitMortgage, type SplitMortgageInputs, type SplitMortgageResults } from '@/calculations/splitMortgageCalculations';
import { AgeOfMortgage } from '@/calculations/mortgageTypes';
// Extend ValidationErrors for split mortgage specific fields
interface SplitValidationErrors extends ValidationErrors {
  salePrice?: string;
  person1VoluntaryRepayment?: string;
  person2VoluntaryRepayment?: string;
}

// Re-export for convenience
export { formatCurrency, formatInputNumber, parseInputNumber, type AgeOfMortgage as YearOption };

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
    ageOfMortgage,
    setAgeOfMortgage,
    validationErrors: baseValidationErrors,
    resetForm: baseResetForm,
    FREQUENCY_LABEL,
    YEAR_OPTIONS,
    INPUT_CONSTRAINTS,
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
  const [person1VoluntaryRepayment, setPerson1VoluntaryRepayment] = useState<number>(0);
  const [person2VoluntaryRepayment, setPerson2VoluntaryRepayment] = useState<number>(0);
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
  if (person1VoluntaryRepayment < 0)
    validationErrors.person1VoluntaryRepayment = 'Voluntary repayment cannot be negative';
  if (person2VoluntaryRepayment < 0)
    validationErrors.person2VoluntaryRepayment = 'Voluntary repayment cannot be negative';
  if (salePrice < 0)
    validationErrors.salePrice = 'Sale price cannot be negative';

  const results = useMemo((): SplitMortgageResults => {
    const inputs: SplitMortgageInputs = {
      price: price || 0,
      person1Deposit,
      person2Deposit,
      person1RepaymentShare,
      person1VoluntaryRepayment,
      person2VoluntaryRepayment,
      rate: rate || 0,
      termYears: termYears || 0,
      frequency,
      ageOfMortgage,
      salePrice,
    };

    return calculateSplitMortgage(inputs);
  }, [
    price,
    person1Deposit,
    person2Deposit,
    person1RepaymentShare,
    person1VoluntaryRepayment,
    person2VoluntaryRepayment,
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
    setPerson1VoluntaryRepayment(0);
    setPerson2VoluntaryRepayment(0);
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
    person1VoluntaryRepayment,
    setPerson1VoluntaryRepayment,
    person2VoluntaryRepayment,
    setPerson2VoluntaryRepayment,
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
    principal: splitPrincipal,
    totalDeposit,
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
