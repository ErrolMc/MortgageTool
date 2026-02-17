import { Frequency, AgeOfMortgage } from '../types/mortgageTypes';
import { PERIODS_PER_YEAR } from '@/app/src/calculations/utilityMethods';

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

export function calculateInterestForOnePaymentAtAgeOfMortgage(
  startOfPeriodBalance: number,
  periodRate: number,
  ageOfMortgage: AgeOfMortgage
) {
  if (ageOfMortgage.ageYears === 0) {
    return 0;
  }

  return startOfPeriodBalance * periodRate;
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
  remainingBalance: number,
  totalExtraRepayments: number
) {
  const remainingBalanceWithoutExtraRepayments = Math.max(0, remainingBalance) + Math.max(0, totalExtraRepayments);
  return Math.max(0, loanAmount - remainingBalanceWithoutExtraRepayments);
}

export function calculateTotalInterestPaidFromPaymentsUpToAgeOfMortgage(
  totalPrincipalGainedFromPaymentsUpToAgeOfMortgage: number,
  paymentForPeriod: number,
  ageOfMortgage: AgeOfMortgage,
  periodsPerYear: number
) {
  if (
    ageOfMortgage.ageYears === 0 ||
    totalPrincipalGainedFromPaymentsUpToAgeOfMortgage <= 0 ||
    paymentForPeriod <= 0 ||
    periodsPerYear <= 0
  ) {
    return 0;
  }

  const totalPeriods: number = calculateTotalPeriods(
    ageOfMortgage.ageYears,
    periodsPerYear
  );
  const totalPaid = calculateTotalPaymentAmount(paymentForPeriod, totalPeriods);
  return totalPaid - totalPrincipalGainedFromPaymentsUpToAgeOfMortgage;
}

export function calculateRemainingBalanceAtAgeOfMortgage(
  loanAmount: number,
  paymentForPeriod: number,
  periodRate: number,
  periodsPerYear: number,
  ageOfMortgage: AgeOfMortgage,
  extraRepayments: number = 0
): {
  remainingBalance: number;
  startOfPeriodBalance: number;
  totalExtraRepaymentsAtAgeOfMortgage: number;
} {
  const totalPeriods: number = calculateTotalPeriods(
    ageOfMortgage.ageYears,
    periodsPerYear
  );

  let totalExtraRepaymentsAtAgeOfMortgage: number = 0;
  let startOfPeriodBalance: number = loanAmount;
  let remainingBalance: number = loanAmount;

  for (let i = 0; i < totalPeriods; i++) {
    startOfPeriodBalance = remainingBalance;

    const periodInterest: number = remainingBalance * periodRate;
    const periodPrincipal: number = Math.min(
      Math.max(0, paymentForPeriod - periodInterest),
      remainingBalance
    );

    remainingBalance -= periodPrincipal;

    const extraPaymentThisPeriod = Math.min(extraRepayments, remainingBalance);
    remainingBalance -= extraPaymentThisPeriod;
    totalExtraRepaymentsAtAgeOfMortgage += extraPaymentThisPeriod;

    if (remainingBalance <= 0.01) {
      remainingBalance = 0;
      break;
    }
  }

  return {
    remainingBalance,
    startOfPeriodBalance,
    totalExtraRepaymentsAtAgeOfMortgage,
  };
}

// extra repayments calculation functions
export function calculateMortgageWithExtraRepayments(
  loanAmount: number,
  periodRate: number,
  totalPeriods: number,
  extraRepayments: number,
  periodsPerYear: number
): {
  newTotalPeriods: number;
  newTotalPaid: number;
  totalExtraRepayments: number;
  interestSaved: number;
  timeSavedYears: number;
} {
  const regularPayment = calculateMortgageRepaymentForPeriod(
    loanAmount,
    periodRate,
    totalPeriods
  );

  const originalTotalPaid = calculateTotalPaymentAmount(regularPayment, totalPeriods);

  if (extraRepayments <= 0) {
    return {
      newTotalPeriods: totalPeriods,
      newTotalPaid: calculateTotalPaymentAmount(regularPayment, totalPeriods),
      totalExtraRepayments: 0,
      interestSaved: 0,
      timeSavedYears: 0,
    };
  }

  // Calculate how many periods it would take to pay off the loan with extra repayments (applied before interest)
  let remainingBalance = loanAmount;
  let periodsElapsed = 0;
  let totalExtraPaid = 0;
  let totalRegularPaid = 0;

  // Safety check to prevent infinite loops
  while (remainingBalance > 0.01 && periodsElapsed < totalPeriods * 2) {
    const interestPayment = remainingBalance * periodRate;
    const principalFromRegularPayment = Math.min(
      Math.max(0, regularPayment - interestPayment),
      remainingBalance
    );

    // Track the actual regular payment made this period. On the final period
    // this can be less than the scheduled regularPayment
    totalRegularPaid += interestPayment + principalFromRegularPayment;
    remainingBalance -= principalFromRegularPayment;

    const extraPaymentThisPeriod = Math.min(extraRepayments, remainingBalance);
    remainingBalance -= extraPaymentThisPeriod;
    totalExtraPaid += extraPaymentThisPeriod;

    periodsElapsed++;
  }

  const newTotalPeriods = periodsElapsed;
  const newTotalPaid = totalRegularPaid + totalExtraPaid;
  const interestSaved = originalTotalPaid - newTotalPaid;
  const timeSavedYears = (totalPeriods - newTotalPeriods) / periodsPerYear;

  return {
    newTotalPeriods,
    newTotalPaid,
    totalExtraRepayments: totalExtraPaid,
    interestSaved: Math.max(0, interestSaved),
    timeSavedYears: Math.max(0, timeSavedYears),
  };
}
