import React from 'react';
import { calculateRecencyStatus } from '../../db/schema';
import '../../styles/glass.css';

interface RecencyRingProps {
  name: string;
  avatarUrl?: string;
  lastContactedAt?: string;
  targetFrequencyDays?: number;
  size?: number;
}

export const RecencyRing: React.FC<RecencyRingProps> = ({
  name,
  avatarUrl,
  lastContactedAt,
  targetFrequencyDays = 14,
  size = 48,
}) => {
  const { status } = calculateRecencyStatus(lastContactedAt, targetFrequencyDays);

  const initial = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <div 
      className={`recency-ring ${status} relative flex items-center justify-center overflow-hidden bg-[var(--ios-card-secondary)] text-[var(--ios-label-primary)] font-bold text-lg`}
      style={{ width: size, height: size }}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
};
