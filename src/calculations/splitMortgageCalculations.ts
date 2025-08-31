import { Frequency, AgeOfMortgage } from '@/calculations/mortgageTypes';
import { PERIODS_PER_YEAR } from '@/calculations/utilityMethods';

export interface SplitMortgageInputs {
  price: number;
  person1Deposit: number;
  person2Deposit: number;
  person1RepaymentShare: number;
  person1VoluntaryRepayment: number;
  person2VoluntaryRepayment: number;
  rate: number;
  termYears: number;
  frequency: Frequency;
  ageOfMortgage: AgeOfMortgage;
  salePrice: number;
}

export interface SplitMortgageResults {
  // Basic payment calculations
  payment: number;
  person1Payment: number;
  person2Payment: number;
  person1TotalPayment: number;
  person2TotalPayment: number;
  totalPaymentWithVoluntary: number;
  totalPaid: number;
  principal: number;
  interest: number;
  n: number;
  periodsPerYear: number;

  // Payment breakdown for selected year
  paymentPrincipal: number;
  paymentInterest: number;

  // Equity calculations
  person1Equity: number;
  person2Equity: number;
  person1EquityShare: number;
  person2EquityShare: number;
  person1TotalInterest: number;
  person2TotalInterest: number;
  person1TotalPaid: number;
  person2TotalPaid: number;

  // Voluntary repayment totals
  person1VoluntaryRepayment: number;
  person2VoluntaryRepayment: number;

  // Sale calculations
  saleProceeds: number;
  remainingBalance: number;
  netProceeds: number;
  person1SaleProceeds: number;
  person2SaleProceeds: number;
  saleProfit: number;
  saleProfitWithoutPrincipal: number;
  person1SaleProfit: number;
  person2SaleProfit: number;
  person1SaleProfitWithoutPrincipal: number;
  person2SaleProfitWithoutPrincipal: number;
}

// Calculate basic mortgage parameters
export function calculateMortgageParameters(
  price: number,
  totalDeposit: number,
  rate: number,
  termYears: number,
  frequency: Frequency
) {
  const principal = Math.max(0, price - totalDeposit);
  const periodsPerYear = PERIODS_PER_YEAR[frequency];
  const n = Math.max(1, Math.round(termYears * periodsPerYear));
  const annualRate = Math.max(0, rate) / 100;
  const r = annualRate / periodsPerYear; // nominal per-period rate

  return { principal, periodsPerYear, n, r };
}

// Calculate base mortgage payment
export function calculateBasePayment(
  principal: number,
  r: number,
  n: number
): number {
  if (principal <= 0) {
    return 0;
  } else if (Math.abs(r) < 1e-10) {
    return principal / n;
  } else {
    return (principal * r) / (1 - Math.pow(1 + r, -n));
  }
}

// Calculate individual payments
export function calculateIndividualPayments(
  payment: number,
  person1RepaymentShare: number
) {
  const person1Payment = payment * person1RepaymentShare;
  const person2Payment = payment * (1 - person1RepaymentShare);

  return { person1Payment, person2Payment };
}

// Calculate voluntary repayment amounts
export function calculateVoluntaryRepayments(
  person1VoluntaryRepayment: number,
  person2VoluntaryRepayment: number
) {
  const person1VoluntaryPerPeriod = person1VoluntaryRepayment;
  const person2VoluntaryPerPeriod = person2VoluntaryRepayment;
  const totalVoluntaryPerPeriod =
    person1VoluntaryPerPeriod + person2VoluntaryPerPeriod;

  return {
    person1VoluntaryPerPeriod,
    person2VoluntaryPerPeriod,
    totalVoluntaryPerPeriod,
  };
}

// Calculate total payments including voluntary repayments
export function calculateTotalPayments(
  person1Payment: number,
  person2Payment: number,
  person1VoluntaryPerPeriod: number,
  person2VoluntaryPerPeriod: number,
  payment: number,
  totalVoluntaryPerPeriod: number
) {
  const person1TotalPayment = person1Payment + person1VoluntaryPerPeriod;
  const person2TotalPayment = person2Payment + person2VoluntaryPerPeriod;
  const totalPaymentWithVoluntary = payment + totalVoluntaryPerPeriod;

  return {
    person1TotalPayment,
    person2TotalPayment,
    totalPaymentWithVoluntary,
  };
}

// Calculate total amounts over loan term
export function calculateTotalAmounts(
  payment: number,
  n: number,
  principal: number
) {
  const totalPaid = payment * n;
  const interest = Math.max(0, totalPaid - principal);

  return { totalPaid, interest };
}

// Calculate equity shares
export function calculateEquityShares(
  person1Equity: number,
  person2Equity: number
) {
  const totalEquity = person1Equity + person2Equity;
  const person1EquityShare =
    totalEquity > 0 ? (person1Equity / totalEquity) * 100 : 0;
  const person2EquityShare =
    totalEquity > 0 ? (person2Equity / totalEquity) * 100 : 0;

  return { person1EquityShare, person2EquityShare };
}

// Calculate sale proceeds distribution
export function calculateSaleProceeds(
  salePrice: number,
  remainingBalance: number,
  person1Equity: number,
  person2Equity: number,
  totalEquity: number,
  totalDeposit: number,
  person1Deposit: number,
  person2Deposit: number
) {
  const saleProceeds = salePrice || 0;
  const netProceeds = saleProceeds - remainingBalance;
  const person1SaleProceeds =
    totalEquity > 0 ? (person1Equity / totalEquity) * netProceeds : 0;
  const person2SaleProceeds =
    totalEquity > 0 ? (person2Equity / totalEquity) * netProceeds : 0;
  const saleProfit = netProceeds - totalEquity;
  const saleProfitWithoutPrincipal = netProceeds - totalDeposit;
  const person1SaleProfit =
    totalEquity > 0 ? (person1Equity / totalEquity) * saleProfit : 0;
  const person2SaleProfit =
    totalEquity > 0 ? (person2Equity / totalEquity) * saleProfit : 0;

  const person1SaleProfitWithoutPrincipal =
    totalDeposit > 0 ? (person1Deposit / totalDeposit) * saleProfit : 0;
  const person2SaleProfitWithoutPrincipal =
    totalDeposit > 0 ? (person2Deposit / totalDeposit) * saleProfit : 0;

  return {
    saleProceeds,
    netProceeds,
    person1SaleProceeds,
    person2SaleProceeds,
    saleProfit,
    saleProfitWithoutPrincipal,
    person1SaleProfit,
    person2SaleProfit,
    person1SaleProfitWithoutPrincipal,
    person2SaleProfitWithoutPrincipal,
  };
}

export function calculateSplitMortgage(
  inputs: SplitMortgageInputs
): SplitMortgageResults {
  const {
    price,
    person1Deposit,
    person2Deposit,
    person1RepaymentShare,
    person1VoluntaryRepayment,
    person2VoluntaryRepayment,
    rate,
    termYears,
    frequency,
    ageOfMortgage,
    salePrice,
  } = inputs;

  const totalDeposit = person1Deposit + person2Deposit;

  // Calculate basic mortgage parameters
  const { principal, periodsPerYear, n, r } = calculateMortgageParameters(
    price,
    totalDeposit,
    rate,
    termYears,
    frequency
  );

  // Calculate base payment
  const payment = calculateBasePayment(principal, r, n);

  // Calculate total amounts
  const { totalPaid, interest } = calculateTotalAmounts(payment, n, principal);

  // Calculate individual payments
  const { person1Payment, person2Payment } = calculateIndividualPayments(
    payment,
    person1RepaymentShare
  );

  // Calculate voluntary repayments
  const {
    person1VoluntaryPerPeriod,
    person2VoluntaryPerPeriod,
    totalVoluntaryPerPeriod,
  } = calculateVoluntaryRepayments(
    person1VoluntaryRepayment,
    person2VoluntaryRepayment
  );

  // Calculate total payments including voluntary repayments
  const {
    person1TotalPayment,
    person2TotalPayment,
    totalPaymentWithVoluntary,
  } = calculateTotalPayments(
    person1Payment,
    person2Payment,
    person1VoluntaryPerPeriod,
    person2VoluntaryPerPeriod,
    payment,
    totalVoluntaryPerPeriod
  );

  // Calculate payment breakdown for selected year
  const { paymentPrincipal, paymentInterest } = calculatePaymentBreakdown(
    ageOfMortgage,
    principal,
    payment,
    totalVoluntaryPerPeriod,
    r,
    periodsPerYear,
    termYears
  );

  // Calculate equity and totals at selected point
  const {
    person1Equity,
    person2Equity,
    person1TotalInterest,
    person2TotalInterest,
    person1TotalPaid,
    person2TotalPaid,
  } = calculateEquityAndTotals(
    ageOfMortgage,
    principal,
    payment,
    person1Payment,
    person2Payment,
    person1VoluntaryPerPeriod,
    person2VoluntaryPerPeriod,
    person1RepaymentShare,
    person1Deposit,
    person2Deposit,
    paymentPrincipal,
    paymentInterest,
    r,
    periodsPerYear,
    termYears
  );

  // Calculate equity shares
  const { person1EquityShare, person2EquityShare } = calculateEquityShares(
    person1Equity,
    person2Equity
  );

  // Calculate remaining balance
  const remainingBalance = calculateRemainingBalance(
    ageOfMortgage,
    principal,
    payment,
    totalVoluntaryPerPeriod,
    r,
    periodsPerYear,
    termYears
  );

  // Calculate sale proceeds
  const saleResults = calculateSaleProceeds(
    salePrice,
    remainingBalance,
    person1Equity,
    person2Equity,
    person1Equity + person2Equity,
    totalDeposit,
    person1Deposit,
    person2Deposit
  );

  return {
    payment,
    person1Payment,
    person2Payment,
    person1TotalPayment,
    person2TotalPayment,
    totalPaymentWithVoluntary,
    totalPaid,
    principal,
    interest,
    n,
    periodsPerYear,
    paymentPrincipal,
    paymentInterest,
    person1Equity,
    person2Equity,
    person1EquityShare,
    person2EquityShare,
    person1TotalInterest,
    person2TotalInterest,
    person1TotalPaid,
    person2TotalPaid,
    person1VoluntaryRepayment,
    person2VoluntaryRepayment,
    remainingBalance,
    ...saleResults,
  };
}

function calculatePaymentBreakdown(
  ageOfMortgage: string,
  splitPrincipal: number,
  payment: number,
  totalVoluntaryPerPeriod: number,
  r: number,
  periodsPerYear: number,
  termYears: number
): { paymentPrincipal: number; paymentInterest: number } {
  let paymentPrincipal = 0;
  let paymentInterest = 0;

  if (ageOfMortgage === 'first') {
    // First payment
    const firstPaymentInterest = splitPrincipal * r;
    paymentPrincipal = payment - firstPaymentInterest;
    paymentInterest = firstPaymentInterest;
  } else {
    // Calculate for specific year
    const yearNumber = parseInt(ageOfMortgage);
    if (yearNumber <= termYears) {
      const periodsToYear = yearNumber * periodsPerYear;
      let remainingBalance = splitPrincipal;

      // Calculate remaining balance after payments up to the selected year
      for (let i = 0; i < periodsToYear; i++) {
        const periodInterest = remainingBalance * r;
        const periodPrincipal = payment - periodInterest;
        const periodVoluntary = totalVoluntaryPerPeriod;
        remainingBalance -= periodPrincipal + periodVoluntary;
      }

      // Calculate the payment breakdown for the first payment of the selected year
      paymentInterest = remainingBalance * r;
      paymentPrincipal = payment - paymentInterest;
    }
  }

  return { paymentPrincipal, paymentInterest };
}

function calculateEquityAndTotals(
  ageOfMortgage: AgeOfMortgage,
  splitPrincipal: number,
  payment: number,
  person1Payment: number,
  person2Payment: number,
  person1VoluntaryPerPeriod: number,
  person2VoluntaryPerPeriod: number,
  person1RepaymentShare: number,
  person1Deposit: number,
  person2Deposit: number,
  paymentPrincipal: number,
  paymentInterest: number,
  r: number,
  periodsPerYear: number,
  termYears: number
): {
  person1Equity: number;
  person2Equity: number;
  person1TotalInterest: number;
  person2TotalInterest: number;
  person1TotalPaid: number;
  person2TotalPaid: number;
} {
  let person1Equity = person1Deposit;
  let person2Equity = person2Deposit;
  let person1TotalInterest = 0;
  let person2TotalInterest = 0;
  let person1TotalPaid = 0;
  let person2TotalPaid = 0;

  if (ageOfMortgage === 'deposit') {
    // Deposit only - no payments made yet
    person1Equity = person1Deposit;
    person2Equity = person2Deposit;
    person1TotalInterest = 0;
    person2TotalInterest = 0;
    person1TotalPaid = 0;
    person2TotalPaid = 0;
  } else if (ageOfMortgage === 'first') {
    // For first payment, include the principal portion of that payment
    const person1PrincipalContribution =
      paymentPrincipal * person1RepaymentShare;
    const person2PrincipalContribution =
      paymentPrincipal * (1 - person1RepaymentShare);

    person1Equity =
      person1Deposit + person1PrincipalContribution + person1VoluntaryPerPeriod;
    person2Equity =
      person2Deposit + person2PrincipalContribution + person2VoluntaryPerPeriod;

    // For first payment, total interest is just the interest portion of that payment
    person1TotalInterest = paymentInterest * person1RepaymentShare;
    person2TotalInterest = paymentInterest * (1 - person1RepaymentShare);

    person1TotalPaid = person1Payment + person1VoluntaryPerPeriod;
    person2TotalPaid = person2Payment + person2VoluntaryPerPeriod;
  } else {
    // Calculate equity and total interest at the selected year
    const yearNumber = parseInt(ageOfMortgage);
    if (yearNumber <= termYears) {
      const periodsToYear = yearNumber * periodsPerYear;
      let remainingBalance = splitPrincipal;
      let totalPrincipalPaid = 0;
      let totalInterestPaid = 0;
      let totalVoluntaryPaid = 0;

      // Calculate total principal and interest paid up to the selected year
      for (let i = 0; i < periodsToYear; i++) {
        const periodInterest = remainingBalance * r;
        const periodPrincipal = payment - periodInterest;
        const periodVoluntary =
          person1VoluntaryPerPeriod + person2VoluntaryPerPeriod;
        remainingBalance -= periodPrincipal + periodVoluntary;
        totalPrincipalPaid += periodPrincipal;
        totalInterestPaid += periodInterest;
        totalVoluntaryPaid += periodVoluntary;
      }

      // Calculate how much each person has contributed to principal
      const person1PrincipalContribution =
        totalPrincipalPaid * person1RepaymentShare;
      const person2PrincipalContribution =
        totalPrincipalPaid * (1 - person1RepaymentShare);

      // Calculate how much interest each person has paid
      person1TotalInterest = totalInterestPaid * person1RepaymentShare;
      person2TotalInterest = totalInterestPaid * (1 - person1RepaymentShare);

      // Calculate total voluntary repayments made by each person
      const person1VoluntaryPaid = person1VoluntaryPerPeriod * periodsToYear;
      const person2VoluntaryPaid = person2VoluntaryPerPeriod * periodsToYear;

      // Equity = deposit + principal contribution + voluntary repayments
      person1Equity =
        person1Deposit + person1PrincipalContribution + person1VoluntaryPaid;
      person2Equity =
        person2Deposit + person2PrincipalContribution + person2VoluntaryPaid;

      // Total paid = regular payments + voluntary repayments
      person1TotalPaid = person1Payment * periodsToYear + person1VoluntaryPaid;
      person2TotalPaid = person2Payment * periodsToYear + person2VoluntaryPaid;
    }
  }

  return {
    person1Equity,
    person2Equity,
    person1TotalInterest,
    person2TotalInterest,
    person1TotalPaid,
    person2TotalPaid,
  };
}

function calculateRemainingBalance(
  timeInMortgage: string,
  splitPrincipal: number,
  payment: number,
  totalVoluntaryPerPeriod: number,
  r: number,
  periodsPerYear: number,
  termYears: number
): number {
  let remainingBalance = splitPrincipal;

  if (timeInMortgage !== 'deposit') {
    const yearNumber = timeInMortgage === 'first' ? 0 : parseInt(timeInMortgage);
    const periodsToYear = yearNumber * periodsPerYear;

    // Calculate remaining balance after payments up to the selected year
    for (let i = 0; i < periodsToYear; i++) {
      const periodInterest = remainingBalance * r;
      const periodPrincipal = payment - periodInterest;
      const periodVoluntary = totalVoluntaryPerPeriod;
      remainingBalance -= periodPrincipal + periodVoluntary;
    }
  }

  return remainingBalance;
}

// Helper function to calculate total voluntary amount over loan term
export function calculateTotalVoluntaryAmount(
  voluntaryPerPeriod: number,
  termYears: number,
  frequency: Frequency
): number {
  const periodsPerYear = PERIODS_PER_YEAR[frequency];
  const n = Math.max(1, Math.round(termYears * periodsPerYear));
  return voluntaryPerPeriod * n;
}
