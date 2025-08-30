import { useMemo } from 'react';
import {
  useBaseMortgageCalculator,
  PERIODS_PER_YEAR,
  formatCurrency,
  type Frequency,
  type YearOption,
} from '@/hooks/useBaseMortgageCalculator';

// Re-export for convenience
export { formatCurrency, type Frequency, type YearOption };

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
    selectedYear,
    setSelectedYear,
    principal,
    validationErrors,
    resetForm,
    FREQUENCY_LABEL,
    YEAR_OPTIONS,
    INPUT_CONSTRAINTS,
  } = useBaseMortgageCalculator();

  const results = useMemo(() => {
    const freq: Frequency = frequency;
    const periodsPerYear: number = PERIODS_PER_YEAR[freq];
    const n: number = Math.max(1, Math.round((termYears || 0) * periodsPerYear));
    const annualRate: number = Math.max(0, rate) / 100;
    const r: number = annualRate / periodsPerYear; // nominal per-period rate

    let payment: number = 0;
    if (principal <= 0) {
      payment = 0;
    } else if (Math.abs(r) < 1e-10) { // Use small epsilon for floating point comparison
      payment = principal / n;
    } else {
      payment = (principal * r) / (1 - Math.pow(1 + r, -n));
    }

    const totalPaid: number = payment * n;
    const interest: number = Math.max(0, totalPaid - principal);

    // Calculate principal and interest portions for the selected year
    let paymentPrincipal: number = 0;
    let paymentInterest: number = 0;

    // Calculate total interest paid and principal gained at the selected point in time
    let totalInterestPaid: number = 0;
    let principalGained: number = 0;

    if (selectedYear === 'deposit') {
      // Deposit only - no payments made yet
      paymentPrincipal = 0;
      paymentInterest = 0;
      totalInterestPaid = 0;
      principalGained = 0;
    } else if (selectedYear === 'first') {
      // First payment
      const firstPaymentInterest: number = principal * r;
      paymentPrincipal = payment - firstPaymentInterest;
      paymentInterest = firstPaymentInterest;
      totalInterestPaid = firstPaymentInterest;
      principalGained = paymentPrincipal;
    } else {
      // Calculate for specific year
      const yearNumber: number = parseInt(selectedYear);
      if (yearNumber <= termYears) {
        const periodsToYear: number = yearNumber * periodsPerYear;
        let remainingBalance: number = principal;
        let totalPrincipalPaid: number = 0;
        let totalInterestPaid: number = 0;

        // Calculate total principal and interest paid up to the selected year
        for (let i = 0; i < periodsToYear; i++) {
          const periodInterest: number = remainingBalance * r;
          const periodPrincipal: number = payment - periodInterest;
          remainingBalance -= periodPrincipal;
          totalPrincipalPaid += periodPrincipal;
          totalInterestPaid += periodInterest;
        }

        // Calculate the payment breakdown for the first payment of the selected year
        paymentInterest = remainingBalance * r;
        paymentPrincipal = payment - paymentInterest;

        // Set the total values
        principalGained = totalPrincipalPaid;
        totalInterestPaid = totalInterestPaid;
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
      totalInterestPaid,
      principalGained,
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
    validationErrors,

    // Actions
    resetForm,

    // Constants
    FREQUENCY_LABEL,
    YEAR_OPTIONS,
    INPUT_CONSTRAINTS,
  };
}
