import { calculateMortgage } from '../mortgageCalculations';
import { MortgageInputs, MortgageResults, AgeOfMortgage } from '../../types/mortgageTypes';

//
// Check values from:
// https://www.boq.com.au/personal/tools-and-calculators/principal-and-interest-calculator
//

describe('Mortgage Calculations', () => {
  it('should calculate mortgage correctly', () => {
    const inputs = {
      price: 700000,
      deposit: 100000,
      rate: 5.59,
      termYears: 30,
      frequency: 'monthly',
      ageOfMortgage: AgeOfMortgage.MakeFromEnum('5'),
      salePrice: 800000,
    } as MortgageInputs;

    const results: MortgageResults = calculateMortgage(inputs);
    expect(results.paymentForPeriod).toBeCloseTo(3440.69);
    expect(results.totalPaid).toBeCloseTo(1238648.89);
    expect(results.loanAmount).toBe(600000);
    expect(results.totalInterest).toBeCloseTo(638648.89);
    expect(results.totalPeriods).toBe(360);
    expect(results.periodsPerYear).toBe(12);
    expect(results.interestFromOnePaymentAtAgeOfMortgage).toBeCloseTo(2591.30);
    expect(results.remainingBalance).toBeCloseTo(555421.59);
    expect(results.totalInterestPaidUpToAgeOfMortgage).toBeCloseTo(161863.08);
    expect(results.totalPrincipalGainedFromPaymentsUpToAgeOfMortgage).toBeCloseTo(44578.41);
  });

  it('should calculate mortgage correctly', () => {
    const inputs = {
      price: 500000,
      deposit: 100000,
      rate: 5.59,
      termYears: 30,
      frequency: 'monthly',
      ageOfMortgage: AgeOfMortgage.MakeFromEnum('5'),
      salePrice: 650000,
    } as MortgageInputs;

    const results: MortgageResults = calculateMortgage(inputs);
    expect(results.paymentForPeriod).toBeCloseTo(2293.79);
    expect(results.totalPaid).toBeCloseTo(825765.93);
    expect(results.loanAmount).toBe(400000);
    expect(results.totalInterest).toBeCloseTo(425765.93);
    expect(results.totalPeriods).toBe(360);
    expect(results.periodsPerYear).toBe(12);
    expect(results.interestFromOnePaymentAtAgeOfMortgage).toBeCloseTo(1727.53);
    expect(results.principalFromOnePaymentAtAgeOfMortgage).toBeCloseTo(566.26);
    expect(results.remainingBalance).toBeCloseTo(370281.06);
    expect(results.totalInterestPaidUpToAgeOfMortgage).toBeCloseTo(107908.72);
    expect(results.totalPrincipalGainedFromPaymentsUpToAgeOfMortgage).toBeCloseTo(29718.94);
  });
});