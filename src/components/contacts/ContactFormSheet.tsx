import React, { useState, useEffect } from 'react';
import { BottomSheet } from '../common/BottomSheet';
import { Contact } from '../../db/schema';
import { User } from 'lucide-react';

interface ContactFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialContact?: Contact | null;
  onSave: (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate?: (id: string, updates: Partial<Contact>) => void;
  onDelete?: (id: string) => void;
}

export const ContactFormSheet: React.FC<ContactFormSheetProps> = ({
  isOpen,
  onClose,
  initialContact,
  onSave,
  onUpdate,
  onDelete,
}) => {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Family');
  const [phone, setPhone] = useState('');
  const [targetFrequencyDays, setTargetFrequencyDays] = useState(14);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialContact) {
      setName(initialContact.name);
      setRelationship(initialContact.relationship || 'Family');
      setPhone(initialContact.phone || '');
      setTargetFrequencyDays(initialContact.targetFrequencyDays || 14);
      setNotes(initialContact.notes || '');
    } else {
      setName('');
      setRelationship('Family');
      setPhone('');
      setTargetFrequencyDays(14);
      setNotes('');
    }
  }, [initialContact, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (initialContact && onUpdate) {
      onUpdate(initialContact.id, {
        name: name.trim(),
        relationship: relationship.trim(),
        phone: phone.trim(),
        targetFrequencyDays: Number(targetFrequencyDays),
        notes: notes.trim(),
      });
    } else {
      onSave({
        name: name.trim(),
        relationship: relationship.trim(),
        phone: phone.trim(),
        targetFrequencyDays: Number(targetFrequencyDays),
        notes: notes.trim(),
      });
    }

    onClose();
  };

  const frequencyOptions = [
    { label: 'Weekly (7d)', value: 7 },
    { label: 'Bi-Weekly (14d)', value: 14 },
    { label: 'Monthly (30d)', value: 30 },
    { label: 'Quarterly (90d)', value: 90 },
  ];

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={initialContact ? 'Edit Person' : 'Add New Person'}
      subtitle="Configure target catch-up frequency and notes"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Name */}
        <div>
          <label className="text-[12px] font-semibold text-[var(--ios-label-secondary)] uppercase tracking-wider block mb-1">
            Full Name *
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ios-label-tertiary)]" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Connor"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[var(--ios-card-secondary)] border border-[var(--ios-card-border)] text-[14px] text-[var(--ios-label-primary)] outline-none focus:border-[var(--ios-blue)]"
            />
          </div>
        </div>

        {/* Relationship & Phone Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-[12px] font-semibold text-[var(--ios-label-secondary)] uppercase tracking-wider block mb-1">
              Relationship
            </label>
            <input
              type="text"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="e.g. Family, Friend"
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--ios-card-secondary)] border border-[var(--ios-card-border)] text-[14px] text-[var(--ios-label-primary)] outline-none focus:border-[var(--ios-blue)]"
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-[var(--ios-label-secondary)] uppercase tracking-wider block mb-1">
              Phone (Optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 0192"
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--ios-card-secondary)] border border-[var(--ios-card-border)] text-[14px] text-[var(--ios-label-primary)] outline-none focus:border-[var(--ios-blue)]"
            />
          </div>
        </div>

        {/* Target Frequency */}
        <div>
          <label className="text-[12px] font-semibold text-[var(--ios-label-secondary)] uppercase tracking-wider block mb-1">
            Catch-Up Target Frequency
          </label>
          <div className="grid grid-cols-2 gap-2">
            {frequencyOptions.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setTargetFrequencyDays(opt.value)}
                className={`py-2 px-3 rounded-xl text-[13px] font-semibold border touch-active transition-all ${
                  targetFrequencyDays === opt.value
                    ? 'bg-[var(--ios-blue)] text-white border-transparent'
                    : 'bg-[var(--ios-card-secondary)] text-[var(--ios-label-primary)] border-[var(--ios-card-border)]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-[12px] font-semibold text-[var(--ios-label-secondary)] uppercase tracking-wider block mb-1">
            Important Context / Notes
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Loves reading, kids birthdays, upcoming events..."
            className="w-full px-3 py-2.5 rounded-xl bg-[var(--ios-card-secondary)] border border-[var(--ios-card-border)] text-[14px] text-[var(--ios-label-primary)] outline-none focus:border-[var(--ios-blue)]"
          />
        </div>

        {/* Submit & Delete Actions */}
        <div className="pt-2 space-y-2">
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[var(--ios-blue)] text-white text-[15px] font-semibold touch-active shadow-xs"
          >
            {initialContact ? 'Save Changes' : 'Add Person'}
          </button>

          {initialContact && onDelete && (
            <button
              type="button"
              onClick={() => {
                if (confirm(`Delete ${initialContact.name}?`)) {
                  onDelete(initialContact.id);
                  onClose();
                }
              }}
              className="w-full py-2.5 rounded-xl bg-[var(--ios-red-muted)] text-[var(--ios-red)] text-[14px] font-semibold touch-active"
            >
              Delete Person
            </button>
          )}
        </div>
      </form>
    </BottomSheet>
  );
};
