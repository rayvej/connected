import React, { useState, useEffect } from 'react';
import { BottomSheet } from '../common/BottomSheet';
import type { Contact, Category, FrequencyOption } from '../../db/schema';
import { User, Tag, Phone, Plus } from 'lucide-react';

interface ContactFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialContact?: Contact | null;
  categories: Category[];
  onAddCategory: (name: string) => void;
  onSave: (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate?: (id: string, updates: Partial<Contact>) => void;
  onDelete?: (id: string) => void;
}

export const ContactFormSheet: React.FC<ContactFormSheetProps> = ({
  isOpen,
  onClose,
  initialContact,
  categories,
  onAddCategory,
  onSave,
  onUpdate,
  onDelete,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Family');
  const [phone, setPhone] = useState('');
  const [targetFrequency, setTargetFrequency] = useState<FrequencyOption>('Monthly');
  const [customDays, setCustomDays] = useState(14);
  const [notes, setNotes] = useState('');

  const [newCatInput, setNewCatInput] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);

  useEffect(() => {
    if (initialContact) {
      setName(initialContact.name);
      setCategory(initialContact.category || 'Family');
      setPhone(initialContact.phone || '');
      setTargetFrequency(initialContact.targetFrequency || 'Monthly');
      setCustomDays(initialContact.customTargetDays || 14);
      setNotes(initialContact.notes || '');
    } else {
      setName('');
      setCategory(categories[0]?.name || 'Family');
      setPhone('');
      setTargetFrequency('Monthly');
      setCustomDays(14);
      setNotes('');
    }
  }, [initialContact, isOpen, categories]);

  const handleAddNewCat = () => {
    if (newCatInput.trim()) {
      onAddCategory(newCatInput.trim());
      setCategory(newCatInput.trim());
      setNewCatInput('');
      setShowAddCat(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (initialContact && onUpdate) {
      onUpdate(initialContact.id, {
        name: name.trim(),
        category: category.trim(),
        phone: phone.trim(),
        targetFrequency,
        customTargetDays: Number(customDays),
        notes: notes.trim(),
      });
    } else {
      onSave({
        name: name.trim(),
        category: category.trim(),
        phone: phone.trim(),
        targetFrequency,
        customTargetDays: Number(customDays),
        notes: notes.trim(),
      });
    }

    onClose();
  };

  const frequencyOptions: FrequencyOption[] = ['Weekly', 'Monthly', 'Quarterly', 'Yearly', 'Custom'];

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={initialContact ? 'Edit Person' : 'Add Person'}
      subtitle="Configure target check-in frequency and memory notes"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
            Name *
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Connor"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[var(--bg-card-secondary)] border border-[var(--border-color)] text-[14px] text-[var(--text-primary)] outline-none focus:border-[var(--gold)]"
            />
          </div>
        </div>

        {/* Category / Group */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              Category / Group
            </label>
            <button
              type="button"
              onClick={() => setShowAddCat(!showAddCat)}
              className="text-[11px] text-[var(--gold)] font-semibold flex items-center gap-0.5"
            >
              <Plus size={13} />
              <span>New Group</span>
            </button>
          </div>

          {showAddCat ? (
            <div className="flex gap-2 my-1">
              <input
                type="text"
                value={newCatInput}
                onChange={(e) => setNewCatInput(e.target.value)}
                placeholder="e.g. Mentors, Neighbors"
                className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-card-secondary)] border border-[var(--border-strong)] text-[13px] text-[var(--text-primary)] outline-none"
              />
              <button
                type="button"
                onClick={handleAddNewCat}
                className="px-3 py-2 rounded-xl bg-[var(--gold)] text-black font-semibold text-[12px]"
              >
                Add
              </button>
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => {
                const isSelected = cat.name === category;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap touch-active transition-all ${
                      isSelected
                        ? 'bg-[var(--gold)] text-black'
                        : 'bg-[var(--bg-card-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
            Phone Number (Optional)
          </label>
          <div className="relative">
            <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 0192"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[var(--bg-card-secondary)] border border-[var(--border-color)] text-[14px] text-[var(--text-primary)] outline-none focus:border-[var(--gold)]"
            />
          </div>
        </div>

        {/* Target Frequency */}
        <div>
          <label className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
            Check-In Frequency Target
          </label>
          <div className="grid grid-cols-3 gap-2">
            {frequencyOptions.map((freq) => (
              <button
                type="button"
                key={freq}
                onClick={() => setTargetFrequency(freq)}
                className={`py-2 px-2.5 rounded-xl text-[12px] font-semibold border touch-active transition-all ${
                  targetFrequency === freq
                    ? 'bg-[var(--gold)] text-black border-transparent'
                    : 'bg-[var(--bg-card-secondary)] text-[var(--text-secondary)] border-[var(--border-color)]'
                }`}
              >
                {freq}
              </button>
            ))}
          </div>

          {targetFrequency === 'Custom' && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[12px] text-[var(--text-secondary)]">Every</span>
              <input
                type="number"
                value={customDays}
                onChange={(e) => setCustomDays(Number(e.target.value))}
                className="w-20 px-3 py-1.5 rounded-xl bg-[var(--bg-card-secondary)] border border-[var(--border-color)] text-[13px] text-[var(--text-primary)] outline-none"
              />
              <span className="text-[12px] text-[var(--text-secondary)]">days</span>
            </div>
          )}
        </div>

        {/* Memory Notes */}
        <div>
          <label className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
            Important Memory Notes & Facts
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Favorite coffee, kids' names, recent life updates, gift ideas..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-card-secondary)] border border-[var(--border-color)] text-[13.5px] text-[var(--text-primary)] outline-none focus:border-[var(--gold)] leading-relaxed"
          />
        </div>

        {/* Submit / Delete */}
        <div className="pt-2 space-y-2">
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl gold-glow-btn text-[15px] font-bold touch-active"
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
              className="w-full py-2.5 rounded-xl bg-red-500/10 text-red-400 text-[13px] font-semibold touch-active"
            >
              Delete Person
            </button>
          )}
        </div>
      </form>
    </BottomSheet>
  );
};
