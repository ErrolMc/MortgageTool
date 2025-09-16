import { useState, useEffect } from 'react';
import { Frequency, AgeOfMortgage, AgeOfMortgageType } from '@/app/src/types/mortgageTypes';

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

  // Helper function to reconstruct AgeOfMortgage objects from serialized data
  const reconstructAgeOfMortgage = (data: unknown, frequency: Frequency): AgeOfMortgage => {
    // Check if it's already a proper AgeOfMortgage class instance
    if (data instanceof AgeOfMortgage) {
      return data; // Already a class instance, return as-is
    }
    
    // Check if it's a serialized plain object (has the private fields)
    if (data && typeof data === 'object' && '_type' in data && '_ageYears' in data) {
      const serializedData = data as { _type: string; _ageYears: number };
      
      if (serializedData._type === 'first') {
        return AgeOfMortgage.MakeFromFrequency(frequency); // Default frequency for 'first'
      } else if (serializedData._type === 'custom') {
        return AgeOfMortgage.MakeCustom(serializedData._ageYears);
      } else {
        return AgeOfMortgage.MakeFromEnum(serializedData._type as AgeOfMortgageType);
      }
    }
    
    // Fallback for old presets that might have different structure
    return AgeOfMortgage.MakeFromFrequency(frequency);
  };

  // Load presets from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Reconstruct AgeOfMortgage objects for each preset
          const reconstructedPresets: MortgagePreset[] = parsed.map((preset) => ({
            ...preset,
            data: {
              ...preset.data,
              ageOfMortgage: reconstructAgeOfMortgage(preset.data.ageOfMortgage, preset.data.frequency)
            }
          } as MortgagePreset));
          setPresets(reconstructedPresets);
        } else {
          setPresets([]);
        }
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

    console.log('savePreset newPreset: ', newPreset);

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
