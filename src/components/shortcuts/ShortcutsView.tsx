import React, { useState } from 'react';
import { Smartphone, Zap, Share2, Copy, Check } from 'lucide-react';
import '../../styles/glass.css';

export const ShortcutsView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const shortcutUrlExample = `${window.location.origin}/?quicklog=true&contact=Mom&platform=iMessage`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shortcutUrlExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Overview Banner */}
      <div className="glass-card p-4 bg-gradient-to-r from-[rgba(0,122,255,0.12)] to-[rgba(175,82,222,0.12)] border border-[rgba(0,122,255,0.25)] rounded-[18px]">
        <div className="flex items-center gap-2 text-[var(--ios-blue)] font-bold text-[13px] uppercase tracking-wider">
          <Zap size={18} />
          <span>iOS Automation & Auto-Logging</span>
        </div>

        <h3 className="text-[17px] font-bold text-[var(--ios-label-primary)] mt-1.5">
          Zero-Friction iOS Integration
        </h3>

        <p className="text-[13px] text-[var(--ios-label-secondary)] mt-1 leading-relaxed">
          Log interactions directly from your iPhone Home Screen widgets, Siri, or the native iOS Share Sheet without manually navigating the app.
        </p>
      </div>

      {/* 1. iOS Shortcuts Deep Links */}
      <div className="glass-card p-4 rounded-[18px] space-y-2.5">
        <div className="flex items-center gap-2 text-[15px] font-bold text-[var(--ios-label-primary)]">
          <Smartphone size={18} className="text-[var(--ios-blue)]" />
          <h4>1. iPhone Siri & Widget Shortcuts</h4>
        </div>

        <p className="text-[13px] text-[var(--ios-label-secondary)] leading-relaxed">
          Create an iOS Shortcut in Apple's <strong>Shortcuts app</strong> using the "Open URL" action. Add your shortcut to your iPhone Home Screen for 1-tap logging.
        </p>

        <div className="bg-[var(--ios-card-secondary)] p-3 rounded-xl border border-[var(--ios-card-border)] flex items-center justify-between text-[12px] font-mono text-[var(--ios-label-primary)] break-all">
          <span>{shortcutUrlExample}</span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-[var(--ios-card-bg)] text-[var(--ios-blue)] touch-active flex-shrink-0 ml-2"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* 2. Web Share Target */}
      <div className="glass-card p-4 rounded-[18px] space-y-2.5">
        <div className="flex items-center gap-2 text-[15px] font-bold text-[var(--ios-label-primary)]">
          <Share2 size={18} className="text-[var(--ios-green)]" />
          <h4>2. iOS Share Sheet Integration</h4>
        </div>

        <p className="text-[13px] text-[var(--ios-label-secondary)] leading-relaxed">
          When added to your iPhone Home Screen as a PWA, Connected registers as an <strong>iOS Share Target</strong>. Share text snippets or contact cards from WhatsApp, iMessage, or Safari directly to Connected.
        </p>

        <div className="p-3 rounded-xl bg-[var(--ios-green-muted)] text-[var(--ios-green)] text-[12px] font-semibold flex items-center gap-2">
          <span>PWA Standalone & Web Share Target Active</span>
        </div>
      </div>
    </div>
  );
};
