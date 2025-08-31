'use client';

import {
  useMortgageCalculator,
  formatCurrency,
} from './useMortgageCalculator';
import { type Frequency, type AgeOfMortgage } from '@/calculations/mortgageTypes';
import {
  formatInputNumber,
  parseInputNumber,
} from '@/hooks/useBaseMortgageCalculator';
import { ResultsCard, ResultsGrid } from '@/components/ui/ResultsCard';
import { NumberFormField } from '@/components/ui/FormField';
import { usePresets, type MortgagePreset } from '@/hooks/usePresets';
import { PresetManager } from '@/components/ui/PresetManager';

export default function MortgageCalculatorPage() {
  const {
    price,
    setPrice,
    deposit,
    setDeposit,
    salePrice,
    setSalePrice,
    rate,
    setRate,
    termYears,
    setTermYears,
    frequency,
    setFrequency,
    ageOfMortgage,
    setAgeOfMortgage,
    results,
    validationErrors,
    resetForm,
    FREQUENCY_LABEL,
    YEAR_OPTIONS,
    INPUT_CONSTRAINTS,
  } = useMortgageCalculator();

  const { presets, savePreset, deletePreset } = usePresets();

  const currentData = {
    price,
    rate,
    termYears,
    frequency,
    ageOfMortgage,
    deposit,
    salePrice,
  };

  const handleLoadPreset = (preset: MortgagePreset) => {
    setPrice(preset.data.price);
    setRate(preset.data.rate);
    setTermYears(preset.data.termYears);
    setFrequency(preset.data.frequency);
    setAgeOfMortgage(preset.data.ageOfMortgage);
    if (preset.data.deposit !== undefined) setDeposit(preset.data.deposit);
    if (preset.data.salePrice !== undefined)
      setSalePrice(preset.data.salePrice);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">
          Mortgage Repayment Calculator
        </h1>
        <p className="text-sm text-black/70 dark:text-white/70">
          Enter your details to estimate repayments.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <NumberFormField
            label="House price"
            id="house-price"
            value={price}
            onChange={setPrice}
            min={INPUT_CONSTRAINTS.housePrice.min}
            step={INPUT_CONSTRAINTS.housePrice.step}
            formatValue={formatInputNumber}
            parseValue={parseInputNumber}
            helpText="Enter the total purchase price of the property"
          />

          <NumberFormField
            label="Deposit"
            id="deposit"
            value={deposit}
            onChange={setDeposit}
            min={INPUT_CONSTRAINTS.deposit.min}
            step={INPUT_CONSTRAINTS.deposit.step}
            formatValue={formatInputNumber}
            parseValue={parseInputNumber}
            helpText="Amount you are contributing as deposit"
          />

          <div className="text-xs text-black/60 dark:text-white/60 p-3 bg-black/5 dark:bg-white/5 rounded-md">
            <p>Loan amount: {formatCurrency(results.loanAmount)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <NumberFormField
              label="Rate (%)"
              id="rate"
              value={rate}
              onChange={setRate}
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
              min={INPUT_CONSTRAINTS.termYears.min}
              max={INPUT_CONSTRAINTS.termYears.max}
              step={INPUT_CONSTRAINTS.termYears.step}
              helpText="Length of the mortgage term"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Repayment frequency</label>
            <div className="inline-flex rounded-md border border-black/10 dark:border-white/15 overflow-hidden">
              {(
                ['yearly', 'monthly', 'fortnightly', 'weekly'] as Frequency[]
              ).map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFrequency(f)}
                  className={
                    'px-3 py-1.5 text-sm border-r last:border-r-0 border-black/10 dark:border-white/15 ' +
                    (frequency === f
                      ? 'bg-black/10 dark:bg-white/10'
                      : 'hover:bg-black/5 dark:hover:bg-white/5')
                  }
                >
                  {FREQUENCY_LABEL[f]}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-black/10 dark:border-white/15 pt-4">
            <PresetManager
              presets={presets}
              onSavePreset={savePreset}
              onLoadPreset={handleLoadPreset}
              onDeletePreset={deletePreset}
              currentData={currentData}
              type="regular"
            />
          </div>
        </div>

        <div className="space-y-4">
          <ResultsCard title={`${FREQUENCY_LABEL[frequency]} repayment`}>
            <p className="text-3xl font-semibold">
              {formatCurrency(results.paymentForPeriod)}
            </p>

            <div className="mt-3">
              <label className="block text-sm mb-2">
                Payment breakdown for:
              </label>
              <select
                value={ageOfMortgage}
                onChange={e => setAgeOfMortgage(e.target.value as AgeOfMortgage)}
                className="w-full rounded-md border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 px-3 py-2 text-sm text-black dark:text-white [&>option]:bg-black/5 [&>option]:dark:bg-white/5 [&>option]:text-black [&>option]:dark:text-white"
                style={{
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                }}
              >
                {YEAR_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3 space-y-1">
              <div className="text-sm">
                <span className="text-black/70 dark:text-white/70">
                  Principal{' '}
                </span>
                <span>{formatCurrency(results.principalFromOnePaymentAtAgeOfMortgage)}</span>
              </div>
              <div className="text-sm">
                <span className="text-black/70 dark:text-white/70">
                  Interest{' '}
                </span>
                <span>{formatCurrency(results.interestFromOnePaymentAtAgeOfMortgage)}</span>
              </div>
            </div>
            <p className="text-xs text-black/60 dark:text-white/60 mt-2">
              per {frequency === 'yearly' ? 'year' : frequency}
            </p>
          </ResultsCard>

          <ResultsCard
            title={`Progress at ${ageOfMortgage === 'deposit' ? 'deposit only' : ageOfMortgage === 'first' ? 'start' : `year ${ageOfMortgage}`}`}
          >
            <ResultsGrid
              items={[
                {
                  label: 'Interest paid so far',
                  value: formatCurrency(results.totalInterestPaidUpToAgeOfMortgage),
                },
                {
                  label: 'Principal gained',
                  value: formatCurrency(results.totalPrincipalGainedFromPaymentsUpToAgeOfMortgage),
                },
                {
                  label: 'Equity',
                  value: formatCurrency(results.equity),
                },
                {
                  label: 'Remaining balance',
                  value: formatCurrency(results.remainingBalance),
                },
              ]}
            />
          </ResultsCard>

          <ResultsCard title="Totals over the loan">
            <ResultsGrid
              items={[
                {
                  label: 'Total payments',
                  value: formatCurrency(results.totalPaid),
                },
                {
                  label: 'Principal',
                  value: formatCurrency(results.loanAmount),
                },
                { label: 'Interest', value: formatCurrency(results.totalInterest) },
                {
                  label: 'Number of payments',
                  value: results.totalPeriods.toLocaleString(),
                },
              ]}
            />
          </ResultsCard>

          <p className="text-xs text-black/60 dark:text-white/60">
            Note: Uses a nominal annual rate divided by the selected frequency.
            Actual lender calculations may differ slightly. This is for
            estimation only.
          </p>
        </div>
      </div>

      {/* Sale Price Calculator Section */}
      <div className="border-t-2 border-black/20 dark:border-white/20 pt-8 mt-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Sale Price Calculator</h2>
            <NumberFormField
              label="Sale price"
              id="sale-price"
              value={salePrice}
              onChange={setSalePrice}
              error={validationErrors.salePrice}
              min={0}
              step={1000}
              formatValue={formatInputNumber}
              parseValue={parseInputNumber}
              helpText="Enter the sale price to calculate proceeds"
            />
          </div>

          <div className="space-y-4">
            {salePrice > 0 && (
              <ResultsCard title="Sale Proceeds">
                <ResultsGrid
                  items={[
                    {
                      label: 'Sale price',
                      value: formatCurrency(results.saleProceeds),
                    },
                    {
                      label: 'Remaining mortgage',
                      value: formatCurrency(results.remainingBalance),
                    },
                    {
                      label: 'Net proceeds',
                      value: formatCurrency(results.netProceeds),
                    },
                    {
                      label: 'Equity',
                      value: formatCurrency(results.equity),
                    },
                  ]}
                />

                <div className="border-t border-black/10 dark:border-white/15 my-4" />

                <ResultsGrid
                  items={[
                    {
                      label: 'Profit (from equity)',
                      value: formatCurrency(results.saleProfit),
                    },
                    {
                      label: 'Profit (from deposit)',
                      value: formatCurrency(results.saleProfitWithoutPrincipal),
                    },
                  ]}
                />
              </ResultsCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
