import type { Contact, LogEntry, Category, Medium, FrequencyOption } from './schema';

const STORAGE_KEY_CONTACTS = 'connected_pwa_contacts_v2';
const STORAGE_KEY_LOGS = 'connected_pwa_logs_v2';
const STORAGE_KEY_CATEGORIES = 'connected_pwa_categories_v2';

const SEED_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Family' },
  { id: 'cat-2', name: 'Close Friends' },
  { id: 'cat-3', name: 'Work' },
  { id: 'cat-4', name: 'Mentors' },
];

const SEED_CONTACTS: Contact[] = [
  {
    id: 'contact-1',
    name: 'Mom',
    category: 'Family',
    phone: '+15550192834',
    targetFrequency: 'Weekly',
    lastContactedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    lastMedium: 'FaceTime',
    notes: 'Loves garden updates. Remind her about upcoming weekend lunch.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'contact-2',
    name: 'Alex Rivera',
    category: 'Close Friends',
    phone: '+15550123984',
    targetFrequency: 'Monthly',
    lastContactedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    lastMedium: 'iMessage',
    notes: 'Recently changed jobs to Senior PM. Asked about onboarding.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'contact-3',
    name: 'Uncle David',
    category: 'Family',
    phone: '+15550182736',
    targetFrequency: 'Quarterly',
    lastContactedAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(), // 24 days ago
    lastMedium: 'Call',
    notes: 'Planning family reunion trip next summer.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'contact-4',
    name: 'Mei Chen',
    category: 'Close Friends',
    phone: '+15550174829',
    targetFrequency: 'Monthly',
    lastContactedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 days ago
    lastMedium: 'WeChat',
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
    medium: 'FaceTime',
    summary: 'Had a quick 15-min catchup. Shared photos from Sunday park walk.',
    occurredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'log-2',
    contactId: 'contact-2',
    contactName: 'Alex Rivera',
    medium: 'iMessage',
    summary: 'Sent congrats message for new job role!',
    occurredAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  }
];

export class StorageService {
  // Categories
  static getCategories(): Category[] {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (!raw) {
      this.saveCategories(SEED_CATEGORIES);
      return SEED_CATEGORIES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_CATEGORIES;
    }
  }

  static saveCategories(categories: Category[]): void {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  }

  static addCategory(name: string): Category {
    const categories = this.getCategories();
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
    };
    categories.push(newCat);
    this.saveCategories(categories);
    return newCat;
  }

  // Contacts
  static getContacts(): Contact[] {
    const raw = localStorage.getItem(STORAGE_KEY_CONTACTS);
    let contacts: Contact[] = [];
    if (!raw) {
      contacts = SEED_CONTACTS;
      this.saveContacts(contacts);
    } else {
      try {
        contacts = JSON.parse(raw);
      } catch {
        contacts = SEED_CONTACTS;
      }
    }

    // Sort strictly by recency: Most recent check-in at the top!
    return contacts.sort((a, b) => {
      const timeA = a.lastContactedAt ? new Date(a.lastContactedAt).getTime() : 0;
      const timeB = b.lastContactedAt ? new Date(b.lastContactedAt).getTime() : 0;
      return timeB - timeA;
    });
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

  // Logs
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
    medium: Medium;
    summary?: string;
    occurredAt?: string;
  }): LogEntry {
    const logs = this.getLogs();
    const occurredAt = logData.occurredAt || new Date().toISOString();
    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      contactId: logData.contactId,
      contactName: logData.contactName,
      medium: logData.medium,
      summary: logData.summary || `Logged ${logData.medium} conversation`,
      occurredAt,
      createdAt: new Date().toISOString(),
    };
    
    logs.unshift(newLog);
    this.saveLogs(logs);

    // Update contact's lastContactedAt & lastMedium
    this.updateContact(logData.contactId, {
      lastContactedAt: occurredAt,
      lastMedium: logData.medium,
    });

    return newLog;
  }
}
