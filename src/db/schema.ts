export type Medium = 'iMessage' | 'Call' | 'WhatsApp' | 'FaceTime' | 'WeChat' | 'In-Person';

export type FrequencyOption = 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly' | 'Custom';

export interface Category {
  id: string;
  name: string;
}

export interface Contact {
  id: string;
  name: string;
  category: string; // User-defined group (e.g. "Family", "Close Friends", "Work")
  phone?: string;
  targetFrequency: FrequencyOption;
  customTargetDays?: number;
  lastContactedAt?: string; // ISO date string
  lastMedium?: Medium;
  notes?: string; // Memories, gift ideas, key facts
  createdAt: string;
  updatedAt: string;
}

export interface LogEntry {
  id: string;
  contactId: string;
  contactName: string;
  medium: Medium;
  summary: string;
  occurredAt: string; // ISO date string
  createdAt: string;
}

export function getTargetDays(frequency: FrequencyOption, customDays?: number): number {
  switch (frequency) {
    case 'Weekly': return 7;
    case 'Monthly': return 30;
    case 'Quarterly': return 90;
    case 'Yearly': return 365;
    case 'Custom': return customDays && customDays > 0 ? customDays : 14;
    default: return 30;
  }
}
