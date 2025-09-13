import {
  calculateLoanAmount,
  calculatePeriodsPerYear,
  calculateTotalPeriods,
  calculatePerPeriodRate,
  calculateTotalPaymentAmount,
  calculateTotalInterestAmount,
  calculateRemainingBalance,
  calculateNetProceeds,
  calculateMortgageRepaymentForPeriod,
  calculateRemainingBalanceAtAgeOfMortgage,
  calculateInterestForOnePaymentAtAgeOfMortgage,
  calculatePrincipalForOnePaymentAtAgeOfMortgage,
  calculateTotalPrincipalGainedFromPaymentsUpToAgeOfMortgage,
  calculateTotalInterestPaidFromPaymentsUpToAgeOfMortgage,
} from '../mortgageCalculationUtilities';

describe('Utility Functions', () => {
  describe('calculatePeriodsPerYear', () => {
    it('should calculate weekly repayment correctly', () => {
      expect(calculatePeriodsPerYear('weekly')).toBe(52);
    });
    it('should calculate fortnightly repayment correctly', () => {
      expect(calculatePeriodsPerYear('fortnightly')).toBe(26);
    });
    it('should calculate monthly repayment correctly', () => {
      expect(calculatePeriodsPerYear('monthly')).toBe(12);
    });
    it('should calculate yearly repayment correctly', () => {
      expect(calculatePeriodsPerYear('yearly')).toBe(1);
    });
  });

  describe('calculateLoanAmount', () => {
    it('should calculate loan amount correctly 1', () => {
      const housePrice = 400000;
      const deposit = 60000;
      const expectedLoanAmount = housePrice - deposit;
      expect(calculateLoanAmount(housePrice, deposit)).toBe(expectedLoanAmount);
    });

    it('should calculate loan amount correctly 2', () => {
      const housePrice = 1000000;
      const deposit = 400000;
      const expectedLoanAmount = housePrice - deposit;
      expect(calculateLoanAmount(housePrice, deposit)).toBe(expectedLoanAmount);
    });

    it('should handle negative values correctly', () => {
      const housePrice = -400000;
      const deposit = -60000;
      const expectedLoanAmount = 0;
      expect(calculateLoanAmount(housePrice, deposit)).toBe(expectedLoanAmount);
    });

    it('should handle zero values correctly', () => {
      const housePrice = 0;
      const deposit = 0;
      const expectedLoanAmount = 0;
      expect(calculateLoanAmount(housePrice, deposit)).toBe(expectedLoanAmount);
    });
  });

  describe('calculateTotalPeriods', () => {
    it('should calculate total periods correctly', () => {
      const termYears = 30;
      const periodsPerYear = 12;
      const expectedTotalPeriods = 360;
      expect(calculateTotalPeriods(termYears, periodsPerYear)).toBe(
        expectedTotalPeriods
      );
    });

    it('should calculate total periods correctly 2', () => {
      const termYears = 20;
      const periodsPerYear = 26;
      const expectedTotalPeriods = 520;
      expect(calculateTotalPeriods(termYears, periodsPerYear)).toBe(
        expectedTotalPeriods
      );
    });

    it('should handle negative values correctly', () => {
      const termYears = -30;
      const periodsPerYear = 12;
      const expectedTotalPeriods = 0;
      expect(calculateTotalPeriods(termYears, periodsPerYear)).toBe(
        expectedTotalPeriods
      );
    });

    it('should handle negative values correctly 2', () => {
      const termYears = 30;
      const periodsPerYear = -12;
      const expectedTotalPeriods = 0;
      expect(calculateTotalPeriods(termYears, periodsPerYear)).toBe(
        expectedTotalPeriods
      );
    });
  });

  describe('calculatePerPeriodRate', () => {
    it('should calculate per period rate correctly', () => {
      const rate = 5.59;
      const periodsPerYear = 12;
      const expectedPerPeriodRate = 0.004543;
      expect(calculatePerPeriodRate(rate, periodsPerYear)).toBeCloseTo(
        expectedPerPeriodRate
      );
    });

    it('should handle negative values correctly', () => {
      const rate = 5.59;
      const periodsPerYear = -12;
      const expectedPerPeriodRate = 0;
      expect(calculatePerPeriodRate(rate, periodsPerYear)).toBe(
        expectedPerPeriodRate
      );
    });

    it('should handle negative values correctly 2', () => {
      const rate = -5.59;
      const periodsPerYear = 12;
      const expectedPerPeriodRate = 0;
      expect(calculatePerPeriodRate(rate, periodsPerYear)).toBe(
        expectedPerPeriodRate
      );
    });
  });

  describe('calculateTotalPaymentAmount', () => {
    it('should calculate total payment amount correctly', () => {
      const paymentForPeriod = 3000;
      const totalPeriods = 360;
      const expectedTotalPaymentAmount = 1080000;
      expect(calculateTotalPaymentAmount(paymentForPeriod, totalPeriods)).toBe(
        expectedTotalPaymentAmount
      );
    });

    it('should handle negative values correctly', () => {
      const paymentForPeriod = -3000;
      const totalPeriods = 360;
      const expectedTotalPaymentAmount = 0;
      expect(calculateTotalPaymentAmount(paymentForPeriod, totalPeriods)).toBe(
        expectedTotalPaymentAmount
      );
    });

    it('should handle negative values correctly 2', () => {
      const paymentForPeriod = 3000;
      const totalPeriods = -360;
      const expectedTotalPaymentAmount = 0;
      expect(calculateTotalPaymentAmount(paymentForPeriod, totalPeriods)).toBe(
        expectedTotalPaymentAmount
      );
    });
  });

  describe('calculateTotalInterestAmount', () => {
    it('should calculate total interest amount correctly', () => {
      const totalPaymentAmount = 825766;
      const loanAmount = 400000;
      const expectedTotalInterestAmount = 425766;
      expect(calculateTotalInterestAmount(totalPaymentAmount, loanAmount)).toBe(
        expectedTotalInterestAmount
      );
    });
    it('should handle negative values correctly', () => {
      const totalPaymentAmount = -825766;
      const loanAmount = 400000;
      const expectedTotalInterestAmount = 0;
      expect(calculateTotalInterestAmount(totalPaymentAmount, loanAmount)).toBe(
        expectedTotalInterestAmount
      );
    });
    it('should handle negative values correctly 2', () => {
      const totalPaymentAmount = 825766;
      const loanAmount = -400000;
      const expectedTotalInterestAmount = 0;
      expect(calculateTotalInterestAmount(totalPaymentAmount, loanAmount)).toBe(
        expectedTotalInterestAmount
      );
    });
  });

  describe('calculateRemainingBalance', () => {
    it('should calculate remaining balance correctly', () => {
      const loanAmount = 400000;
      const principalGained = 174234;
      const expectedRemainingBalance = 225766;
      expect(calculateRemainingBalance(loanAmount, principalGained)).toBe(
        expectedRemainingBalance
      );
    });
    it('should handle negative values correctly', () => {
      const loanAmount = 400000;
      const principalGained = -174234;
      const expectedRemainingBalance = 400000;
      expect(calculateRemainingBalance(loanAmount, principalGained)).toBe(
        expectedRemainingBalance
      );
    });
    it('should handle negative values correctly 2', () => {
      const loanAmount = -400000;
      const principalGained = 174234;
      const expectedRemainingBalance = 0;
      expect(calculateRemainingBalance(loanAmount, principalGained)).toBe(
        expectedRemainingBalance
      );
    });
  });

  describe('calculateNetProceeds', () => {
    it('should calculate net proceeds correctly', () => {
      const salePrice = 400000;
      const remainingBalance = 225766;
      const expectedNetProceeds = 174234;
      expect(calculateNetProceeds(salePrice, remainingBalance)).toBe(
        expectedNetProceeds
      );
    });
    it('should handle negative values correctly', () => {
      const salePrice = 400000;
      const remainingBalance = -225766;
      const expectedNetProceeds = 400000;
      expect(calculateNetProceeds(salePrice, remainingBalance)).toBe(
        expectedNetProceeds
      );
    });
    it('should handle negative values correctly 2', () => {
      const salePrice = -400000;
      const remainingBalance = 225766;
      const expectedNetProceeds = 0;
      expect(calculateNetProceeds(salePrice, remainingBalance)).toBe(
        expectedNetProceeds
      );
    });
  });

  describe('calculateMortgageRepaymentForPeriod', () => {
    it('should calculate mortgage repayment for period correctly', () => {
      const loanAmount = 400000;
      const periodRate = calculatePerPeriodRate(5.59, 12); // every month
      const totalPeriods = 360;
      const expectedMortgageRepaymentForPeriod = 2294;
      expect(
        Math.ceil(
          calculateMortgageRepaymentForPeriod(
            loanAmount,
            periodRate,
            totalPeriods
          )
        )
      ).toBeCloseTo(expectedMortgageRepaymentForPeriod);
    });

    it('should calculate mortgage repayment for period correctly 2', () => {
      const loanAmount = 800000;
      const periodRate = calculatePerPeriodRate(5.59, 26); // every fortnight
      const totalPeriods = 780;
      const expectedMortgageRepaymentForPeriod = 2117;
      expect(
        Math.ceil(
          calculateMortgageRepaymentForPeriod(
            loanAmount,
            periodRate,
            totalPeriods
          )
        )
      ).toBeCloseTo(expectedMortgageRepaymentForPeriod);
    });

    it('should calculate mortgage repayment for period correctly 3', () => {
      const loanAmount = 400000;
      const periodRate = calculatePerPeriodRate(5.59, 52); // every fortnight
      const totalPeriods = 1560;
      const expectedMortgageRepaymentForPeriod = 529;
      expect(
        Math.ceil(
          calculateMortgageRepaymentForPeriod(
            loanAmount,
            periodRate,
            totalPeriods
          )
        )
      ).toBeCloseTo(expectedMortgageRepaymentForPeriod);
    });

    it('should handle negative values correctly', () => {
      const loanAmount = -400000;
      const periodRate = calculatePerPeriodRate(5.59, 12);
      const totalPeriods = 360;
      const expectedMortgageRepaymentForPeriod = 0;
      expect(
        Math.ceil(
          calculateMortgageRepaymentForPeriod(
            loanAmount,
            periodRate,
            totalPeriods
          )
        )
      ).toBe(expectedMortgageRepaymentForPeriod);
    });
    it('should handle negative values correctly 2', () => {
      const loanAmount = 400000;
      const periodRate = calculatePerPeriodRate(5.59, 12);
      const totalPeriods = -360;
      const expectedMortgageRepaymentForPeriod = 0;
      expect(
        calculateMortgageRepaymentForPeriod(
          loanAmount,
          periodRate,
          totalPeriods
        )
      ).toBe(expectedMortgageRepaymentForPeriod);
    });
    it('should handle negative values correctly 3', () => {
      const loanAmount = 400000;
      const periodRate = -calculatePerPeriodRate(5.59, 12);
      const totalPeriods = 360;
      const expectedMortgageRepaymentForPeriod = 0;
      expect(
        calculateMortgageRepaymentForPeriod(
          loanAmount,
          periodRate,
          totalPeriods
        )
      ).toBe(expectedMortgageRepaymentForPeriod);
    });
  });

  describe('calculateRemainingBalanceAtAgeOfMortgage', () => {
    it('should calculate remaining balance at age of mortgage correctly', () => {
      const loanAmount = 400000;
      const paymentForPeriod = 2293.79;
      const periodsPerYear = 12;
      const periodRate = calculatePerPeriodRate(5.59, periodsPerYear);

      const ageOfMortgage = '5';
      const expectedRemainingBalanceAtAgeOfMortgage = Math.ceil(370281.06);
      const expectedStartOfPeriodBalanceAtAgeOfMortgage = Math.ceil(370847.33);

      const { remainingBalance, startOfPeriodBalance } =
        calculateRemainingBalanceAtAgeOfMortgage(
          loanAmount,
          paymentForPeriod,
          periodRate,
          periodsPerYear,
          ageOfMortgage
        );
      expect(Math.ceil(remainingBalance)).toBeCloseTo(
        expectedRemainingBalanceAtAgeOfMortgage
      );
      expect(Math.ceil(startOfPeriodBalance)).toBeCloseTo(
        expectedStartOfPeriodBalanceAtAgeOfMortgage
      );
    });

    it('should calculate remaining balance at age of mortgage correctly 2', () => {
      const loanAmount = 250000;
      const paymentForPeriod = 330.61;
      const periodsPerYear = 52;
      const periodRate = calculatePerPeriodRate(5.59, periodsPerYear);

      const ageOfMortgage = '5';
      const expectedRemainingBalanceAtAgeOfMortgage = 231456;

      const { remainingBalance, startOfPeriodBalance } =
        calculateRemainingBalanceAtAgeOfMortgage(
          loanAmount,
          paymentForPeriod,
          periodRate,
          periodsPerYear,
          ageOfMortgage
        );

      expect(Math.ceil(remainingBalance)).toBeCloseTo(
        expectedRemainingBalanceAtAgeOfMortgage
      );
    });

    it('should calculate remaining balance at age of mortgage correctly 3', () => {
      const loanAmount = 400000;
      const paymentForPeriod = 2293.79;
      const periodsPerYear = 12;
      const periodRate = calculatePerPeriodRate(5.59, periodsPerYear);

      const ageOfMortgage = '5';
      const expectedRemainingBalanceAtAgeOfMortgage = Math.floor(370281.06);

      const { remainingBalance, startOfPeriodBalance } =
        calculateRemainingBalanceAtAgeOfMortgage(
          loanAmount,
          paymentForPeriod,
          periodRate,
          periodsPerYear,
          ageOfMortgage
        );
      expect(Math.floor(remainingBalance)).toBeCloseTo(
        expectedRemainingBalanceAtAgeOfMortgage
      );
    });

    it('should calculate remaining balance at age of mortgage correctly 4', () => {
      const loanAmount = 600000;
      const paymentForPeriod = 3440.69;
      const periodsPerYear = 12;
      const periodRate = calculatePerPeriodRate(5.59, periodsPerYear);

      const ageOfMortgage = 'deposit';
      const expectedRemainingBalanceAtAgeOfMortgage = 600000;

      const { remainingBalance, startOfPeriodBalance } =
        calculateRemainingBalanceAtAgeOfMortgage(
          loanAmount,
          paymentForPeriod,
          periodRate,
          periodsPerYear,
          ageOfMortgage
        );

      expect(remainingBalance).toBeCloseTo(
        expectedRemainingBalanceAtAgeOfMortgage
      );
    });
  });

  describe('calculateInterestForOnePaymentAtAgeOfMortgage', () => {
    it('should calculate interest for one payment at age of mortgage correctly', () => {
      const startOfPeriodBalance = 370847.33;
      const periodRate = calculatePerPeriodRate(5.59, 12);
      const ageOfMortgage = '5';
      const expectedInterestForOnePaymentAtAgeOfMortgage = 1727.53;
      expect(
        calculateInterestForOnePaymentAtAgeOfMortgage(
          startOfPeriodBalance,
          periodRate,
          ageOfMortgage
        )
      ).toBeCloseTo(expectedInterestForOnePaymentAtAgeOfMortgage);
    });

    it('should calculate interest for one payment at age of mortgage correctly 1', () => {
      const startOfPeriodBalance = 400000;
      const periodRate = calculatePerPeriodRate(5.59, 12);
      const ageOfMortgage = 'first';
      const expectedInterestForOnePaymentAtAgeOfMortgage = 1863.33;
      expect(
        calculateInterestForOnePaymentAtAgeOfMortgage(
          startOfPeriodBalance,
          periodRate,
          ageOfMortgage
        )
      ).toBeCloseTo(expectedInterestForOnePaymentAtAgeOfMortgage);
    });

    it('should calculate interest for one payment at age of mortgage correctly 2', () => {
      const startOfPeriodBalance = 497628.88;
      const periodRate = calculatePerPeriodRate(5.59, 12);
      const ageOfMortgage = '10';
      const expectedInterestForOnePaymentAtAgeOfMortgage = 2318.12;
      expect(
        calculateInterestForOnePaymentAtAgeOfMortgage(
          startOfPeriodBalance,
          periodRate,
          ageOfMortgage
        )
      ).toBeCloseTo(expectedInterestForOnePaymentAtAgeOfMortgage);
    });

    it('should calculate interest for one payment at age of mortgage correctly 3', () => {
      const startOfPeriodBalance = 556270.99;
      const periodRate = calculatePerPeriodRate(5.59, 12);
      const ageOfMortgage = '5';
      const expectedInterestForOnePaymentAtAgeOfMortgage = 2591;
      expect(
        Math.floor(
          calculateInterestForOnePaymentAtAgeOfMortgage(
            startOfPeriodBalance,
            periodRate,
            ageOfMortgage
          )
        )
      ).toBeCloseTo(expectedInterestForOnePaymentAtAgeOfMortgage);
    });
  });

  describe('calculatePrincipalForOnePaymentAtAgeOfMortgage', () => {
    it('should calculate principal for one payment at age of mortgage correctly', () => {
      const paymentForPeriod = 2293.79;
      const interestForOnePaymentAtAgeOfMortgage = 1545.41;
      const expectedPrincipalForOnePaymentAtAgeOfMortgage = 748.38;
      expect(
        calculatePrincipalForOnePaymentAtAgeOfMortgage(
          paymentForPeriod,
          interestForOnePaymentAtAgeOfMortgage
        )
      ).toBeCloseTo(expectedPrincipalForOnePaymentAtAgeOfMortgage);
    });

    it('should calculate principal for one payment at age of mortgage correctly 1', () => {
      const paymentForPeriod = 2293.79;
      const interestForOnePaymentAtAgeOfMortgage = 1727.53;
      const expectedPrincipalForOnePaymentAtAgeOfMortgage = 566.26;
      expect(
        calculatePrincipalForOnePaymentAtAgeOfMortgage(
          paymentForPeriod,
          interestForOnePaymentAtAgeOfMortgage
        )
      ).toBeCloseTo(expectedPrincipalForOnePaymentAtAgeOfMortgage);
    });

    it('should handle negative values correctly 1', () => {
      const paymentForPeriod = -2293.79;
      const interestForOnePaymentAtAgeOfMortgage = 1727.53;
      const expectedPrincipalForOnePaymentAtAgeOfMortgage = 0;
      expect(
        calculatePrincipalForOnePaymentAtAgeOfMortgage(
          paymentForPeriod,
          interestForOnePaymentAtAgeOfMortgage
        )
      ).toBeCloseTo(expectedPrincipalForOnePaymentAtAgeOfMortgage);
    });

    it('should handle negative values correctly 2', () => {
      const paymentForPeriod = 2293.79;
      const interestForOnePaymentAtAgeOfMortgage = -1727.53;
      const expectedPrincipalForOnePaymentAtAgeOfMortgage = 0;
      expect(
        calculatePrincipalForOnePaymentAtAgeOfMortgage(
          paymentForPeriod,
          interestForOnePaymentAtAgeOfMortgage
        )
      ).toBeCloseTo(expectedPrincipalForOnePaymentAtAgeOfMortgage);
    });
  });

  describe('calculateTotalPrincipalGainedFromPaymentsUpToAgeOfMortgage', () => {
    it('should calculate total principal gained from payments up to age of mortgage correctly', () => {
      const loanAmount = 400000;
      const remainingBalance = 300000;
      const expectedTotalPrincipalGainedFromPaymentsUpToAgeOfMortgage = 100000;
      expect(
        calculateTotalPrincipalGainedFromPaymentsUpToAgeOfMortgage(
          loanAmount,
          remainingBalance
        )
      ).toBeCloseTo(expectedTotalPrincipalGainedFromPaymentsUpToAgeOfMortgage);
    });

    it('should handle negative values correctly 1', () => {
      const loanAmount = 400000;
      const remainingBalance = -300000;
      const expectedTotalPrincipalGainedFromPaymentsUpToAgeOfMortgage = 400000;
      expect(
        calculateTotalPrincipalGainedFromPaymentsUpToAgeOfMortgage(
          loanAmount,
          remainingBalance
        )
      ).toBeCloseTo(expectedTotalPrincipalGainedFromPaymentsUpToAgeOfMortgage);
    });

    it('should handle negative values correctly 2', () => {
      const loanAmount = -400000;
      const remainingBalance = 300000;
      const expectedTotalPrincipalGainedFromPaymentsUpToAgeOfMortgage = 0;
      expect(
        calculateTotalPrincipalGainedFromPaymentsUpToAgeOfMortgage(
          loanAmount,
          remainingBalance
        )
      ).toBeCloseTo(expectedTotalPrincipalGainedFromPaymentsUpToAgeOfMortgage);
    });
  });

  describe('calculateTotalInterestPaidFromPaymentsUpToAgeOfMortgage', () => {
    it('should calculate total interest paid from payments up to age of mortgage correctly', () => {
      const totalPrincipalGainedFromPaymentsUpToAgeOfMortgage = 29718.94;
      const paymentForPeriod = 2293.79;
      const ageOfMortgage = '5';
      const periodsPerYear = 12;
      const expectedTotalInterestPaidFromPaymentsUpToAgeOfMortgage =
        Math.floor(107908.72);
      expect(
        Math.floor(
          calculateTotalInterestPaidFromPaymentsUpToAgeOfMortgage(
            totalPrincipalGainedFromPaymentsUpToAgeOfMortgage,
            paymentForPeriod,
            ageOfMortgage,
            periodsPerYear
          )
        )
      ).toBeCloseTo(expectedTotalInterestPaidFromPaymentsUpToAgeOfMortgage);
    });

    it('should calculate total interest paid from payments up to age of mortgage correctly 1', () => {
      const totalPrincipalGainedFromPaymentsUpToAgeOfMortgage = 68995.8;
      const paymentForPeriod = 2293.79;
      const ageOfMortgage = '10';
      const periodsPerYear = 12;
      const expectedTotalInterestPaidFromPaymentsUpToAgeOfMortgage =
        Math.floor(206259.51);
      expect(
        calculateTotalInterestPaidFromPaymentsUpToAgeOfMortgage(
          totalPrincipalGainedFromPaymentsUpToAgeOfMortgage,
          paymentForPeriod,
          ageOfMortgage,
          periodsPerYear
        )
      ).toBeCloseTo(expectedTotalInterestPaidFromPaymentsUpToAgeOfMortgage);
    });

    it('should handle negative values correctly 1', () => {
      const totalPrincipalGainedFromPaymentsUpToAgeOfMortgage = -29718.94;
      const paymentForPeriod = 2293.79;
      const ageOfMortgage = '5';
      const periodsPerYear = 12;
      const expectedTotalInterestPaidFromPaymentsUpToAgeOfMortgage = 0;
      expect(
        calculateTotalInterestPaidFromPaymentsUpToAgeOfMortgage(
          totalPrincipalGainedFromPaymentsUpToAgeOfMortgage,
          paymentForPeriod,
          ageOfMortgage,
          periodsPerYear
        )
      ).toBeCloseTo(expectedTotalInterestPaidFromPaymentsUpToAgeOfMortgage);
    });

    it('should handle negative values correctly 2', () => {
      const totalPrincipalGainedFromPaymentsUpToAgeOfMortgage = 29718.94;
      const paymentForPeriod = -2293.79;
      const ageOfMortgage = '5';
      const periodsPerYear = 12;
      const expectedTotalInterestPaidFromPaymentsUpToAgeOfMortgage = 0;
      expect(
        calculateTotalInterestPaidFromPaymentsUpToAgeOfMortgage(
          totalPrincipalGainedFromPaymentsUpToAgeOfMortgage,
          paymentForPeriod,
          ageOfMortgage,
          periodsPerYear
        )
      ).toBeCloseTo(expectedTotalInterestPaidFromPaymentsUpToAgeOfMortgage);
    });

    it('should handle deposit correctly', () => {
      const totalPrincipalGainedFromPaymentsUpToAgeOfMortgage = 29718.94;
      const paymentForPeriod = 2293.79;
      const ageOfMortgage = 'deposit';
      const periodsPerYear = 0;
      const expectedTotalInterestPaidFromPaymentsUpToAgeOfMortgage = 0;
      expect(
        calculateTotalInterestPaidFromPaymentsUpToAgeOfMortgage(
          totalPrincipalGainedFromPaymentsUpToAgeOfMortgage,
          paymentForPeriod,
          ageOfMortgage,
          periodsPerYear
        )
      ).toBeCloseTo(expectedTotalInterestPaidFromPaymentsUpToAgeOfMortgage);
    });
  });
});
