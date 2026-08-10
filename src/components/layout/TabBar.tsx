import React from 'react';
import { History, Plus, BookOpen, Settings } from 'lucide-react';
import '../../styles/glass.css';

export type TabType = 'dashboard' | 'logs' | 'shortcuts';

interface TabBarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onQuickLogClick: () => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onSelectTab,
  onQuickLogClick,
}) => {
  return (
    <nav className="glass-tab-bar px-8 py-2 flex items-center justify-around">
      {/* Dashboard / Touchpoints Tab */}
      <button
        onClick={() => onSelectTab('dashboard')}
        className={`flex flex-col items-center gap-1 text-[10.5px] font-mono touch-active ${
          activeTab === 'dashboard' ? 'text-[var(--gold)] font-bold' : 'text-[var(--text-tertiary)]'
        }`}
      >
        <BookOpen size={20} strokeWidth={activeTab === 'dashboard' ? 2.5 : 1.8} />
        <span>Recency</span>
      </button>

      {/* Floating 1-Tap Quick Log Gold Button */}
      <button
        onClick={onQuickLogClick}
        className="w-11 h-11 -mt-5 rounded-full gold-glow-btn flex items-center justify-center touch-active"
        aria-label="Quick Log Check-In"
      >
        <Plus size={24} strokeWidth={2.8} />
      </button>

      {/* History Timeline Tab */}
      <button
        onClick={() => onSelectTab('logs')}
        className={`flex flex-col items-center gap-1 text-[10.5px] font-mono touch-active ${
          activeTab === 'logs' ? 'text-[var(--gold)] font-bold' : 'text-[var(--text-tertiary)]'
        }`}
      >
        <History size={20} strokeWidth={activeTab === 'logs' ? 2.5 : 1.8} />
        <span>History</span>
      </button>

      {/* Shortcuts / Settings Tab */}
      <button
        onClick={() => onSelectTab('shortcuts')}
        className={`flex flex-col items-center gap-1 text-[10.5px] font-mono touch-active ${
          activeTab === 'shortcuts' ? 'text-[var(--gold)] font-bold' : 'text-[var(--text-tertiary)]'
        }`}
      >
        <Settings size={20} strokeWidth={activeTab === 'shortcuts' ? 2.5 : 1.8} />
        <span>iOS Auto</span>
      </button>
    </nav>
  );
};
