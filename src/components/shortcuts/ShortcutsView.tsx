import React, { useState } from 'react';
import { Smartphone, Zap, Share2, Copy, Check } from 'lucide-react';
import '../../styles/glass.css';

export const ShortcutsView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const shortcutUrlExample = `${window.location.origin}/?quicklog=true&contact=Mom&medium=iMessage`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shortcutUrlExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Banner */}
      <div className="glass-card p-4.5 bg-gradient-to-r from-[rgba(212,175,55,0.12)] to-[rgba(28,32,44,0.6)] border border-[var(--border-strong)] rounded-[18px]">
        <div className="flex items-center gap-2 text-[var(--gold)] font-mono font-bold text-[12px] uppercase tracking-wider">
          <Zap size={16} />
          <span>iOS Auto-Logging</span>
        </div>

        <h3 className="text-[18px] font-serif font-bold text-[var(--text-primary)] mt-1.5">
          Zero-Friction iOS Shortcuts
        </h3>

        <p className="text-[13px] text-[var(--text-secondary)] mt-1 leading-relaxed">
          Log touchpoints directly from your iPhone Home Screen widgets, Siri, or the native iOS Share Sheet.
        </p>
      </div>

      {/* 1. iOS Shortcuts Deep Links */}
      <div className="glass-card p-4 space-y-2.5">
        <div className="flex items-center gap-2 text-[15px] font-serif font-bold text-[var(--gold)]">
          <Smartphone size={17} />
          <h4>1. iPhone Siri & Widget Shortcuts</h4>
        </div>

        <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
          Create an iOS Shortcut in Apple's <strong>Shortcuts app</strong> using the "Open URL" action.
        </p>

        <div className="bg-[var(--bg-card-secondary)] p-3 rounded-xl border border-[var(--border-color)] flex items-center justify-between text-[11.5px] font-mono text-[var(--text-primary)] break-all">
          <span>{shortcutUrlExample}</span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-[var(--bg-card)] text-[var(--gold)] touch-active flex-shrink-0 ml-2 border border-[var(--border-strong)]"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
        </div>
      </div>

      {/* 2. Web Share Target */}
      <div className="glass-card p-4 space-y-2.5">
        <div className="flex items-center gap-2 text-[15px] font-serif font-bold text-[var(--gold)]">
          <Share2 size={17} />
          <h4>2. iOS Share Sheet Target</h4>
        </div>

        <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
          When added to your iPhone Home Screen, Connected registers as an <strong>iOS Share Target</strong> to receive shared text or contact info directly.
        </p>

        <div className="p-3 rounded-xl bg-[var(--gold-muted)] text-[var(--gold)] text-[12px] font-semibold flex items-center gap-2 border border-[var(--border-strong)]">
          <span>PWA Standalone & Web Share Target Active</span>
        </div>
      </div>
    </div>
  );
};
