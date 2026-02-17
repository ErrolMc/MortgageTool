import { MortgageInputs, MortgageResults } from './mortgageTypes';

export interface SplitMortgageInputs extends MortgageInputs {
  person1Deposit: number;
  person2Deposit: number;
  person1RepaymentShare: number;
  person1ExtraRepayments: number;
  person2ExtraRepayments: number;
}

export class SplitMortgageIndividualResult {
  // totals for up to the period
  mandatoryPaymentPerPeriod: number;
  interestForPeriodAtAgeOfMortgage: number;
  
  // progress calculcations
  interestPaidFromPaymentsAtAgeOfMortgage: number;
  principalGainedFromRegularPaymentsAtAgeOfMortgage: number;
  principalGainedFromExtraRepaymentsAtAgeOfMortgage: number;
  
  // totals over whole loan
  totalPrincipalPaidFromPayments: number;
  totalInterestPaidFromPayments: number;

  // extra repayments calculations
  totalExtraRepayments: number;
  interestSaved: number;
  timeSavedYears: number;
  newTotalPaid: number;

  // sales calculations
  saleProceeds: number;

  private _deposit: number;

  constructor(deposit: number) {
    this._deposit = deposit;
    this.mandatoryPaymentPerPeriod = 0;
    this.interestForPeriodAtAgeOfMortgage = 0;
    this.principalGainedFromRegularPaymentsAtAgeOfMortgage = 0;
    this.interestPaidFromPaymentsAtAgeOfMortgage = 0;
    this.totalPrincipalPaidFromPayments = 0;
    this.totalInterestPaidFromPayments = 0;
    this.totalExtraRepayments = 0;
    this.interestSaved = 0;
    this.timeSavedYears = 0;
    this.newTotalPaid = 0;
    this.principalGainedFromExtraRepaymentsAtAgeOfMortgage = 0;
    this.saleProceeds = 0;
  }

  public totalPaidAtAgeOfMortgage(): number {
    return this.interestForPeriodAtAgeOfMortgage + this.principalGainedFromRegularPaymentsAtAgeOfMortgage;
  }

  public totalEquityAtAgeOfMortgage(): number {
    return this._deposit + this.principalGainedFromRegularPaymentsAtAgeOfMortgage + this.principalGainedFromExtraRepaymentsAtAgeOfMortgage;
  }

  public totalEquity(): number {
    return this._deposit + this.totalPrincipalPaidFromPayments + this.principalGainedFromExtraRepaymentsAtAgeOfMortgage;
  }

  public principalForPeriodAtAgeOfMortgage(): number {
    return this.mandatoryPaymentPerPeriod - this.interestForPeriodAtAgeOfMortgage;
  }
}

export class SplitMortgageResults extends MortgageResults {
  person1: SplitMortgageIndividualResult;
  person2: SplitMortgageIndividualResult;

  constructor(){
    super();
    this.person1 = new SplitMortgageIndividualResult(0);
    this.person2 = new SplitMortgageIndividualResult(0);
  }
}