import React from 'react';
import { Frequency } from '@/app/src/types/mortgageTypes';
import { FREQUENCY_LABEL } from '@/app/src/calculations/utilityMethods';

interface FrequencySelectorProps {
  value: Frequency;
  onChange: (frequency: Frequency) => void;
  label?: string;
  className?: string;
}

export function FrequencySelector({ 
  value, 
  onChange, 
  label = "Repayment frequency",
  className = '' 
}: FrequencySelectorProps) {
  const frequencies: Frequency[] = ['yearly', 'monthly', 'fortnightly', 'weekly'];

  const handleKeyDown = (e: React.KeyboardEvent, frequency: Frequency) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(frequency);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-black dark:text-white">
        {label}
      </label>
      <div 
        className="inline-flex rounded-md border border-black/10 dark:border-white/15 overflow-hidden"
        role="radiogroup"
        aria-label={label}
      >
        {frequencies.map((frequency, index) => (
          <button
            key={frequency}
            type="button"
            onClick={() => onChange(frequency)}
            onKeyDown={(e) => handleKeyDown(e, frequency)}
            role="radio"
            aria-checked={value === frequency}
            tabIndex={value === frequency ? 0 : -1}
            className={`
              px-3 py-1.5 text-sm border-r last:border-r-0 border-black/10 dark:border-white/15
              focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/25
              ${value === frequency
                ? 'bg-black/10 dark:bg-white/10 font-medium'
                : 'hover:bg-black/5 dark:hover:bg-white/5'
              }
            `}
          >
            {FREQUENCY_LABEL[frequency]}
          </button>
        ))}
      </div>
    </div>
  );
}
