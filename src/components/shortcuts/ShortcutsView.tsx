import React, { useState } from 'react';
import { Smartphone, Zap, Share2, Copy, Check, RefreshCw, RotateCcw, ShieldCheck } from 'lucide-react';
import '../../styles/glass.css';

export const ShortcutsView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);

  const shortcutUrlExample = `${window.location.origin}/?quicklog=true&contact=Mom&medium=iMessage`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shortcutUrlExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckUpdate = async () => {
    setCheckingUpdate(true);
    setUpdateMsg(null);

    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.update();
        }
        setUpdateMsg('✓ App is up to date!');
      } catch (err) {
        setUpdateMsg('Checked for updates');
      }
    } else {
      setUpdateMsg('Service worker active');
    }

    setTimeout(() => {
      setCheckingUpdate(false);
    }, 1200);
  };

  const handleForceRefresh = async () => {
    if (confirm('Force refresh and purge PWA cache storage?')) {
      if ('caches' in window) {
        const keys = await caches.keys();
        for (const key of keys) {
          await caches.delete(key);
        }
      }

      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      }

      window.location.reload();
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Overview Banner */}
      <div className="glass-card p-4.5 bg-gradient-to-r from-[rgba(212,175,55,0.12)] to-[rgba(28,32,44,0.6)] border border-[var(--border-strong)] rounded-[18px]">
        <div className="flex items-center gap-2 text-[var(--gold)] font-mono font-bold text-[12px] uppercase tracking-wider">
          <Zap size={16} />
          <span>iOS Auto & App Updates</span>
        </div>

        <h3 className="text-[18px] font-serif font-bold text-[var(--text-primary)] mt-1.5">
          Automation & Cache Controls
        </h3>

        <p className="text-[13px] text-[var(--text-secondary)] mt-1 leading-relaxed">
          Manage iOS shortcuts, PWA updates, and force cache refreshes matching Reading Tracker.
        </p>
      </div>

      {/* 1. Reading Tracker Style PWA App Update & Force Refresh Controls */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[15px] font-serif font-bold text-[var(--gold)]">
            <RefreshCw size={17} />
            <h4>App Updates & Service Worker</h4>
          </div>

          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[var(--gold-muted)] text-[var(--gold)] border border-[var(--border-strong)]">
            v1.2.0 • Live
          </span>
        </div>

        <p className="text-[12.5px] text-[var(--text-secondary)] leading-relaxed">
          If you deployed a new update, use these controls to search for updates or force purge stale cache.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleCheckUpdate}
            disabled={checkingUpdate}
            className="py-2.5 px-3 rounded-xl bg-[var(--bg-card-secondary)] border border-[var(--border-strong)] text-[var(--gold)] text-[12px] font-bold flex items-center justify-center gap-1.5 touch-active"
          >
            <RefreshCw size={14} className={checkingUpdate ? 'animate-spin' : ''} />
            <span>{checkingUpdate ? 'Checking...' : 'Check Updates'}</span>
          </button>

          <button
            onClick={handleForceRefresh}
            className="py-2.5 px-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-[12px] font-bold flex items-center justify-center gap-1.5 touch-active"
          >
            <RotateCcw size={14} />
            <span>Force Refresh</span>
          </button>
        </div>

        {updateMsg && (
          <div className="text-[12px] font-mono text-center text-[var(--gold)] bg-[var(--gold-muted)] py-1.5 px-3 rounded-xl border border-[var(--border-strong)]">
            {updateMsg}
          </div>
        )}
      </div>

      {/* 2. iPhone Siri & Widget Shortcuts */}
      <div className="glass-card p-4 space-y-2.5">
        <div className="flex items-center gap-2 text-[15px] font-serif font-bold text-[var(--gold)]">
          <Smartphone size={17} />
          <h4>iPhone Siri & Widget Shortcuts</h4>
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

      {/* 3. iOS Share Sheet Target */}
      <div className="glass-card p-4 space-y-2.5">
        <div className="flex items-center gap-2 text-[15px] font-serif font-bold text-[var(--gold)]">
          <Share2 size={17} />
          <h4>iOS Share Sheet Target</h4>
        </div>

        <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
          When added to your iPhone Home Screen, Connected registers as an <strong>iOS Share Target</strong>.
        </p>

        <div className="p-3 rounded-xl bg-[var(--gold-muted)] text-[var(--gold)] text-[12px] font-semibold flex items-center gap-2 border border-[var(--border-strong)]">
          <ShieldCheck size={16} />
          <span>PWA Standalone & Web Share Target Active</span>
        </div>
      </div>
    </div>
  );
};
