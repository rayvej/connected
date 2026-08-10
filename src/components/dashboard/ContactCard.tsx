import React, { useState } from 'react';
import type { Contact, Platform } from '../../db/schema';
import { RecencyRing } from '../common/RecencyRing';
import { RecencyBadge } from '../common/RecencyBadge';
import { getPlatformBadgeStyle } from '../../utils/platformIcons';
import { MessageCircle, Phone, ChevronRight } from 'lucide-react';
import '../../styles/glass.css';

interface ContactCardProps {
  contact: Contact;
  onQuickLog: (contact: Contact, platform: Platform) => void;
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
    // Allow right swipe up to 140px
    if (diff > 0 && diff < 160) {
      setSwipeOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset > 80) {
      setSwipeOffset(140); // Snap open swipe quick actions
    } else {
      setSwipeOffset(0); // Reset
    }
    setTouchStartX(null);
  };

  const platformBadgeStyle = getPlatformBadgeStyle(contact.lastPlatform);

  return (
    <div className="relative overflow-hidden rounded-[16px] my-2 bg-[var(--ios-card-bg)] border border-[var(--ios-card-border)] shadow-sm">
      {/* Revealed Swipe Quick Action Buttons (Left side reveal when swiped right) */}
      <div 
        className="absolute inset-y-0 left-0 flex items-center bg-[var(--ios-blue-muted)] px-3 gap-2"
        style={{ width: `${swipeOffset}px` }}
      >
        <button
          onClick={() => {
            onQuickLog(contact, 'iMessage');
            setSwipeOffset(0);
          }}
          className="w-10 h-10 rounded-full bg-[var(--platform-imessage)] text-white flex items-center justify-center touch-active"
          title="Quick iMessage Log"
        >
          <MessageCircle size={18} />
        </button>

        <button
          onClick={() => {
            onQuickLog(contact, 'Call');
            setSwipeOffset(0);
          }}
          className="w-10 h-10 rounded-full bg-[var(--platform-phone)] text-white flex items-center justify-center touch-active"
          title="Quick Call Log"
        >
          <Phone size={18} />
        </button>
      </div>

      {/* Main Touch Card Body */}
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
        className="glass-card p-3.5 flex items-center justify-between gap-3 touch-active cursor-pointer transition-transform duration-200"
        style={{ transform: `translateX(${swipeOffset}px)` }}
      >
        {/* Avatar with Recency Ring */}
        <RecencyRing
          name={contact.name}
          avatarUrl={contact.avatarUrl}
          lastContactedAt={contact.lastContactedAt}
          targetFrequencyDays={contact.targetFrequencyDays}
          size={50}
        />

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-semibold text-[var(--ios-label-primary)] truncate">
              {contact.name}
            </h3>
            <RecencyBadge
              lastContactedAt={contact.lastContactedAt}
              targetFrequencyDays={contact.targetFrequencyDays}
            />
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-[12px] font-medium text-[var(--ios-label-secondary)]">
              {contact.relationship}
            </span>
            {contact.lastPlatform && (
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={platformBadgeStyle}
              >
                {contact.lastPlatform}
              </span>
            )}
          </div>

          {contact.notes && (
            <p className="text-[12px] text-[var(--ios-label-secondary)] truncate mt-1">
              {contact.notes}
            </p>
          )}
        </div>

        <ChevronRight size={18} className="text-[var(--ios-label-tertiary)] flex-shrink-0" />
      </div>
    </div>
  );
};
