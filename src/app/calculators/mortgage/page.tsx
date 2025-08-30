'use client';

import {
  useMortgageCalculator,
  formatCurrency,
  type Frequency,
  type YearOption,
} from './useMortgageCalculator';

export default function MortgageCalculatorPage() {
  const {
    price,
    setPrice,
    deposit,
    setDeposit,
    rate,
    setRate,
    termYears,
    setTermYears,
    frequency,
    setFrequency,
    selectedYear,
    setSelectedYear,
    principal,
    results,
    FREQUENCY_LABEL,
    YEAR_OPTIONS,
    INPUT_CONSTRAINTS,
  } = useMortgageCalculator();

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
          <div>
            <label className="block text-sm mb-1">House price</label>
            <input
              type="number"
              className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2"
              min={INPUT_CONSTRAINTS.housePrice.min}
              step={INPUT_CONSTRAINTS.housePrice.step}
              value={Number.isFinite(price) ? price : 0}
              onChange={e => setPrice(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Deposit</label>
            <input
              type="number"
              className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2"
              min={INPUT_CONSTRAINTS.deposit.min}
              step={INPUT_CONSTRAINTS.deposit.step}
              value={Number.isFinite(deposit) ? deposit : 0}
              onChange={e => setDeposit(parseFloat(e.target.value) || 0)}
            />
            <p className="mt-1 text-xs text-black/60 dark:text-white/60">
              Loan amount: {formatCurrency(principal)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Rate (%)</label>
              <input
                type="number"
                className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2"
                min={INPUT_CONSTRAINTS.rate.min}
                max={INPUT_CONSTRAINTS.rate.max}
                step={INPUT_CONSTRAINTS.rate.step}
                value={Number.isFinite(rate) ? rate : 0}
                onChange={e => setRate(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Term (years)</label>
              <input
                type="number"
                className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2"
                min={INPUT_CONSTRAINTS.termYears.min}
                max={INPUT_CONSTRAINTS.termYears.max}
                step={INPUT_CONSTRAINTS.termYears.step}
                value={Number.isFinite(termYears) ? termYears : 0}
                onChange={e => setTermYears(parseInt(e.target.value) || 0)}
              />
            </div>
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
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-black/10 dark:border-white/15 p-4">
            <h2 className="font-medium mb-2">
              {FREQUENCY_LABEL[frequency]} repayment
            </h2>
            <p className="text-3xl font-semibold">
              {formatCurrency(results.payment)}
            </p>

            <div className="mt-3">
              <label className="block text-sm mb-2">
                Payment breakdown for:
              </label>
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value as YearOption)}
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
                <span>{formatCurrency(results.paymentPrincipal)}</span>
              </div>
              <div className="text-sm">
                <span className="text-black/70 dark:text-white/70">
                  Interest{' '}
                </span>
                <span>{formatCurrency(results.paymentInterest)}</span>
              </div>
            </div>
            <p className="text-xs text-black/60 dark:text-white/60 mt-2">
              per {frequency === 'yearly' ? 'year' : frequency}
            </p>
          </div>

          <div className="rounded-lg border border-black/10 dark:border-white/15 p-4">
            <h3 className="font-medium mb-3">Totals over the loan</h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-black/70 dark:text-white/70">
                Total payments
              </dt>
              <dd className="text-right">
                {formatCurrency(results.totalPaid)}
              </dd>
              <dt className="text-black/70 dark:text-white/70">Principal</dt>
              <dd className="text-right">
                {formatCurrency(results.principal)}
              </dd>
              <dt className="text-black/70 dark:text-white/70">Interest</dt>
              <dd className="text-right">{formatCurrency(results.interest)}</dd>
              <dt className="text-black/70 dark:text-white/70">
                Number of payments
              </dt>
              <dd className="text-right">{results.n.toLocaleString()}</dd>
            </dl>
          </div>

          <p className="text-xs text-black/60 dark:text-white/60">
            Note: Uses a nominal annual rate divided by the selected frequency.
            Actual lender calculations may differ slightly. This is for
            estimation only.
          </p>
        </div>
      </div>
    </div>
  );
}
