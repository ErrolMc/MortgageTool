import React from 'react';

export interface NumberFormFieldProps {
  label: string;
  id: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  helpText?: string;
  formatValue?: (value: number) => string;
  parseValue?: (value: string) => number;
}

export function NumberFormField({
  label,
  id,
  value,
  onChange,
  error,
  placeholder,
  min,
  max,
  step,
  required = false,
  disabled = false,
  className = '',
  helpText,
  formatValue,
  parseValue,
}: NumberFormFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const parsedValue = parseValue
      ? parseValue(inputValue)
      : parseFloat(inputValue) || 0;
    onChange(parsedValue);
  };

  // Don't format the display value for number inputs to avoid typing issues
  const displayValue = value;

  return (
    <div className={`space-y-1 ${className}`}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-black dark:text-white"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        id={id}
        type="number"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        required={required}
        disabled={disabled}
        aria-describedby={
          error ? `${id}-error` : helpText ? `${id}-help` : undefined
        }
        aria-invalid={!!error}
        className={`
          w-full rounded-md border bg-transparent px-3 py-2 text-sm
          ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-black/10 dark:border-white/15 focus:border-black/20 dark:focus:border-white/25'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      />

      {error && (
        <p
          id={`${id}-error`}
          className="text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      )}

      {helpText && !error && (
        <p
          id={`${id}-help`}
          className="text-xs text-black/60 dark:text-white/60"
        >
          {helpText}
        </p>
      )}
    </div>
  );
}
