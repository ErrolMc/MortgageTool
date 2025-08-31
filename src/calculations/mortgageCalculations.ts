import {
  type MortgageInputs,
  type MortgageResults,
  Frequency,
  AgeOfMortgage as AgeOfMortgage,
} from './mortgageTypes';
import { PERIODS_PER_YEAR } from '@/calculations/utilityMethods';

export function calculateLoanAmount(housePrice: number, totalDeposit: number) {
  return Math.max(0, housePrice - totalDeposit);
}

export function calculatePeriodsPerYear(frequency: Frequency) {
  return PERIODS_PER_YEAR[frequency];
}

export function calculateTotalPeriods(
  termYears: number,
  periodsPerYear: number
) {
  return Math.max(1, Math.round(termYears * periodsPerYear));
}

export function calculatePerPeriodRate(rate: number, periodsPerYear: number) {
  const annualRate = Math.max(0, rate) / 100;
  return annualRate / periodsPerYear;
}

export function calculateTotalPaymentAmount(
  paymentForPeriod: number,
  totalPeriods: number
) {
  return paymentForPeriod * totalPeriods;
}

export function calculateTotalInterestAmount(
  totalPaymentAmount: number,
  loanAmount: number
) {
  return Math.max(0, totalPaymentAmount - loanAmount);
}

// Calculate base mortgage payment
export function calculateBasePayment(
  loanAmount: number,
  periodRate: number,
  n: number
): number {
  if (loanAmount <= 0) {
    return 0;
  }

  if (Math.abs(periodRate) < 1e-10) {
    // Use small epsilon for floating point comparison
    return loanAmount / n;
  }

  return (loanAmount * periodRate) / (1 - Math.pow(1 + periodRate, -n));
}

// Calculate progress up to a specific year
export function calculateProgressToYear(
  loanAmount: number,
  paymentForPeriod: number,
  rate: number,
  periodsPerYear: number,
  ageOfMortgage: AgeOfMortgage
) {
  const periodRate = calculatePerPeriodRate(rate, periodsPerYear);
  const firstPaymentInterest = loanAmount * periodRate;
  let principalFromOnePaymentAtAgeOfMortgage = paymentForPeriod - firstPaymentInterest;

  let interestFromOnePaymentAtAgeOfMortgage = 0;
  let totalInterestPaidUpToAgeOfMortgage = 0;
  let totalPrincipalGainedFromPaymentsUpToAgeOfMortgage = 0;

  if (ageOfMortgage === 'deposit') {
    // Deposit only - no payments made yet
    totalInterestPaidUpToAgeOfMortgage = 0;
    totalPrincipalGainedFromPaymentsUpToAgeOfMortgage = 0;
    interestFromOnePaymentAtAgeOfMortgage = firstPaymentInterest;
  } else if (ageOfMortgage === 'first') {
    // First payment
    interestFromOnePaymentAtAgeOfMortgage = firstPaymentInterest;
    totalInterestPaidUpToAgeOfMortgage = firstPaymentInterest;
    totalPrincipalGainedFromPaymentsUpToAgeOfMortgage = principalFromOnePaymentAtAgeOfMortgage;
  } else {
    // Calculate for specific year
    const yearNumber = parseInt(ageOfMortgage);
    const periodsToYear = yearNumber * periodsPerYear;
    let remainingBalance = loanAmount;
    let totalPrincipalPaid = 0;

    // Calculate total principal and interest paid up to the selected year
    for (let i = 0; i < periodsToYear; i++) {
      const periodInterest = remainingBalance * periodRate;
      const periodPrincipal = paymentForPeriod - periodInterest;
      remainingBalance -= periodPrincipal;
      totalPrincipalPaid += periodPrincipal;
      totalInterestPaidUpToAgeOfMortgage += periodInterest;
    }

    // Calculate the payment breakdown for the first payment of the selected year
    interestFromOnePaymentAtAgeOfMortgage = remainingBalance * periodRate;
    principalFromOnePaymentAtAgeOfMortgage = paymentForPeriod - interestFromOnePaymentAtAgeOfMortgage;

    // Set the total values
    totalPrincipalGainedFromPaymentsUpToAgeOfMortgage = totalPrincipalPaid;
  }

  return {
    principalFromOnePaymentAtAgeOfMortgage,
    interestFromOnePaymentAtAgeOfMortgage,
    totalInterestPaidUpToAgeOfMortgage,
    totalPrincipalGainedFromPaymentsUpToAgeOfMortgage,
  };
}

// Calculate sale proceeds
export function calculateSaleProceeds(
  salePrice: number,
  principalGained: number,
  deposit: number,
  loanAmount: number
) {
  const saleProceeds = salePrice || 0;
  const remainingBalance = loanAmount - principalGained;
  const netProceeds = saleProceeds - remainingBalance;
  const equity = deposit + principalGained;
  const saleProfit = netProceeds - equity;
  const saleProfitWithoutPrincipal = netProceeds - deposit;

  return {
    saleProceeds,
    remainingBalance,
    netProceeds,
    equity,
    saleProfit,
    saleProfitWithoutPrincipal,
  };
}

// Main calculation function
export function calculateMortgage(inputs: MortgageInputs): MortgageResults {
  const loanAmount = calculateLoanAmount(inputs.price, inputs.deposit);
  const periodsPerYear = calculatePeriodsPerYear(inputs.frequency);
  const totalPeriods = calculateTotalPeriods(inputs.termYears, periodsPerYear);
  const periodRate = calculatePerPeriodRate(inputs.rate, periodsPerYear); // nominal per-period rate

  const paymentForPeriod = calculateBasePayment(
    loanAmount,
    periodRate,
    totalPeriods
  );
  const totalPaid = calculateTotalPaymentAmount(paymentForPeriod, totalPeriods);
  const totalInterest = calculateTotalInterestAmount(totalPaid, loanAmount);

  const {
    principalFromOnePaymentAtAgeOfMortgage,
    interestFromOnePaymentAtAgeOfMortgage,
    totalInterestPaidUpToAgeOfMortgage,
    totalPrincipalGainedFromPaymentsUpToAgeOfMortgage,
  } = calculateProgressToYear(
    loanAmount,
    paymentForPeriod,
    inputs.rate,
    periodsPerYear,
    inputs.ageOfMortgage
  );

  const {
    saleProceeds,
    remainingBalance,
    netProceeds,
    equity,
    saleProfit,
    saleProfitWithoutPrincipal,
  } = calculateSaleProceeds(
    inputs.salePrice,
    totalPrincipalGainedFromPaymentsUpToAgeOfMortgage,
    inputs.deposit,
    loanAmount
  );

  return {
    paymentForPeriod,
    totalPaid,
    loanAmount,
    totalInterest,
    totalPeriods,
    periodsPerYear,
    principalFromOnePaymentAtAgeOfMortgage,
    interestFromOnePaymentAtAgeOfMortgage,
    totalInterestPaidUpToAgeOfMortgage,
    totalPrincipalGainedFromPaymentsUpToAgeOfMortgage,
    remainingBalance,
    saleProceeds,
    netProceeds,
    equity,
    saleProfit,
    saleProfitWithoutPrincipal,
  } as MortgageResults;
}
