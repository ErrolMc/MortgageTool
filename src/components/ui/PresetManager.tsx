import React, { useState } from 'react';
import { MortgagePreset } from '@/hooks/usePresets';

interface PresetManagerProps {
  presets: MortgagePreset[];
  onSavePreset: (name: string, data: MortgagePreset['data'], type: 'regular' | 'split') => void;
  onLoadPreset: (preset: MortgagePreset) => void;
  onDeletePreset: (id: string) => void;
  currentData: MortgagePreset['data'];
  type: 'regular' | 'split';
}

export function PresetManager({
  presets,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
  currentData,
  type,
}: PresetManagerProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState('');

  const handleSave = () => {
    if (presetName.trim()) {
      onSavePreset(presetName.trim(), currentData, type);
      setPresetName('');
      setShowSaveDialog(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Saved Presets</h3>
        <button
          type="button"
          onClick={() => setShowSaveDialog(true)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline"
        >
          Save Current
        </button>
      </div>

      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium mb-4">Save Preset</h3>
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Enter preset name..."
              className="w-full rounded-md border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 px-3 py-2 text-sm text-black dark:text-white mb-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') setShowSaveDialog(false);
              }}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 text-sm text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!presetName.trim()}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

             {presets.filter(p => p.type === type).length === 0 ? (
         <p className="text-sm text-black/60 dark:text-white/60">
           No saved presets. Save your current settings to compare scenarios.
         </p>
       ) : (
         <div className="space-y-2">
           {presets.filter(p => p.type === type).map((preset) => (
            <div
              key={preset.id}
              className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-md"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm">{preset.name}</h4>
                  <span className="text-xs text-black/50 dark:text-white/50">
                    {formatDate(preset.timestamp)}
                  </span>
                </div>
                                 <p className="text-xs text-black/60 dark:text-white/60 mt-1">
                   ${preset.data.price.toLocaleString()} • {preset.data.rate}% • {preset.data.termYears} years
                   {preset.type === 'split' && preset.data.person1Deposit && preset.data.person2Deposit && (
                     <span> • Split: ${preset.data.person1Deposit.toLocaleString()}/${preset.data.person2Deposit.toLocaleString()}</span>
                   )}
                 </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onLoadPreset(preset)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline"
                >
                  Load
                </button>
                <button
                  type="button"
                  onClick={() => onDeletePreset(preset.id)}
                  className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
