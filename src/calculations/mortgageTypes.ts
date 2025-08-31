export interface MortgageInputs {
  price: number;
  deposit: number;
  rate: number;
  termYears: number;
  frequency: Frequency;
  ageOfMortgage: AgeOfMortgage;
  salePrice: number;
}

export interface MortgageResults {
  // Basic payment calculations
  paymentForPeriod: number;
  totalPaid: number;
  loanAmount: number;
  totalInterest: number;
  totalPeriods: number;
  periodsPerYear: number;

  // Payment breakdown for selected year
  principalFromOnePaymentAtAgeOfMortgage: number;
  interestFromOnePaymentAtAgeOfMortgage: number;

  // Progress calculations
  totalEquityAtAgeOfMortgage: number;
  totalInterestPaidUpToAgeOfMortgage: number;
  totalPrincipalGainedFromPaymentsUpToAgeOfMortgage: number;
  remainingBalance: number;

  // Sale calculations
  netProceeds: number; // this is the take home after covering the remaining mortgage
}

export type Frequency = 'yearly' | 'monthly' | 'fortnightly' | 'weekly';
export type AgeOfMortgage = 'deposit' | 'first' | '5' | '10' | '15' | '20' | '25' | '27' | '29' | '30';
