import React, { useState, useEffect } from 'react';
import { Contact, LogEntry, Platform, InteractionType } from './db/schema';
import { StorageService } from './db/storageService';
import { HeaderBlur } from './components/common/HeaderBlur';
import { TabBar, TabType } from './components/layout/TabBar';
import { NudgeBanner } from './components/dashboard/NudgeBanner';
import { ContactCard } from './components/dashboard/ContactCard';
import { LogTimeline } from './components/logs/LogTimeline';
import { QuickLogSheet } from './components/logs/QuickLogSheet';
import { ContactFormSheet } from './components/contacts/ContactFormSheet';
import { ShortcutsView } from './components/shortcuts/ShortcutsView';
import { Plus, ShieldCheck } from 'lucide-react';
import './styles/tokens.css';
import './styles/glass.css';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Modal Sheet Controls
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [preselectedContact, setPreselectedContact] = useState<Contact | null>(null);

  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Load Contacts & Logs from Local Persistence
  useEffect(() => {
    refreshData();

    // Parse URL Deep Links for iOS Shortcuts (e.g. ?quicklog=true&contact=Mom&platform=iMessage)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('quicklog') === 'true' || urlParams.get('quicklog') === '1') {
      const contactName = urlParams.get('contact');
      if (contactName) {
        const found = StorageService.getContacts().find(
          (c) => c.name.toLowerCase() === contactName.toLowerCase()
        );
        if (found) setPreselectedContact(found);
      }
      setIsQuickLogOpen(true);
    }
  }, []);

  const refreshData = () => {
    setContacts(StorageService.getContacts());
    setLogs(StorageService.getLogs());
  };

  // Handlers
  const handleSaveLog = (data: {
    contactId: string;
    contactName: string;
    platform: Platform;
    interactionType: InteractionType;
    summary?: string;
  }) => {
    StorageService.addLog(data);
    refreshData();
  };

  const handleSaveContact = (
    contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    StorageService.addContact(contactData);
    refreshData();
  };

  const handleUpdateContact = (id: string, updates: Partial<Contact>) => {
    StorageService.updateContact(id, updates);
    refreshData();
  };

  const handleDeleteContact = (id: string) => {
    StorageService.deleteContact(id);
    refreshData();
  };

  const handleSwipeQuickLog = (contact: Contact, platform: Platform) => {
    StorageService.addLog({
      contactId: contact.id,
      contactName: contact.name,
      platform,
      interactionType: platform === 'Call' ? 'Call' : platform === 'FaceTime' ? 'Video' : 'Text',
      summary: `Logged ${platform} catchup`,
    });
    refreshData();
  };

  return (
    <div className="min-h-screen bg-[var(--ios-bg-base)] text-[var(--ios-label-primary)] pb-12">
      {/* Header */}
      <HeaderBlur
        title={
          activeTab === 'dashboard'
            ? 'Relationship Health'
            : activeTab === 'logs'
            ? 'Interaction History'
            : activeTab === 'contacts'
            ? 'Manage People'
            : 'iOS Automation'
        }
        subtitle="Connected • iOS PWA"
        rightAction={
          activeTab === 'contacts' ? (
            <button
              onClick={() => {
                setEditingContact(null);
                setIsContactFormOpen(true);
              }}
              className="p-2 rounded-full bg-[var(--ios-blue-muted)] text-[var(--ios-blue)] font-semibold text-[13px] flex items-center gap-1 touch-active"
            >
              <Plus size={16} />
              <span>Add</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-[var(--ios-green)] bg-[var(--ios-green-muted)] px-2.5 py-1 rounded-full">
              <ShieldCheck size={13} />
              <span>$0 Offline Local</span>
            </div>
          )
        }
      />

      {/* Main Tab Views */}
      <main className="px-4 pt-3 max-w-lg mx-auto">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4 pb-24">
            {/* Proactive Nudge Banner */}
            <NudgeBanner
              contacts={contacts}
              onQuickLog={(contact) => {
                setPreselectedContact(contact);
                setIsQuickLogOpen(true);
              }}
            />

            {/* Section Title */}
            <div className="flex items-center justify-between mt-4 mb-2">
              <h2 className="text-[14px] font-bold text-[var(--ios-label-secondary)] uppercase tracking-wider">
                Recency Touchpoints ({contacts.length})
              </h2>
              <span className="text-[12px] text-[var(--ios-label-tertiary)] font-medium">
                Swipe right for 1-tap log
              </span>
            </div>

            {/* Contact List Cards */}
            {contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onQuickLog={handleSwipeQuickLog}
                onSelectContact={(c) => {
                  setEditingContact(c);
                  setIsContactFormOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {/* LOG HISTORY TIMELINE TAB */}
        {activeTab === 'logs' && <LogTimeline logs={logs} />}

        {/* CONTACTS MANAGEMENT TAB */}
        {activeTab === 'contacts' && (
          <div className="space-y-3 pb-24">
            <button
              onClick={() => {
                setEditingContact(null);
                setIsContactFormOpen(true);
              }}
              className="w-full py-3 px-4 rounded-[16px] bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] text-[var(--ios-blue)] font-semibold text-[14px] flex items-center justify-center gap-2 touch-active shadow-xs"
            >
              <Plus size={18} />
              <span>Add New Person</span>
            </button>

            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => {
                  setEditingContact(contact);
                  setIsContactFormOpen(true);
                }}
                className="glass-card p-3.5 flex items-center justify-between touch-active cursor-pointer"
              >
                <div>
                  <h3 className="text-[16px] font-semibold text-[var(--ios-label-primary)]">
                    {contact.name}
                  </h3>
                  <p className="text-[12px] text-[var(--ios-label-secondary)]">
                    {contact.relationship} • Target: every {contact.targetFrequencyDays} days
                  </p>
                </div>
                <span className="text-[12px] font-semibold text-[var(--ios-blue)]">
                  Edit
                </span>
              </div>
            ))}
          </div>
        )}

        {/* SHORTCUTS & AUTOMATION TAB */}
        {activeTab === 'shortcuts' && <ShortcutsView />}
      </main>

      {/* Floating Bottom Tab Bar */}
      <TabBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onQuickLogClick={() => {
          setPreselectedContact(null);
          setIsQuickLogOpen(true);
        }}
      />

      {/* Quick Log Modal Sheet */}
      <QuickLogSheet
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        contacts={contacts}
        preselectedContact={preselectedContact}
        onSaveLog={handleSaveLog}
      />

      {/* Contact Form Sheet (Add / Edit) */}
      <ContactFormSheet
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
        initialContact={editingContact}
        onSave={handleSaveContact}
        onUpdate={handleUpdateContact}
        onDelete={handleDeleteContact}
      />
    </div>
  );
}

export default App;
