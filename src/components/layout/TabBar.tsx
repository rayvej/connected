import React from 'react';
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
    <nav className="glass-tab-bar px-6 py-2 flex items-center justify-around shrink-0">
      {/* Recency Dashboard Tab */}
      <button
        onClick={() => onSelectTab('dashboard')}
        className={`flex flex-col items-center gap-1 text-[10.5px] font-mono touch-active ${
          activeTab === 'dashboard' ? 'text-[var(--gold)] font-bold' : 'text-[var(--text-tertiary)]'
        }`}
      >
        <i className={`fa-solid fa-clock-rotate-left text-base ${activeTab === 'dashboard' ? 'text-[var(--gold)]' : ''}`} />
        <span>Recency</span>
      </button>

      {/* Floating 1-Tap Quick Log Gold Button */}
      <button
        onClick={onQuickLogClick}
        className="w-11 h-11 -mt-4 rounded-full gold-glow-btn flex items-center justify-center touch-active shadow-lg"
        aria-label="Quick Log Check-In"
      >
        <i className="fa-solid fa-plus text-lg text-[#181412]" />
      </button>

      {/* History Timeline Tab */}
      <button
        onClick={() => onSelectTab('logs')}
        className={`flex flex-col items-center gap-1 text-[10.5px] font-mono touch-active ${
          activeTab === 'logs' ? 'text-[var(--gold)] font-bold' : 'text-[var(--text-tertiary)]'
        }`}
      >
        <i className={`fa-solid fa-box-archive text-base ${activeTab === 'logs' ? 'text-[var(--gold)]' : ''}`} />
        <span>Memories</span>
      </button>

      {/* Shortcuts & Settings Tab */}
      <button
        onClick={() => onSelectTab('shortcuts')}
        className={`flex flex-col items-center gap-1 text-[10.5px] font-mono touch-active ${
          activeTab === 'shortcuts' ? 'text-[var(--gold)] font-bold' : 'text-[var(--text-tertiary)]'
        }`}
      >
        <i className={`fa-solid fa-sliders text-base ${activeTab === 'shortcuts' ? 'text-[var(--gold)]' : ''}`} />
        <span>iOS Auto</span>
      </button>
    </nav>
  );
};
