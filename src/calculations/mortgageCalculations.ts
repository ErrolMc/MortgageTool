import {
  type MortgageInputs,
  type MortgageResults,
  Frequency,
  AgeOfMortgage as AgeOfMortgage,
} from './mortgageTypes';
import { PERIODS_PER_YEAR } from '@/calculations/utilityMethods';

export function calculateLoanAmount(housePrice: number, totalDeposit: number) {
  return Math.max(0, Math.max(0, housePrice) - Math.max(0, totalDeposit));
}

export function calculatePeriodsPerYear(frequency: Frequency) {
  return PERIODS_PER_YEAR[frequency];
}

export function calculateTotalPeriods(
  termYears: number,
  periodsPerYear: number
) {
  return Math.max(
    0,
    Math.round(Math.max(0, termYears) * Math.max(0, periodsPerYear))
  );
}

export function calculatePerPeriodRate(rate: number, periodsPerYear: number) {
  if (periodsPerYear <= 0) {
    return 0;
  }
  const annualRate: number = Math.max(0, rate) / 100.0;

  //if (useEffective) {
  //  return Math.pow(1 + annualRate, 1 / periodsPerYear) - 1;
  //}
  return annualRate / periodsPerYear;
}

export function calculateTotalPaymentAmount(
  paymentForPeriod: number,
  totalPeriods: number
) {
  return Math.max(0, paymentForPeriod) * Math.max(0, totalPeriods);
}

export function calculateTotalInterestAmount(
  totalPaymentAmount: number,
  loanAmount: number
) {
  if (loanAmount <= 0) return 0;
  return Math.max(0, totalPaymentAmount - loanAmount);
}

export function calculateRemainingBalance(
  loanAmount: number,
  principalGained: number
) {
  if (loanAmount <= 0) {
    return 0;
  }
  return loanAmount - Math.max(0, principalGained);
}

export function calculateNetProceeds(
  salePrice: number,
  remainingBalance: number
) {
  return Math.max(0, salePrice - Math.max(0, remainingBalance));
}

export function calculateMortgageRepaymentForPeriod(
  loanAmount: number,
  periodRate: number,
  totalPeriods: number
): number {
  if (loanAmount <= 0 || periodRate <= 0 || totalPeriods <= 0) {
    return 0;
  }

  if (Math.abs(periodRate) < 1e-10) {
    // Use small epsilon for floating point comparison
    return loanAmount / totalPeriods;
  }

  return (
    (loanAmount * periodRate) / (1 - Math.pow(1 + periodRate, -totalPeriods))
  );
}

export function calculateRemainingBalanceAtAgeOfMortgage(
  loanAmount: number,
  paymentForPeriod: number,
  periodRate: number,
  periodsPerYear: number,
  ageOfMortgage: AgeOfMortgage
) {
  if (ageOfMortgage === 'deposit') {
    return loanAmount;
  }

  if (ageOfMortgage === 'first') {
    const firstPaymentInterest: number = loanAmount * periodRate;
    const principalFromOnePaymentAtAgeOfMortgage: number =
      paymentForPeriod - firstPaymentInterest;
    const remainingBalance: number =
      loanAmount - principalFromOnePaymentAtAgeOfMortgage;

    return remainingBalance;
  }

  // Calculate for specific year
  const totalPeriods: number = calculateTotalPeriods(
    parseInt(ageOfMortgage),
    periodsPerYear
  );

  // Calculate total principal and interest paid up to the selected year
  let remainingBalance: number = loanAmount;
  for (let i = 0; i < totalPeriods; i++) {
    const periodInterest: number = remainingBalance * periodRate;
    const periodPrincipal: number = paymentForPeriod - periodInterest;
    remainingBalance -= periodPrincipal;
  }

  return remainingBalance;
}

export function calculateInterestForOnePaymentAtAgeOfMortgage(
  loanAmount: number,
  remainingBalance: number,
  periodRate: number,
  ageOfMortgage: AgeOfMortgage
) {
  if (ageOfMortgage === 'deposit') {
    return 0;
  }

  if (ageOfMortgage === 'first') return loanAmount * periodRate;
  return remainingBalance * periodRate;
}

export function calculatePrincipalForOnePaymentAtAgeOfMortgage(
  paymentForPeriod: number,
  interestForOnePaymentAtAgeOfMortgage: number
) {
  if (paymentForPeriod <= 0 || interestForOnePaymentAtAgeOfMortgage <= 0) {
    return 0;
  }
  return paymentForPeriod - interestForOnePaymentAtAgeOfMortgage;
}

// Calculate progress up to a specific year
export function calculateTotalPrincipalGainedFromPaymentsUpToAgeOfMortgage(
  loanAmount: number,
  remainingBalance: number
) {
  return Math.max(0, loanAmount - Math.max(0, remainingBalance));
}

export function calculateTotalInterestPaidFromPaymentsUpToAgeOfMortgage(
  totalPrincipalGainedFromPaymentsUpToAgeOfMortgage: number,
  paymentForPeriod: number,
  ageOfMortgage: AgeOfMortgage,
  periodsPerYear: number
) {
  if (
    ageOfMortgage === 'deposit' ||
    totalPrincipalGainedFromPaymentsUpToAgeOfMortgage <= 0 ||
    paymentForPeriod <= 0 ||
    periodsPerYear <= 0
  ) {
    return 0;
  }

  if (ageOfMortgage === 'first') {
    const firstPaymentInterest =
      paymentForPeriod - totalPrincipalGainedFromPaymentsUpToAgeOfMortgage;
    return firstPaymentInterest;
  }

  const totalPeriods: number = calculateTotalPeriods(
    parseInt(ageOfMortgage),
    periodsPerYear
  );
  const totalPaid = calculateTotalPaymentAmount(paymentForPeriod, totalPeriods);
  return totalPaid - totalPrincipalGainedFromPaymentsUpToAgeOfMortgage;
}

// Main calculation function
export function calculateMortgage(inputs: MortgageInputs): MortgageResults {
  // constants regardles of age of mortgage
  const loanAmount = calculateLoanAmount(inputs.price, inputs.deposit);
  const periodsPerYear = calculatePeriodsPerYear(inputs.frequency);
  const totalPeriods = calculateTotalPeriods(inputs.termYears, periodsPerYear);
  const periodRate = calculatePerPeriodRate(inputs.rate, periodsPerYear);
  const paymentForPeriod = calculateMortgageRepaymentForPeriod(
    loanAmount,
    periodRate,
    totalPeriods
  );
  const totalPaid = calculateTotalPaymentAmount(paymentForPeriod, totalPeriods);
  const totalInterest = calculateTotalInterestAmount(totalPaid, loanAmount);

  // values that change with age of mortgage
  const remainingBalance = calculateRemainingBalanceAtAgeOfMortgage(
    loanAmount,
    paymentForPeriod,
    periodRate,
    periodsPerYear,
    inputs.ageOfMortgage
  );

  const interestFromOnePaymentAtAgeOfMortgage =
    calculateInterestForOnePaymentAtAgeOfMortgage(
      loanAmount,
      remainingBalance,
      periodRate,
      inputs.ageOfMortgage
    );

  const principalFromOnePaymentAtAgeOfMortgage =
    calculatePrincipalForOnePaymentAtAgeOfMortgage(
      paymentForPeriod,
      interestFromOnePaymentAtAgeOfMortgage
    );

  const totalPrincipalGainedFromPaymentsUpToAgeOfMortgage =
    calculateTotalPrincipalGainedFromPaymentsUpToAgeOfMortgage(
      loanAmount,
      remainingBalance
    );

  const totalInterestPaidUpToAgeOfMortgage =
    calculateTotalInterestPaidFromPaymentsUpToAgeOfMortgage(
      totalPrincipalGainedFromPaymentsUpToAgeOfMortgage,
      paymentForPeriod,
      inputs.ageOfMortgage,
      periodsPerYear
    );

  const totalEquityAtAgeOfMortgage: number =
    inputs.deposit + totalPrincipalGainedFromPaymentsUpToAgeOfMortgage;

  const netProceeds = calculateNetProceeds(inputs.salePrice, remainingBalance);

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
    totalEquityAtAgeOfMortgage,
    netProceeds,
  } as MortgageResults;
}
