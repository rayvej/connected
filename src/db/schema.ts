export type Platform = 'iMessage' | 'WhatsApp' | 'WeChat' | 'FaceTime' | 'Call';
export type InteractionType = 'Text' | 'Call' | 'Video' | 'In-Person';

export type RecencyStatus = 'green' | 'amber' | 'red';

export interface Contact {
  id: string;
  name: string;
  relationship: string; // e.g. "Family", "Close Friend", "Work"
  avatarUrl?: string;
  phone?: string;
  targetFrequencyDays: number; // e.g., 14 for catch up every 2 weeks
  lastContactedAt?: string; // ISO String
  lastPlatform?: Platform;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LogEntry {
  id: string;
  contactId: string;
  contactName: string;
  platform: Platform;
  interactionType: InteractionType;
  occurredAt: string; // ISO String
  summary: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
}

/**
 * Calculates recency status ring based on last contacted date vs target frequency.
 * Green: <75% of target frequency elapsed
 * Amber: 75% - 100% of target frequency elapsed
 * Red: >100% of target frequency elapsed (Overdue)
 */
export function calculateRecencyStatus(lastContactedAt?: string, targetFrequencyDays: number = 14): {
  status: RecencyStatus;
  daysDiff: number;
  daysRemaining: number;
} {
  if (!lastContactedAt) {
    return { status: 'red', daysDiff: 999, daysRemaining: 0 };
  }

  const lastDate = new Date(lastContactedAt).getTime();
  const now = Date.now();
  const diffMs = now - lastDate;
  const daysDiff = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  const daysRemaining = targetFrequencyDays - daysDiff;

  const ratio = daysDiff / targetFrequencyDays;

  let status: RecencyStatus = 'green';
  if (ratio >= 1.0) {
    status = 'red';
  } else if (ratio >= 0.75) {
    status = 'amber';
  }

  return { status, daysDiff, daysRemaining };
}
