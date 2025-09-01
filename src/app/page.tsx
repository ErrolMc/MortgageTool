export default function Home() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Mortgage Calculators
        </h1>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <a
          href="/calculators/mortgage"
          className="block rounded-lg border border-black/10 dark:border-white/10 p-4 hover:bg-black/[.03] dark:hover:bg-white/[.03] transition"
        >
          <h2 className="font-medium">Mortgage Repayment Calculator</h2>
          <p className="text-sm text-black/70 dark:text-white/70">
            Estimate repayments by rate, term, price, and deposit.
          </p>
        </a>
        <a
          href="/calculators/split-mortgage"
          className="block rounded-lg border border-black/10 dark:border-white/10 p-4 hover:bg-black/[.03] dark:hover:bg-white/[.03] transition"
        >
          <h2 className="font-medium">Split Mortgage Calculator</h2>
          <p className="text-sm text-black/70 dark:text-white/70">
            Calculate equity split and repayments between two people.
          </p>
        </a>
      </section>
    </div>
  );
}
