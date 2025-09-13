import {
  type MortgageInputs,
  type MortgageResults,
} from '../types/mortgageTypes';
import {
  calculateLoanAmount,
  calculatePeriodsPerYear,
  calculateTotalPeriods,
  calculatePerPeriodRate,
  calculateMortgageRepaymentForPeriod,
  calculateTotalPaymentAmount,
  calculateTotalInterestAmount,
  calculateRemainingBalanceAtAgeOfMortgage,
  calculateInterestForOnePaymentAtAgeOfMortgage,
  calculatePrincipalForOnePaymentAtAgeOfMortgage,
  calculateTotalPrincipalGainedFromPaymentsUpToAgeOfMortgage,
  calculateTotalInterestPaidFromPaymentsUpToAgeOfMortgage,
  calculateNetProceeds,
} from './mortgageCalculationUtilities';

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
  const { remainingBalance, startOfPeriodBalance } =
    calculateRemainingBalanceAtAgeOfMortgage(
      loanAmount,
      paymentForPeriod,
      periodRate,
      periodsPerYear,
      inputs.ageOfMortgage
    );

  const interestFromOnePaymentAtAgeOfMortgage =
    calculateInterestForOnePaymentAtAgeOfMortgage(
      startOfPeriodBalance,
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
