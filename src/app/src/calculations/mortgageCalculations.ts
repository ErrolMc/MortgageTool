import { MortgageInputs, MortgageResults } from '../types/mortgageTypes';
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
  calculateMortgageWithExtraRepayments,
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

  // Calculate extra repayments impact
  const extraRepaymentsResult = calculateMortgageWithExtraRepayments(
    loanAmount,
    periodRate,
    totalPeriods,
    inputs.extraRepayments,
    periodsPerYear
  );

  // values that change with age of mortgage
  const {
    remainingBalance,
    startOfPeriodBalance,
    totalExtraRepaymentsAtAgeOfMortgage,
  } = calculateRemainingBalanceAtAgeOfMortgage(
    loanAmount,
    paymentForPeriod,
    periodRate,
    periodsPerYear,
    inputs.ageOfMortgage,
    inputs.extraRepayments
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
      remainingBalance,
      totalExtraRepaymentsAtAgeOfMortgage
    );

  const totalInterestPaidUpToAgeOfMortgage =
    calculateTotalInterestPaidFromPaymentsUpToAgeOfMortgage(
      totalPrincipalGainedFromPaymentsUpToAgeOfMortgage,
      paymentForPeriod,
      inputs.ageOfMortgage,
      periodsPerYear
    );

  const netProceeds = calculateNetProceeds(inputs.salePrice, remainingBalance);

  const result = new MortgageResults();
  result.paymentForPeriod = paymentForPeriod;
  result.totalPaid = totalPaid;
  result.loanAmount = loanAmount;
  result.totalInterest = totalInterest;
  result.totalPeriods = totalPeriods;
  result.periodsPerYear = periodsPerYear;
  result.principalFromOnePaymentAtAgeOfMortgage = principalFromOnePaymentAtAgeOfMortgage;
  result.interestFromOnePaymentAtAgeOfMortgage = interestFromOnePaymentAtAgeOfMortgage;
  result.totalInterestPaidUpToAgeOfMortgage = totalInterestPaidUpToAgeOfMortgage;
  result.principalGainedFromRegularPaymentsUpToAgeOfMortgage = totalPrincipalGainedFromPaymentsUpToAgeOfMortgage;
  result.remainingBalance = remainingBalance;
  result.netProceeds = netProceeds;
  result.totalExtraRepayments = extraRepaymentsResult.totalExtraRepayments;
  result.interestSaved = extraRepaymentsResult.interestSaved;
  result.timeSavedYears = extraRepaymentsResult.timeSavedYears;
  result.newTotalPaid = extraRepaymentsResult.newTotalPaid;
  result.totalPrincipalGainedFromExtraRepaymentsUpToAgeOfMortgage = totalExtraRepaymentsAtAgeOfMortgage;
  return result;
}
