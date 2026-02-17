import {
  SplitMortgageInputs,
  SplitMortgageResults,
} from '../types/splitMortgageTypes';
import { calculateMortgage } from './mortgageCalculations';
import { MortgageResults } from '../types/mortgageTypes';
import { SplitMortgageIndividualResult } from '../types/splitMortgageTypes';
import { calculateMortgageWithExtraRepayments, calculatePerPeriodRate, calculateRemainingBalanceAtAgeOfMortgage } from './mortgageCalculationUtilities';

export function calculateSplitMortgage(
  inputs: SplitMortgageInputs
): SplitMortgageResults {
  const baseResults: MortgageResults = calculateMortgage(inputs);

  const [person1Result, person2Result] = [
    new SplitMortgageIndividualResult(inputs.person1Deposit),
    new SplitMortgageIndividualResult(inputs.person2Deposit),
  ];

  // Calculate individual payments
  {
    person1Result.mandatoryPaymentPerPeriod =
      baseResults.paymentForPeriod * inputs.person1RepaymentShare;
    person2Result.mandatoryPaymentPerPeriod =
      baseResults.paymentForPeriod - person1Result.mandatoryPaymentPerPeriod;
  }

  // calculate interest for period at age of mortgage
  {
    person1Result.interestForPeriodAtAgeOfMortgage =
      baseResults.interestFromOnePaymentAtAgeOfMortgage *
      inputs.person1RepaymentShare;
    person2Result.interestForPeriodAtAgeOfMortgage =
      baseResults.interestFromOnePaymentAtAgeOfMortgage -
      person1Result.interestForPeriodAtAgeOfMortgage;
  }

  // calculate amounts gained from payments up to age
  {
    // principal
    person1Result.principalGainedFromRegularPaymentsAtAgeOfMortgage =
      baseResults.principalGainedFromRegularPaymentsUpToAgeOfMortgage *
      inputs.person1RepaymentShare;
    person2Result.principalGainedFromRegularPaymentsAtAgeOfMortgage =
      baseResults.principalGainedFromRegularPaymentsUpToAgeOfMortgage -
      person1Result.principalGainedFromRegularPaymentsAtAgeOfMortgage;

    // interest
    person1Result.interestPaidFromPaymentsAtAgeOfMortgage =
      baseResults.totalInterestPaidUpToAgeOfMortgage *
      inputs.person1RepaymentShare;
    person2Result.interestPaidFromPaymentsAtAgeOfMortgage =
      baseResults.totalInterestPaidUpToAgeOfMortgage -
      person1Result.interestPaidFromPaymentsAtAgeOfMortgage;
  }

  // calculate total principal paid from payments
  {
    person1Result.totalPrincipalPaidFromPayments =
      baseResults.loanAmount * inputs.person1RepaymentShare;
    person2Result.totalPrincipalPaidFromPayments =
      baseResults.loanAmount - person1Result.totalPrincipalPaidFromPayments;
  }

  // calculate total interest paid from payments
  {
    person1Result.totalInterestPaidFromPayments =
      baseResults.totalInterest * inputs.person1RepaymentShare;
    person2Result.totalInterestPaidFromPayments =
      baseResults.totalInterest - person1Result.totalInterestPaidFromPayments;
  }

  // calculate extra repayments impact
  {
    const totalExtraRepayments = inputs.person1ExtraRepayments + inputs.person2ExtraRepayments;
    
    if (totalExtraRepayments > 0) {
      const extraRepaymentResult = calculateMortgageWithExtraRepayments(
        baseResults.loanAmount,
        calculatePerPeriodRate(inputs.rate, baseResults.periodsPerYear),
        baseResults.totalPeriods,
        totalExtraRepayments,
        baseResults.periodsPerYear
      );

      // Split extra repayment results proportionally
      const person1ExtraShare = inputs.person1ExtraRepayments / totalExtraRepayments;
      const person2ExtraShare = inputs.person2ExtraRepayments / totalExtraRepayments;

      person1Result.principalGainedFromRegularPaymentsAtAgeOfMortgage = baseResults.principalGainedFromRegularPaymentsUpToAgeOfMortgage * person1ExtraShare;
      person2Result.principalGainedFromRegularPaymentsAtAgeOfMortgage = baseResults.principalGainedFromRegularPaymentsUpToAgeOfMortgage * person2ExtraShare;

      person1Result.totalExtraRepayments = extraRepaymentResult.totalExtraRepayments * person1ExtraShare;
      person1Result.interestSaved = extraRepaymentResult.interestSaved * person1ExtraShare;
      person1Result.timeSavedYears = extraRepaymentResult.timeSavedYears * person1ExtraShare;

      person2Result.totalExtraRepayments = extraRepaymentResult.totalExtraRepayments * person2ExtraShare;
      person2Result.interestSaved = extraRepaymentResult.interestSaved * person2ExtraShare;
      person2Result.timeSavedYears = extraRepaymentResult.timeSavedYears * person2ExtraShare;

      // Calculate new total paid for each person
      // This is: (person's share of regular payments over shortened term) + (person's extra repayments)
      const shortenedTermTotalPaidForRegularPayments = baseResults.paymentForPeriod * extraRepaymentResult.newTotalPeriods;
      const person1ShortenedTermPaidFromRegularPayments = shortenedTermTotalPaidForRegularPayments * inputs.person1RepaymentShare;
      const person2ShortenedTermPaidFromRegularPayments = shortenedTermTotalPaidForRegularPayments - person1ShortenedTermPaidFromRegularPayments;

      person1Result.newTotalPaid = person1ShortenedTermPaidFromRegularPayments + person1Result.totalExtraRepayments;
      person2Result.newTotalPaid = person2ShortenedTermPaidFromRegularPayments + person2Result.totalExtraRepayments;
    }
  }

  // calculate sale proceeds
  {
    const totalEquityInProperty = person1Result.totalEquityAtAgeOfMortgage() + person2Result.totalEquityAtAgeOfMortgage();
    
    const person1EquityShare = person1Result.totalEquityAtAgeOfMortgage() / totalEquityInProperty;
    person1Result.saleProceeds =
      baseResults.netProceeds * person1EquityShare;

    const person2EquityShare = person2Result.totalEquityAtAgeOfMortgage() / totalEquityInProperty;
    person2Result.saleProceeds =
      baseResults.netProceeds * person2EquityShare;
  }

  return Object.assign(new SplitMortgageResults(), {
    ...baseResults,
    person1: person1Result,
    person2: person2Result,
  });
}
