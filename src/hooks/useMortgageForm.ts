import { useState } from "react";
import {
  DEFAULT_HOUSE_PRICE,
  DEFAULT_DEPOSIT,
  DEFAULT_RATE,
  DEFAULT_TERM_YEARS,
  DEFAULT_FREQUENCY,
  DEFAULT_SELECTED_YEAR,
} from "@/constants/mortgage";

export type Frequency = "yearly" | "monthly" | "fortnightly" | "weekly";
export type YearOption = "first" | "5" | "10" | "15" | "20" | "25" | "30";

export interface MortgageFormData {
  price: number;
  deposit: number;
  rate: number;
  termYears: number;
  frequency: Frequency;
  selectedYear: YearOption;
}

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

export function useMortgageForm() {
  const [price, setPrice] = useState<number>(DEFAULT_HOUSE_PRICE);
  const [deposit, setDeposit] = useState<number>(DEFAULT_DEPOSIT);
  const [rate, setRate] = useState<number>(DEFAULT_RATE);
  const [termYears, setTermYears] = useState<number>(DEFAULT_TERM_YEARS);
  const [frequency, setFrequency] = useState<Frequency>(DEFAULT_FREQUENCY);
  const [selectedYear, setSelectedYear] = useState<YearOption>(DEFAULT_SELECTED_YEAR);

  const formData: MortgageFormData = {
    price,
    deposit,
    rate,
    termYears,
    frequency,
    selectedYear,
  };

  const updatePrice = (value: number) => setPrice(value || 0);
  const updateDeposit = (value: number) => setDeposit(value || 0);
  const updateRate = (value: number) => setRate(value || 0);
  const updateTermYears = (value: number) => setTermYears(value || 0);
  const updateFrequency = (value: Frequency) => setFrequency(value);
  const updateSelectedYear = (value: YearOption) => setSelectedYear(value);

  const resetForm = () => {
    setPrice(DEFAULT_HOUSE_PRICE);
    setDeposit(DEFAULT_DEPOSIT);
    setRate(DEFAULT_RATE);
    setTermYears(DEFAULT_TERM_YEARS);
    setFrequency(DEFAULT_FREQUENCY);
    setSelectedYear(DEFAULT_SELECTED_YEAR);
  };

  return {
    formData,
    price,
    deposit,
    rate,
    termYears,
    frequency,
    selectedYear,
    updatePrice,
    updateDeposit,
    updateRate,
    updateTermYears,
    updateFrequency,
    updateSelectedYear,
    resetForm,
  };
}
