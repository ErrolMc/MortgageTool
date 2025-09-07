export interface MortgageInputs {
  price: number;
  deposit: number;
  rate: number;
  termYears: number;
  frequency: Frequency;
  ageOfMortgage: AgeOfMortgage;
  salePrice: number;
}

export class MortgageResults {
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
  totalInterestPaidUpToAgeOfMortgage: number;
  totalPrincipalGainedFromPaymentsUpToAgeOfMortgage: number;
  remainingBalance: number;

  // Sale calculations
  netProceeds: number; // this is the take home after covering the remaining mortgage

  constructor() {
    this.paymentForPeriod = 0;
    this.totalPaid = 0;
    this.loanAmount = 0;
    this.totalInterest = 0;
    this.totalPeriods = 0;
    this.periodsPerYear = 0;
    this.principalFromOnePaymentAtAgeOfMortgage = 0;
    this.interestFromOnePaymentAtAgeOfMortgage = 0;
    this.totalInterestPaidUpToAgeOfMortgage = 0;
    this.totalPrincipalGainedFromPaymentsUpToAgeOfMortgage = 0;
    this.remainingBalance = 0;
    this.netProceeds = 0;
  }

  public get totalEquityAtAgeOfMortgage(): number {
    return this.loanAmount + this.totalPrincipalGainedFromPaymentsUpToAgeOfMortgage;
  }
}

export type Frequency = 'yearly' | 'monthly' | 'fortnightly' | 'weekly';
export type AgeOfMortgage = 'deposit' | 'first' | '5' | '10' | '15' | '20' | '25' | '27' | '29' | '30';
