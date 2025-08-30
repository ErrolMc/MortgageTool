'use client';

import {
  useSplitMortgageCalculator,
  formatCurrency,
  formatInputNumber,
  parseInputNumber,
  type YearOption,
} from './useSplitMortgageCalculator';
import { NumberFormField } from '@/components/ui/FormField';
import { FrequencySelector } from '@/components/ui/FrequencySelector';
import { ResultsCard, ResultsGrid, ResultsRow } from '@/components/ui/ResultsCard';

export default function SplitMortgageCalculatorPage() {
  const {
    price,
    setPrice,
    person1Deposit,
    setPerson1Deposit,
    person2Deposit,
    setPerson2Deposit,
    person1RepaymentShare,
    setPerson1RepaymentShare,
    rate,
    setRate,
    termYears,
    setTermYears,
    frequency,
    setFrequency,
    selectedYear,
    setSelectedYear,
    principal,
    totalDeposit,
    results,
    validationErrors,
    resetForm,
    FREQUENCY_LABEL,
    YEAR_OPTIONS,
    INPUT_CONSTRAINTS,
  } = useSplitMortgageCalculator();

  const person1RepaymentSharePercent = person1RepaymentShare * 100;
  const person2RepaymentSharePercent = (1 - person1RepaymentShare) * 100;

  const hasErrors = Object.keys(validationErrors).length > 0;

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">
          Split Mortgage Calculator
        </h1>
        <p className="text-sm text-black/70 dark:text-white/70">
          Calculate mortgage repayments and equity split between two people.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Input Details</h2>
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white underline"
            >
              Reset to defaults
            </button>
          </div>

          <NumberFormField
            label="House price"
            id="house-price"
            value={price}
            onChange={setPrice}
            error={validationErrors.price}
            min={INPUT_CONSTRAINTS.housePrice.min}
            step={INPUT_CONSTRAINTS.housePrice.step}
            formatValue={formatInputNumber}
            parseValue={parseInputNumber}
            helpText="Enter the total purchase price of the property"
          />

          <div className="space-y-3">
            <h3 className="font-medium text-sm">Deposits</h3>
            
            <NumberFormField
              label="Person 1 deposit"
              id="person1-deposit"
              value={person1Deposit}
              onChange={setPerson1Deposit}
              error={validationErrors.person1Deposit}
              min={INPUT_CONSTRAINTS.deposit.min}
              step={INPUT_CONSTRAINTS.deposit.step}
              formatValue={formatInputNumber}
              parseValue={parseInputNumber}
              helpText="Amount Person 1 is contributing as deposit"
            />

            <NumberFormField
              label="Person 2 deposit"
              id="person2-deposit"
              value={person2Deposit}
              onChange={setPerson2Deposit}
              error={validationErrors.person2Deposit}
              min={INPUT_CONSTRAINTS.deposit.min}
              step={INPUT_CONSTRAINTS.deposit.step}
              formatValue={formatInputNumber}
              parseValue={parseInputNumber}
              helpText="Amount Person 2 is contributing as deposit"
            />

            <div className="text-xs text-black/60 dark:text-white/60 space-y-1 p-3 bg-black/5 dark:bg-white/5 rounded-md">
              <p>Total deposit: {formatCurrency(totalDeposit)}</p>
              <p>Loan amount: {formatCurrency(principal)}</p>
              <p>Person 1: {formatCurrency(person1Deposit)} ({totalDeposit > 0 ? ((person1Deposit / totalDeposit) * 100).toFixed(1) : '0'}%)</p>
              <p>Person 2: {formatCurrency(person2Deposit)} ({totalDeposit > 0 ? ((person2Deposit / totalDeposit) * 100).toFixed(1) : '0'}%)</p>
            </div>
          </div>

          <NumberFormField
            label="Person 1 repayment share (%)"
            id="person1-repayment-share"
            value={person1RepaymentSharePercent}
            onChange={(value: number) => setPerson1RepaymentShare(value / 100)}
            error={validationErrors.person1RepaymentShare}
            min={0}
            max={100}
            step={1}
            helpText="Percentage of each payment that Person 1 will contribute"
          />

          <div className="text-xs text-black/60 dark:text-white/60 p-2 bg-black/5 dark:bg-white/5 rounded">
            Person 1: {person1RepaymentSharePercent.toFixed(0)}% | Person 2: {person2RepaymentSharePercent.toFixed(0)}%
          </div>

          <div className="grid grid-cols-2 gap-4">
            <NumberFormField
              label="Rate (%)"
              id="rate"
              value={rate}
              onChange={setRate}
              error={validationErrors.rate}
              min={INPUT_CONSTRAINTS.rate.min}
              max={INPUT_CONSTRAINTS.rate.max}
              step={INPUT_CONSTRAINTS.rate.step}
              helpText="Annual interest rate"
            />
            <NumberFormField
              label="Term (years)"
              id="term-years"
              value={termYears}
              onChange={setTermYears}
              error={validationErrors.termYears}
              min={INPUT_CONSTRAINTS.termYears.min}
              max={INPUT_CONSTRAINTS.termYears.max}
              step={INPUT_CONSTRAINTS.termYears.step}
              helpText="Length of the mortgage term"
            />
          </div>

          <FrequencySelector
            value={frequency}
            onChange={setFrequency}
          />
        </div>

        <div className="space-y-4">
          {hasErrors && (
            <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-4">
              <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">
                Please fix the following errors:
              </h3>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                {Object.values(validationErrors).map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <ResultsCard title={`${FREQUENCY_LABEL[frequency]} repayment`}>
            <p className="text-3xl font-semibold">
              {formatCurrency(results.payment)}
            </p>
            <div className="mt-2 text-sm text-black/70 dark:text-white/70 space-y-1">
              <p>Person 1: {formatCurrency(results.person1Payment)}</p>
              <p>Person 2: {formatCurrency(results.person2Payment)}</p>
            </div>

            <div className="mt-4">
              <label className="block text-sm mb-2">
                Payment breakdown for:
              </label>
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value as YearOption)}
                className="w-full rounded-md border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 px-3 py-2 text-sm"
                aria-label="Select year for payment breakdown"
              >
                {YEAR_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3 space-y-1">
              <ResultsRow label="Principal" value={formatCurrency(results.paymentPrincipal)} />
              <ResultsRow label="Interest" value={formatCurrency(results.paymentInterest)} />
            </div>
            <p className="text-xs text-black/60 dark:text-white/60 mt-2">
              per {frequency === 'yearly' ? 'year' : frequency}
            </p>
          </ResultsCard>

          <ResultsCard title={`Equity split at ${selectedYear === 'first' ? 'start' : `year ${selectedYear}`}`}>
            <ResultsGrid
              items={[
                { label: 'Person 1 equity', value: formatCurrency(results.person1Equity) },
                { label: 'Person 2 equity', value: formatCurrency(results.person2Equity) },
                { label: 'Person 1 share', value: `${results.person1EquityShare.toFixed(1)}%` },
                { label: 'Person 2 share', value: `${results.person2EquityShare.toFixed(1)}%` },
              ]}
            />
          </ResultsCard>

          <ResultsCard title="Totals over the loan">
            <ResultsGrid
              items={[
                { label: 'Total payments', value: formatCurrency(results.totalPaid) },
                { label: 'Principal', value: formatCurrency(results.principal) },
                { label: 'Interest', value: formatCurrency(results.interest) },
                { label: 'Number of payments', value: results.n.toLocaleString() },
              ]}
            />
          </ResultsCard>

          <div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20 p-4">
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Important Notes
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Uses a nominal annual rate divided by the selected frequency</li>
              <li>• Actual lender calculations may differ slightly</li>
              <li>• This is for estimation purposes only</li>
              <li>• Equity calculations assume equal contribution to principal payments</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
