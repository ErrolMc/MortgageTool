// Simple test to verify actual calculated values
import { calculateMortgage } from './src/calculations/mortgageCalculations.ts';

const baseInputs = {
  price: 300000,
  deposit: 60000,
  rate: 6.0,
  termYears: 30,
  frequency: 'monthly',
  ageOfMortgage: '5',
  salePrice: 400000,
};

console.log('Testing mortgage calculations...');
console.log('Inputs:', baseInputs);

try {
  const results = calculateMortgage(baseInputs);
  console.log('Results:', results);
  
  console.log('\nKey values:');
  console.log('Loan Amount:', results.loanAmount);
  console.log('Payment for Period:', results.paymentForPeriod);
  console.log('Total Paid:', results.totalPaid);
  console.log('Total Interest:', results.totalInterest);
  console.log('Remaining Balance:', results.remainingBalance);
} catch (error) {
  console.error('Error:', error);
}
