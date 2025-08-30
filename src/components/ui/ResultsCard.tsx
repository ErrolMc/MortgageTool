import React from 'react';
import { formatCurrency } from '@/hooks/useBaseMortgageCalculator';

interface ResultsCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ResultsCard({ title, children, className = '' }: ResultsCardProps) {
  return (
    <div className={`rounded-lg border border-black/10 dark:border-white/15 p-4 ${className}`}>
      <h3 className="font-medium mb-3 text-black dark:text-white">{title}</h3>
      {children}
    </div>
  );
}

interface ResultsRowProps {
  label: string;
  value: string | number;
  className?: string;
}

export function ResultsRow({ label, value, className = '' }: ResultsRowProps) {
  return (
    <div className={`flex justify-between items-center text-sm ${className}`}>
      <span className="text-black/70 dark:text-white/70">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

interface ResultsGridProps {
  items: Array<{ label: string; value: string | number }>;
  className?: string;
}

export function ResultsGrid({ items, className = '' }: ResultsGridProps) {
  return (
    <dl className={`grid grid-cols-2 gap-2 text-sm ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <dt className="text-black/70 dark:text-white/70">{item.label}</dt>
          <dd className="text-right font-medium">{item.value}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
