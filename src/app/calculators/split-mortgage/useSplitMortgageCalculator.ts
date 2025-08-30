import { useMemo, useState } from 'react';
import {
  useBaseMortgageCalculator,
  PERIODS_PER_YEAR,
  formatCurrency,
  formatInputNumber,
  parseInputNumber,
  type Frequency,
  type YearOption,
  type ValidationErrors,
} from '@/hooks/useBaseMortgageCalculator';

// Extend ValidationErrors for split mortgage specific fields
interface SplitValidationErrors extends ValidationErrors {
  salePrice?: string;
}

// Re-export for convenience
export { formatCurrency, formatInputNumber, parseInputNumber, type YearOption };

export function useSplitMortgageCalculator() {
  const baseCalculator = useBaseMortgageCalculator();
  const {
    price,
    setPrice,
    rate,
    setRate,
    termYears,
    setTermYears,
    frequency,
    setFrequency,
    selectedYear,
    setSelectedYear,
    principal,
    validationErrors: baseValidationErrors,
    resetForm: baseResetForm,
    FREQUENCY_LABEL,
    YEAR_OPTIONS,
    INPUT_CONSTRAINTS,
  } = baseCalculator;

  // Split-specific state
  const [person1Deposit, setPerson1Deposit] = useState<number>(
    baseCalculator.deposit / 2
  );
  const [person2Deposit, setPerson2Deposit] = useState<number>(
    baseCalculator.deposit / 2
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

  const results = useMemo(() => {
    const freq: Frequency = frequency;
    const periodsPerYear: number = PERIODS_PER_YEAR[freq];
    const n: number = Math.max(
      1,
      Math.round((termYears || 0) * periodsPerYear)
    );
    const annualRate: number = Math.max(0, rate) / 100;
    const r: number = annualRate / periodsPerYear; // nominal per-period rate

    let payment: number = 0;
    if (splitPrincipal <= 0) {
      payment = 0;
    } else if (Math.abs(r) < 1e-10) {
      // Use small epsilon for floating point comparison
      payment = splitPrincipal / n;
    } else {
      payment = (splitPrincipal * r) / (1 - Math.pow(1 + r, -n));
    }

    const totalPaid: number = payment * n;
    const interest: number = Math.max(0, totalPaid - splitPrincipal);

    // Calculate individual payments
    const person1Payment: number = payment * person1RepaymentShare;
    const person2Payment: number = payment * (1 - person1RepaymentShare);

    // Calculate principal and interest portions for the selected year
    let paymentPrincipal: number = 0;
    let paymentInterest: number = 0;

    if (selectedYear === 'first') {
      // First payment
      const firstPaymentInterest: number = splitPrincipal * r;
      paymentPrincipal = payment - firstPaymentInterest;
      paymentInterest = firstPaymentInterest;
    } else {
      // Calculate for specific year
      const yearNumber: number = parseInt(selectedYear);
      if (yearNumber <= termYears) {
        const periodsToYear: number = yearNumber * periodsPerYear;
        let remainingBalance: number = splitPrincipal;

        // Calculate remaining balance after payments up to the selected year
        for (let i = 0; i < periodsToYear; i++) {
          const periodInterest: number = remainingBalance * r;
          const periodPrincipal: number = payment - periodInterest;
          remainingBalance -= periodPrincipal;
        }

        // Calculate the payment breakdown for the first payment of the selected year
        paymentInterest = remainingBalance * r;
        paymentPrincipal = payment - paymentInterest;
      }
    }

    // Calculate equity and total interest paid at the selected point in time
    let person1Equity: number = person1Deposit;
    let person2Equity: number = person2Deposit;
    let person1TotalInterest: number = 0;
    let person2TotalInterest: number = 0;

    if (selectedYear === 'deposit') {
      // Deposit only - no payments made yet
      person1Equity = person1Deposit;
      person2Equity = person2Deposit;
      person1TotalInterest = 0;
      person2TotalInterest = 0;
    } else if (selectedYear === 'first') {
      // For first payment, include the principal portion of that payment
      const person1PrincipalContribution: number =
        paymentPrincipal * person1RepaymentShare;
      const person2PrincipalContribution: number =
        paymentPrincipal * (1 - person1RepaymentShare);

      person1Equity = person1Deposit + person1PrincipalContribution;
      person2Equity = person2Deposit + person2PrincipalContribution;

      // For first payment, total interest is just the interest portion of that payment
      person1TotalInterest = paymentInterest * person1RepaymentShare;
      person2TotalInterest = paymentInterest * (1 - person1RepaymentShare);
    } else {
      // Calculate equity and total interest at the selected year
      const yearNumber: number = parseInt(selectedYear);
      if (yearNumber <= termYears) {
        const periodsToYear: number = yearNumber * periodsPerYear;
        let remainingBalance: number = splitPrincipal;
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

        // Calculate how much each person has contributed to principal
        const person1PrincipalContribution: number =
          totalPrincipalPaid * person1RepaymentShare;
        const person2PrincipalContribution: number =
          totalPrincipalPaid * (1 - person1RepaymentShare);

        // Calculate how much interest each person has paid
        person1TotalInterest = totalInterestPaid * person1RepaymentShare;
        person2TotalInterest = totalInterestPaid * (1 - person1RepaymentShare);

        // Equity = deposit + principal contribution
        person1Equity = person1Deposit + person1PrincipalContribution;
        person2Equity = person2Deposit + person2PrincipalContribution;
      }
    }

    const totalEquity = person1Equity + person2Equity;
    const person1EquityShare: number =
      totalEquity > 0 ? (person1Equity / totalEquity) * 100 : 0;
    const person2EquityShare: number =
      totalEquity > 0 ? (person2Equity / totalEquity) * 100 : 0;

    // Calculate sale proceeds distribution
    const saleProceeds = salePrice || 0;
    
    // Calculate remaining mortgage balance at the selected year
    let remainingBalance = splitPrincipal;
    if (selectedYear !== 'deposit') {
      const yearNumber = selectedYear === 'first' ? 0 : parseInt(selectedYear);
      const periodsToYear = yearNumber * periodsPerYear;
      
      // Calculate remaining balance after payments up to the selected year
      for (let i = 0; i < periodsToYear; i++) {
        const periodInterest = remainingBalance * r;
        const periodPrincipal = payment - periodInterest;
        remainingBalance -= periodPrincipal;
      }
    }
    
    // Calculate net proceeds after paying off remaining mortgage
    const netProceeds = saleProceeds - remainingBalance;
    const person1SaleProceeds = totalEquity > 0 ? (person1Equity / totalEquity) * netProceeds : 0;
    const person2SaleProceeds = totalEquity > 0 ? (person2Equity / totalEquity) * netProceeds : 0;
    const saleProfit = netProceeds - totalEquity;
    const person1SaleProfit = totalEquity > 0 ? (person1Equity / totalEquity) * saleProfit : 0;
    const person2SaleProfit = totalEquity > 0 ? (person2Equity / totalEquity) * saleProfit : 0;

    return {
      payment,
      person1Payment,
      person2Payment,
      totalPaid,
      principal: splitPrincipal,
      interest,
      n,
      periodsPerYear,
      paymentPrincipal,
      paymentInterest,
      person1Equity,
      person2Equity,
      person1EquityShare,
      person2EquityShare,
      person1TotalInterest,
      person2TotalInterest,
      saleProceeds,
      remainingBalance,
      netProceeds,
      person1SaleProceeds,
      person2SaleProceeds,
      saleProfit,
      person1SaleProfit,
      person2SaleProfit,
    };
  }, [
    splitPrincipal,
    frequency,
    rate,
    termYears,
    selectedYear,
    person1Deposit,
    person2Deposit,
    person1RepaymentShare,
    salePrice,
  ]);

  const resetForm = () => {
    baseResetForm();
    setPerson1Deposit(baseCalculator.deposit / 2);
    setPerson2Deposit(baseCalculator.deposit / 2);
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
    selectedYear,
    setSelectedYear,

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
