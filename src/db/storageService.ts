import { Contact, LogEntry, Platform, InteractionType } from './schema';

const STORAGE_KEY_CONTACTS = 'connected_pwa_contacts_v1';
const STORAGE_KEY_LOGS = 'connected_pwa_logs_v1';

// Initial realistic seed contacts for immediate iOS trial
const SEED_CONTACTS: Contact[] = [
  {
    id: 'contact-1',
    name: 'Mom',
    relationship: 'Family',
    phone: '+15550192834',
    targetFrequencyDays: 7, // Every week
    lastContactedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago (Green)
    lastPlatform: 'FaceTime',
    notes: 'Loves gardening updates. Remind her about upcoming weekend lunch.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'contact-2',
    name: 'Alex Rivera',
    relationship: 'Best Friend',
    phone: '+15550123984',
    targetFrequencyDays: 14, // Every 2 weeks
    lastContactedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(), // 11 days ago (Amber)
    lastPlatform: 'iMessage',
    notes: 'Recently changed jobs to Senior Product Manager. Ask how onboarding went.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'contact-3',
    name: 'Uncle David',
    relationship: 'Family',
    phone: '+15550182736',
    targetFrequencyDays: 30, // Monthly
    lastContactedAt: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(), // 42 days ago (Red - Overdue!)
    lastPlatform: 'Call',
    notes: 'Planning family reunion trip next summer.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'contact-4',
    name: 'Mei Chen',
    relationship: 'College Friend',
    phone: '+15550174829',
    targetFrequencyDays: 14,
    lastContactedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago (Green)
    lastPlatform: 'WeChat',
    notes: 'Traveling in Tokyo until end of month.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const SEED_LOGS: LogEntry[] = [
  {
    id: 'log-1',
    contactId: 'contact-1',
    contactName: 'Mom',
    platform: 'FaceTime',
    interactionType: 'Video',
    occurredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    summary: 'Had a quick 15-min catchup. Shared photos from Sunday park walk.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'log-2',
    contactId: 'contact-2',
    contactName: 'Alex Rivera',
    platform: 'iMessage',
    interactionType: 'Text',
    occurredAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    summary: 'Sent congrats message for new job role!',
    createdAt: new Date().toISOString(),
  }
];

export class StorageService {
  static getContacts(): Contact[] {
    const raw = localStorage.getItem(STORAGE_KEY_CONTACTS);
    if (!raw) {
      this.saveContacts(SEED_CONTACTS);
      return SEED_CONTACTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_CONTACTS;
    }
  }

  static saveContacts(contacts: Contact[]): void {
    localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(contacts));
  }

  static addContact(contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Contact {
    const contacts = this.getContacts();
    const newContact: Contact = {
      ...contactData,
      id: `contact-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    contacts.unshift(newContact);
    this.saveContacts(contacts);
    return newContact;
  }

  static updateContact(id: string, updates: Partial<Contact>): Contact | null {
    const contacts = this.getContacts();
    const index = contacts.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    contacts[index] = {
      ...contacts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveContacts(contacts);
    return contacts[index];
  }

  static deleteContact(id: string): void {
    const contacts = this.getContacts().filter(c => c.id !== id);
    this.saveContacts(contacts);
  }

  static getLogs(): LogEntry[] {
    const raw = localStorage.getItem(STORAGE_KEY_LOGS);
    if (!raw) {
      this.saveLogs(SEED_LOGS);
      return SEED_LOGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_LOGS;
    }
  }

  static saveLogs(logs: LogEntry[]): void {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
  }

  static addLog(logData: {
    contactId: string;
    contactName: string;
    platform: Platform;
    interactionType: InteractionType;
    summary?: string;
    occurredAt?: string;
  }): LogEntry {
    const logs = this.getLogs();
    const occurredAt = logData.occurredAt || new Date().toISOString();
    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      contactId: logData.contactId,
      contactName: logData.contactName,
      platform: logData.platform,
      interactionType: logData.interactionType,
      summary: logData.summary || `Logged ${logData.interactionType} via ${logData.platform}`,
      occurredAt,
      createdAt: new Date().toISOString(),
    };
    
    logs.unshift(newLog);
    this.saveLogs(logs);

    // Automatically update the contact's lastContactedAt & lastPlatform!
    this.updateContact(logData.contactId, {
      lastContactedAt: occurredAt,
      lastPlatform: logData.platform,
    });

    return newLog;
  }
}
