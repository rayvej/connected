import React, { useState } from 'react';
import type { Contact, Medium } from '../../db/schema';
import { formatRelativeTime } from '../../utils/dateUtils';
import { MessageSquare, Phone, ChevronRight } from 'lucide-react';
import '../../styles/glass.css';

interface ContactCardProps {
  contact: Contact;
  onQuickLog: (contact: Contact, medium: Medium) => void;
  onSelectContact: (contact: Contact) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onQuickLog,
  onSelectContact,
}) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX;
    if (diff > 0 && diff < 150) {
      setSwipeOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset > 75) {
      setSwipeOffset(130);
    } else {
      setSwipeOffset(0);
    }
    setTouchStartX(null);
  };

  return (
    <div className="relative overflow-hidden rounded-[18px] my-2 bg-[var(--bg-card)] border border-[var(--border-color)] transition-colors hover:border-[var(--border-strong)]">
      {/* Swipe Quick Actions (Revealed on right-swipe) */}
      <div 
        className="absolute inset-y-0 left-0 flex items-center bg-[var(--gold-muted)] px-3 gap-2"
        style={{ width: `${swipeOffset}px` }}
      >
        <button
          onClick={() => {
            onQuickLog(contact, 'iMessage');
            setSwipeOffset(0);
          }}
          className="w-9 h-9 rounded-full bg-[#007AFF] text-white flex items-center justify-center touch-active"
          title="Quick iMessage"
        >
          <MessageSquare size={16} />
        </button>

        <button
          onClick={() => {
            onQuickLog(contact, 'Call');
            setSwipeOffset(0);
          }}
          className="w-9 h-9 rounded-full bg-[#34C759] text-white flex items-center justify-center touch-active"
          title="Quick Call"
        >
          <Phone size={16} />
        </button>
      </div>

      {/* Main Editorial Card Body */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => {
          if (swipeOffset > 0) {
            setSwipeOffset(0);
          } else {
            onSelectContact(contact);
          }
        }}
        className="p-4 cursor-pointer touch-active transition-transform duration-200"
        style={{ transform: `translateX(${swipeOffset}px)` }}
      >
        {/* Name and Recency Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-[17px] font-serif font-bold text-[var(--gold)] truncate">
              {contact.name}
            </h3>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-[var(--bg-card-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]">
              {contact.category || 'General'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0 text-[11px] font-mono text-[var(--text-secondary)]">
            <span>{formatRelativeTime(contact.lastContactedAt)}</span>
            <ChevronRight size={15} className="text-[var(--text-tertiary)]" />
          </div>
        </div>

        {/* Medium and Notes */}
        <div className="mt-2 flex items-center justify-between gap-2 text-[12px]">
          {contact.lastMedium ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[rgba(212,175,55,0.1)] text-[var(--gold)] border border-[var(--border-strong)]">
              Via {contact.lastMedium}
            </span>
          ) : (
            <span className="text-[11px] text-[var(--text-tertiary)] italic">No medium logged</span>
          )}

          <span className="text-[11px] text-[var(--text-tertiary)] font-mono">
            Target: {contact.targetFrequency}
          </span>
        </div>

        {contact.notes && (
          <p className="text-[12.5px] text-[var(--text-secondary)] mt-2 line-clamp-2 leading-relaxed selectable">
            {contact.notes}
          </p>
        )}
      </div>
    </div>
  );
};
