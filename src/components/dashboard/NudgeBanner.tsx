import React from 'react';
import type { Contact } from '../../db/schema';
import { calculateRecencyStatus } from '../../db/schema';
import { Sparkles, MessageSquare } from 'lucide-react';
import '../../styles/glass.css';

interface NudgeBannerProps {
  contacts: Contact[];
  onQuickLog: (contact: Contact) => void;
}

export const NudgeBanner: React.FC<NudgeBannerProps> = ({
  contacts,
  onQuickLog,
}) => {
  // Find contacts that are red (overdue) or amber (due soon)
  const overdueContacts = contacts.filter((c) => {
    const { status } = calculateRecencyStatus(c.lastContactedAt, c.targetFrequencyDays);
    return status === 'red' || status === 'amber';
  });

  if (overdueContacts.length === 0) return null;

  const topNudge = overdueContacts[0];
  const { daysDiff } = calculateRecencyStatus(topNudge.lastContactedAt, topNudge.targetFrequencyDays);

  return (
    <div className="glass-card p-4 my-3 bg-gradient-to-r from-[rgba(255,149,0,0.1)] to-[rgba(255,59,48,0.1)] border border-[rgba(255,149,0,0.25)] rounded-[18px]">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5 text-[var(--ios-amber)] text-[12px] font-bold uppercase tracking-wider">
          <Sparkles size={15} />
          <span>Gentle Catch-Up Nudge</span>
        </div>
        <span className="text-[11px] font-medium text-[var(--ios-label-secondary)]">
          {overdueContacts.length} people due
        </span>
      </div>

      <h4 className="text-[15px] font-bold text-[var(--ios-label-primary)] mt-1">
        Reach out to {topNudge.name}
      </h4>

      <p className="text-[13px] text-[var(--ios-label-secondary)] mt-0.5">
        {daysDiff === 999 
          ? `You haven't logged an interaction yet. Target is every ${topNudge.targetFrequencyDays} days.`
          : `Last connected ${daysDiff} days ago (Target: every ${topNudge.targetFrequencyDays} days).`
        }
      </p>

      {topNudge.notes && (
        <p className="text-[12px] italic text-[var(--ios-label-tertiary)] mt-1 truncate">
          "{topNudge.notes}"
        </p>
      )}

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onQuickLog(topNudge)}
          className="flex-1 py-2 rounded-xl bg-[var(--ios-blue)] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 touch-active shadow-xs"
        >
          <MessageSquare size={15} />
          <span>Quick Log</span>
        </button>
      </div>
    </div>
  );
};
