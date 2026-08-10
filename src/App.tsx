import React, { useState, useEffect } from 'react';
import type { Contact, LogEntry, Category, Medium } from './db/schema';
import { StorageService } from './db/storageService';
import { HeaderBlur } from './components/common/HeaderBlur';
import { TabBar, TabType } from './components/layout/TabBar';
import { ContactCard } from './components/dashboard/ContactCard';
import { LogTimeline } from './components/logs/LogTimeline';
import { QuickLogSheet } from './components/logs/QuickLogSheet';
import { ContactFormSheet } from './components/contacts/ContactFormSheet';
import { ShortcutsView } from './components/shortcuts/ShortcutsView';
import { AuthScreen } from './components/auth/AuthScreen';
import './styles/tokens.css';
import './styles/glass.css';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sheets Control
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [preselectedContact, setPreselectedContact] = useState<Contact | null>(null);

  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  useEffect(() => {
    refreshData();

    // Deep link shortcut parser (e.g. ?quicklog=true&contact=Mom&medium=iMessage)
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
    setCategories(StorageService.getCategories());
  };

  // Handlers
  const handleSaveLog = (data: {
    contactId: string;
    contactName: string;
    medium: Medium;
    summary?: string;
  }) => {
    StorageService.addLog(data);
    refreshData();
  };

  const handleAddCategory = (name: string) => {
    StorageService.addCategory(name);
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

  const handleSwipeQuickLog = (contact: Contact, medium: Medium) => {
    StorageService.addLog({
      contactId: contact.id,
      contactName: contact.name,
      medium,
      summary: `Logged ${medium} check-in`,
    });
    refreshData();
  };

  // Filtered Contacts (Option C: Top Search Bar + Recency Sorting)
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.notes && c.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat =
      selectedCategory === 'All' || c.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  if (!isAuthenticated) {
    return <AuthScreen onSignIn={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-solid)] text-[var(--text-primary)] relative overflow-x-hidden">
      <div className="frosted-bg-overlay" />

      {/* Ambient background glow blobs (Reading Tracker style) */}
      <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden opacity-50">
        <div className="absolute -top-24 -left-24 w-[280px] h-[280px] rounded-full bg-amber-500/12 blur-[120px] animate-float-1" />
        <div className="absolute top-[45%] -right-12 w-[240px] h-[240px] rounded-full bg-rose-600/10 blur-[120px] animate-float-2" />
        <div className="absolute -bottom-24 left-[5%] w-[260px] h-[260px] rounded-full bg-amber-500/8 blur-[120px] animate-float-1" />
      </div>

      {/* Responsive iPhone Container (max-w-[448px] centering on Desktop) */}
      <div className="relative z-10 flex flex-col min-h-screen max-w-[448px] mx-auto border-x border-[var(--border-color)] bg-[var(--bg-solid)] shadow-2xl">
        {/* Header */}
        <HeaderBlur
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddContactClick={() => {
            setEditingContact(null);
            setIsContactFormOpen(true);
          }}
        />

        {/* Main Tab View Area */}
        <main className="px-4 pt-3 flex-1">
          {/* 1. RECENCY DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-3 pb-24">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-[13px] font-serif font-bold text-[var(--gold)] uppercase tracking-wider">
                  Check-In Recency ({filteredContacts.length})
                </h2>
                <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
                  Most recent first
                </span>
              </div>

              {filteredContacts.length === 0 ? (
                <div className="text-center py-16 text-[var(--text-secondary)]">
                  <p className="text-[15px] font-serif font-bold text-[var(--text-primary)]">
                    No contacts found
                  </p>
                  <p className="text-[12px] opacity-75 mt-1">
                    {searchQuery ? 'Try a different search query' : 'Tap + Add Person to get started'}
                  </p>
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onQuickLog={handleSwipeQuickLog}
                    onSelectContact={(c) => {
                      setEditingContact(c);
                      setIsContactFormOpen(true);
                    }}
                  />
                ))
              )}
            </div>
          )}

          {/* 2. HISTORY TIMELINE TAB */}
          {activeTab === 'logs' && (
            <LogTimeline logs={logs} searchQuery={searchQuery} />
          )}

          {/* 3. SHORTCUTS & SETTINGS TAB */}
          {activeTab === 'shortcuts' && <ShortcutsView />}
        </main>

        {/* Bottom Glass Navigation Bar */}
        <TabBar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onQuickLogClick={() => {
            setPreselectedContact(null);
            setIsQuickLogOpen(true);
          }}
        />
      </div>

      {/* Quick Log Sheet */}
      <QuickLogSheet
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        contacts={contacts}
        preselectedContact={preselectedContact}
        onSaveLog={handleSaveLog}
      />

      {/* Contact Form Sheet (Add/Edit) */}
      <ContactFormSheet
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
        initialContact={editingContact}
        categories={categories}
        onAddCategory={handleAddCategory}
        onSave={handleSaveContact}
        onUpdate={handleUpdateContact}
        onDelete={handleDeleteContact}
      />
    </div>
  );
}

export default App;
