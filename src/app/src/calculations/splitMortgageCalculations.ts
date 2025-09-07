import {
  SplitMortgageInputs,
  SplitMortgageResults,
} from '../types/splitMortgageTypes';
import { calculateMortgage } from './mortgageCalculations';
import { MortgageResults } from '../types/mortgageTypes';
import { SplitMortgageIndividualResult } from '../types/splitMortgageTypes';

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
    person1Result.principalGainedFromPaymentsAtAgeOfMortgage =
      baseResults.totalPrincipalGainedFromPaymentsUpToAgeOfMortgage *
      inputs.person1RepaymentShare;
    person2Result.principalGainedFromPaymentsAtAgeOfMortgage =
      baseResults.totalPrincipalGainedFromPaymentsUpToAgeOfMortgage -
      person1Result.principalGainedFromPaymentsAtAgeOfMortgage;

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

  // calculate sale proceeds
  {
    const totalEquityInProperty = person1Result.totalEquityAtAgeOfMortgage + person2Result.totalEquityAtAgeOfMortgage;
    
    const person1EquityShare = person1Result.totalEquityAtAgeOfMortgage / totalEquityInProperty;
    person1Result.saleProceeds =
      baseResults.netProceeds * person1EquityShare;

    const person2EquityShare = person2Result.totalEquityAtAgeOfMortgage / totalEquityInProperty;
    person2Result.saleProceeds =
      baseResults.netProceeds * person2EquityShare;
  }

  return {
    ...baseResults,
    person1: person1Result,
    person2: person2Result,
  } as SplitMortgageResults;
}
