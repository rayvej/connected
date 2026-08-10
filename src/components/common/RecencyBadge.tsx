import React from 'react';
import { RecencyStatus, calculateRecencyStatus } from '../../db/schema';

interface RecencyBadgeProps {
  lastContactedAt?: string;
  targetFrequencyDays?: number;
}

export const RecencyBadge: React.FC<RecencyBadgeProps> = ({
  lastContactedAt,
  targetFrequencyDays = 14,
}) => {
  const { status, daysDiff, daysRemaining } = calculateRecencyStatus(lastContactedAt, targetFrequencyDays);

  let badgeBg = 'var(--ios-green-muted)';
  let textColor = 'var(--ios-green)';
  let label = '';

  if (status === 'green') {
    badgeBg = 'var(--ios-green-muted)';
    textColor = 'var(--ios-green)';
    label = daysDiff === 0 ? 'Today' : `${daysDiff}d ago`;
  } else if (status === 'amber') {
    badgeBg = 'var(--ios-amber-muted)';
    textColor = 'var(--ios-amber)';
    label = `Due in ${daysRemaining}d`;
  } else {
    badgeBg = 'var(--ios-red-muted)';
    textColor = 'var(--ios-red)';
    label = daysDiff === 999 ? 'Never' : `${daysDiff - targetFrequencyDays}d overdue`;
  }

  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold inline-flex items-center gap-1"
      style={{ backgroundColor: badgeBg, color: textColor }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: textColor }} />
      {label}
    </span>
  );
};
