import React from 'react';
import '../../styles/glass.css';

interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (val: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="segmented-control w-full my-2">
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <div
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`segmented-option ${isActive ? 'active' : ''}`}
          >
            {opt.label}
          </div>
        );
      })}
    </div>
  );
}
