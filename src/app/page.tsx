export default function Home() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Mortgage Calculators</h1>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <a
          href="/calculators/mortgage"
          className="block rounded-lg border border-black/10 dark:border-white/10 p-4 hover:bg-black/[.03] dark:hover:bg-white/[.03] transition"
        >
          <h2 className="font-medium">Mortgage Repayment Calculator</h2>
          <p className="text-sm text-black/70 dark:text-white/70">
            Estimate repayments by rate, term, price, and deposit.
          </p>
        </a>
        <div className="block rounded-lg border border-black/10 dark:border-white/10 p-4 opacity-70">
          <h2 className="font-medium">Extra Repayments</h2>
          <p className="text-sm text-black/70 dark:text-white/70">Coming soon</p>
        </div>
      </section>
    </div>
  );
}

