import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import '../../styles/glass.css';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}) => {
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setRendered(false), 250);
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!rendered) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Dark Translucent Backdrop Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Sheet Content */}
      <div 
        className={`glass-sheet relative z-10 w-full max-h-[88vh] overflow-y-auto px-5 pt-3 pb-8 transition-transform duration-300 ease-out transform ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* iOS Drag Handle */}
        <div className="w-full flex justify-center py-2">
          <div className="w-10 h-1.2 rounded-full bg-[var(--ios-label-tertiary)] opacity-60" />
        </div>

        {/* Sheet Header */}
        <div className="flex items-center justify-between mt-1 mb-4 pb-2 border-b border-[var(--ios-card-border)]">
          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-[var(--ios-label-primary)]">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[13px] font-medium text-[var(--ios-label-secondary)] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--ios-card-secondary)] flex items-center justify-center text-[var(--ios-label-secondary)] touch-active"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className="mt-2">
          {children}
        </div>
      </div>
    </div>
  );
};
