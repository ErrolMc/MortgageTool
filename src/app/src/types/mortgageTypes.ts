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
    return (
      this.loanAmount + this.totalPrincipalGainedFromPaymentsUpToAgeOfMortgage
    );
  }
}

export type Frequency = 'yearly' | 'monthly' | 'fortnightly' | 'weekly';
export type AgeOfMortgageType =
  | 'deposit'
  | 'first'
  | '5'
  | '10'
  | '15'
  | '20'
  | '25'
  | '27'
  | '29'
  | '30'
  | 'custom';

export class AgeOfMortgage {
  private _type: AgeOfMortgageType;
  private _ageYears: number;

  private constructor(Type: AgeOfMortgageType) {
    this._type = Type;
    this._ageYears = 0;
  }

  public get ageYears(): number {
    return this._ageYears;
  }

  public get type(): AgeOfMortgageType {
    return this._type;
  }

  public static MakeCustom(AgeYears: number): AgeOfMortgage {
    const obj = new AgeOfMortgage('custom');
    obj._ageYears = AgeYears;
    return obj;
  }

  public static MakeFromEnum(Type: AgeOfMortgageType): AgeOfMortgage {
    const obj = new AgeOfMortgage(Type);
    if (Type === 'deposit') {
      obj._ageYears = 0;
    } else if (Type === 'first') {
      throw new Error('Need to use make with frequency');
    } else if (Type === 'custom') {
      obj._ageYears = 0;
      return obj;
    } else {
      obj._ageYears = parseInt(Type);
    }
    return obj;
  }

  public static MakeFromFrequency(Frequency: Frequency): AgeOfMortgage {
    const obj = new AgeOfMortgage('first');
    switch (Frequency) {
      case 'yearly':
        obj._ageYears = 1;
        break;
      case 'monthly':
        obj._ageYears = 1 / 12;
        break;
      case 'fortnightly':
        obj._ageYears = 1 / 26;
        break;
      case 'weekly':
        obj._ageYears = 1 / 52;
        break;
    }
    return obj;
  }

  public get timeLabel(): string {
    if (this._ageYears === 0) {
      return 'deposit only';
    } else if (this._type === 'first') {
      return 'first payment';
    } else {
      return `year ${this._ageYears}`;
    }
  }
}
