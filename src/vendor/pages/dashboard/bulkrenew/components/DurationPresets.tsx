import React from 'react';

interface DurationPresetsProps {
  onSelectDuration: (minutes: number) => void;
  selectedMinutes: number;
}

const PRESETS = [
  { label: '1 Hour', minutes: 60 },
  { label: '2 Hour', minutes: 120 },
  { label: '3 Hour', minutes: 180 },
  { label: '4 Hour', minutes: 240 },
  { label: '6 Hours', minutes: 360 },
  { label: '12 Hours', minutes: 720 },
  { label: '24 Hours (1 Day)', minutes: 1440 },
  { label: '48 Hours (2 Days)', minutes: 2880 },
  { label: '7 Days (1 Week)', minutes: 10080 },
];

export const DurationPresets: React.FC<DurationPresetsProps> = ({
  onSelectDuration,
  selectedMinutes,
}) => {
  return (
    <div className="flex flex-wrap gap-2 my-2">
      {PRESETS.map((preset) => {
        const isSelected = selectedMinutes === preset.minutes;
        return (
          <button
            key={preset.minutes}
            type="button"
            onClick={() => onSelectDuration(preset.minutes)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              isSelected
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
};