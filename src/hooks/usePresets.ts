import { useState, useEffect } from 'react';
import { Frequency, AgeOfMortgage } from '@/app/src/types/mortgageTypes';

export interface MortgagePreset {
  id: string;
  name: string;
  timestamp: number;
  type: 'regular' | 'split';
  data: {
    // Base mortgage data
    price: number;
    rate: number;
    termYears: number;
    frequency: Frequency;
    ageOfMortgage: AgeOfMortgage;
    
    // Regular mortgage data
    deposit?: number;
    
    // Split mortgage specific data
    person1Deposit?: number;
    person2Deposit?: number;
    person1RepaymentShare?: number;
    salePrice?: number;
  };
}

const STORAGE_KEY = 'mortgage-presets';

export function usePresets() {
  const [presets, setPresets] = useState<MortgagePreset[]>([]);

  // Load presets from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPresets(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error('Failed to parse saved presets:', error);
        setPresets([]);
      }
    }
  }, []);

  // Save presets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  }, [presets]);

  const savePreset = (name: string, data: MortgagePreset['data'], type: 'regular' | 'split') => {
    const newPreset: MortgagePreset = {
      id: Date.now().toString(),
      name,
      timestamp: Date.now(),
      type,
      data,
    };

    setPresets(prev => [...prev, newPreset]);
    return newPreset;
  };

  const deletePreset = (id: string) => {
    setPresets(prev => prev.filter(preset => preset.id !== id));
  };

  const updatePreset = (id: string, updates: Partial<MortgagePreset>) => {
    setPresets(prev => 
      prev.map(preset => 
        preset.id === id ? { ...preset, ...updates } : preset
      )
    );
  };

  const clearAllPresets = () => {
    setPresets([]);
  };

  return {
    presets,
    savePreset,
    deletePreset,
    updatePreset,
    clearAllPresets,
  };
}
