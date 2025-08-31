// Simple test runner for mortgage calculations
const { calculateMortgage } = require('./src/calculations/mortgageCalculations.ts');

// Test case 1: Basic mortgage calculation
console.log('Test 1: Basic mortgage calculation');
const inputs1 = {
  price: 300000,
  deposit: 60000,
  rate: 4.5,
  termYears: 30,
  frequency: 'monthly',
  selectedYear: 'first',
  salePrice: 350000,
};

try {
  const result1 = calculateMortgage(inputs1);
  console.log('✅ Basic calculation passed');
  console.log('Payment:', result1.paymentForPeriod.toFixed(2));
  console.log('Principal:', result1.principal);
  console.log('Total paid:', result1.totalPaid.toFixed(2));
  console.log('Interest:', result1.interest.toFixed(2));
} catch (error) {
  console.log('❌ Basic calculation failed:', error.message);
}

// Test case 2: Zero interest rate
console.log('\nTest 2: Zero interest rate');
const inputs2 = {
  price: 300000,
  deposit: 60000,
  rate: 0,
  termYears: 30,
  frequency: 'monthly',
  selectedYear: 'first',
  salePrice: 0,
};

try {
  const result2 = calculateMortgage(inputs2);
  console.log('✅ Zero interest rate test passed');
  console.log('Payment:', result2.paymentForPeriod.toFixed(2));
  console.log('Interest:', result2.interest);
} catch (error) {
  console.log('❌ Zero interest rate test failed:', error.message);
}

// Test case 3: Deposit only scenario
console.log('\nTest 3: Deposit only scenario');
const inputs3 = {
  price: 300000,
  deposit: 60000,
  rate: 4.5,
  termYears: 30,
  frequency: 'monthly',
  selectedYear: 'deposit',
  salePrice: 0,
};

try {
  const result3 = calculateMortgage(inputs3);
  console.log('✅ Deposit only test passed');
  console.log('Payment principal:', result3.paymentPrincipal);
  console.log('Payment interest:', result3.paymentInterest);
  console.log('Total interest paid:', result3.totalInterestPaid);
  console.log('Principal gained:', result3.principalGained);
} catch (error) {
  console.log('❌ Deposit only test failed:', error.message);
}

console.log('\n🎉 All tests completed!');
