import React, { useState } from 'react';
import type { Contact, Medium } from '../../db/schema';
import { formatRelativeTime } from '../../utils/dateUtils';
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
    if (diff > 0 && diff < 140) {
      setSwipeOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset > 70) {
      setSwipeOffset(130);
    } else {
      setSwipeOffset(0);
    }
    setTouchStartX(null);
  };

  const getMediumIcon = (medium?: Medium) => {
    switch (medium) {
      case 'iMessage': return 'fa-comment';
      case 'Call': return 'fa-phone';
      case 'FaceTime': return 'fa-video';
      case 'WhatsApp': return 'fa-message';
      case 'WeChat': return 'fa-[#07C160] fa-comments';
      case 'In-Person': return 'fa-user-group';
      default: return 'fa-comment';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[16px] my-2.5 bg-[var(--bg-card)] border border-[var(--border)] shadow-md transition-all hover:border-[var(--border-strong)]">
      {/* Revealed Swipe Quick Action Overlay */}
      {swipeOffset > 0 && (
        <div 
          className="absolute inset-y-0 left-0 flex items-center bg-[rgba(var(--gold-rgb),0.15)] px-3 gap-2 border-r border-[var(--border-strong)] z-20"
          style={{ width: `${swipeOffset}px` }}
        >
          <button
            onClick={() => {
              onQuickLog(contact, 'iMessage');
              setSwipeOffset(0);
            }}
            className="w-9 h-9 rounded-full bg-[#007AFF] text-white flex items-center justify-center touch-active shadow-sm"
            title="Quick iMessage"
          >
            <i className="fa-solid fa-comment text-sm" />
          </button>

          <button
            onClick={() => {
              onQuickLog(contact, 'Call');
              setSwipeOffset(0);
            }}
            className="w-9 h-9 rounded-full bg-[#34C759] text-white flex items-center justify-center touch-active shadow-sm"
            title="Quick Call"
          >
            <i className="fa-solid fa-phone text-sm" />
          </button>
        </div>
      )}

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
        className="p-4 cursor-pointer touch-active transition-transform duration-200"
        style={{ transform: `translateX(${swipeOffset}px)` }}
      >
        {/* Name and Recency Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h3 
              className="text-[17.5px] font-bold tracking-tight truncate"
              style={{ fontFamily: 'var(--font-header)', color: 'var(--gold)' }}
            >
              {contact.name}
            </h3>
            <span 
              className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            >
              {contact.category || 'General'}
            </span>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0 text-[11px] font-mono text-[var(--text-secondary)]">
            <span>{formatRelativeTime(contact.lastContactedAt)}</span>
            <i className="fa-solid fa-chevron-right text-[10px] text-[var(--text-tertiary)]" />
          </div>
        </div>

        {/* Medium & Target Info */}
        <div className="mt-2.5 flex items-center justify-between gap-2">
          {contact.lastMedium ? (
            <span className="medium-badge">
              <i className={`fa-solid ${getMediumIcon(contact.lastMedium)} text-[10px]`} />
              <span>Via {contact.lastMedium}</span>
            </span>
          ) : (
            <span className="text-[11px] text-[var(--text-tertiary)] italic">No medium logged</span>
          )}

          <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
            Target: {contact.targetFrequency}
          </span>
        </div>

        {/* Memory Note Preview */}
        {contact.notes && (
          <p className="text-[13px] text-[var(--text-secondary)] mt-2 line-clamp-2 leading-relaxed selectable">
            {contact.notes}
          </p>
        )}
      </div>
    </div>
  );
};
