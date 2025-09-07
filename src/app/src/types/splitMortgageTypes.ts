import { MortgageInputs, MortgageResults } from './mortgageTypes';

export interface SplitMortgageInputs extends MortgageInputs {
  person1Deposit: number;
  person2Deposit: number;
  person1RepaymentShare: number;
}

export class SplitMortgageIndividualResult {
  // totals for up to the period
  mandatoryPaymentPerPeriod: number;
  interestForPeriodAtAgeOfMortgage: number;
  
  // progress calculcations
  interestPaidFromPaymentsAtAgeOfMortgage: number;
  principalGainedFromPaymentsAtAgeOfMortgage: number;
  
  // totals over whole loan
  totalPrincipalPaidFromPayments: number;
  totalInterestPaidFromPayments: number;

  // sales calculations
  saleProceeds: number;

  private _deposit: number;

  constructor(deposit: number) {
    this._deposit = deposit;
    this.mandatoryPaymentPerPeriod = 0;
    this.interestForPeriodAtAgeOfMortgage = 0;
    this.principalGainedFromPaymentsAtAgeOfMortgage = 0;
    this.interestPaidFromPaymentsAtAgeOfMortgage = 0;
    this.totalPrincipalPaidFromPayments = 0;
    this.totalInterestPaidFromPayments = 0;
    
    this.saleProceeds = 0;
  }

  public get totalPaidAtAgeOfMortgage(): number {
    return this.interestForPeriodAtAgeOfMortgage + this.principalGainedFromPaymentsAtAgeOfMortgage;
  }

  public get totalEquityAtAgeOfMortgage(): number {
    return this._deposit + this.principalGainedFromPaymentsAtAgeOfMortgage;
  }

  public get totalEquity(): number {
    return this._deposit + this.totalPrincipalPaidFromPayments;
  }
}

export interface SplitMortgageResults extends MortgageResults {
  person1: SplitMortgageIndividualResult;
  person2: SplitMortgageIndividualResult;
}