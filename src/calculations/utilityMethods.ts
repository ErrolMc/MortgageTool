import { Frequency, AgeOfMortgage } from '@/calculations/mortgageTypes';

export const FREQUENCY_LABEL: Record<Frequency, string> = {
  yearly: 'Yearly',
  monthly: 'Monthly',
  fortnightly: 'Fortnightly',
  weekly: 'Weekly',
};

export const PERIODS_PER_YEAR: Record<Frequency, number> = {
  yearly: 1,
  monthly: 12,
  fortnightly: 26,
  weekly: 52,
};

export const YEAR_OPTIONS: { value: AgeOfMortgage; label: string }[] = [
  { value: 'deposit', label: 'Deposit only' },
  { value: 'first', label: 'First payment' },
  { value: '5', label: 'Year 5' },
  { value: '10', label: 'Year 10' },
  { value: '15', label: 'Year 15' },
  { value: '20', label: 'Year 20' },
  { value: '25', label: 'Year 25' },
  { value: '27', label: 'Year 27' },
  { value: '29', label: 'Year 29' },
  { value: '30', label: 'Year 30' },
];

export const INPUT_CONSTRAINTS = {
  rate: {
    min: 0,
    max: 99,
    step: 0.01,
  },
  termYears: {
    min: 1,
    max: 40,
    step: 1,
  },
  housePrice: {
    min: 0,
    step: 1000,
  },
  deposit: {
    min: 0,
    step: 1000,
  },
} as const;
