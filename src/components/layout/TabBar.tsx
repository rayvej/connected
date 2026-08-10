import React from 'react';
import { Users, History, Plus, Sparkles, Settings } from 'lucide-react';
import '../../styles/glass.css';

export type TabType = 'dashboard' | 'logs' | 'contacts' | 'shortcuts' | 'settings';

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
  const navItems = [
    { id: 'dashboard' as TabType, label: 'Health', icon: Sparkles },
    { id: 'logs' as TabType, label: 'History', icon: History },
    { id: 'contacts' as TabType, label: 'Contacts', icon: Users },
    { id: 'shortcuts' as TabType, label: 'Shortcuts', icon: Settings },
  ];

  return (
    <nav className="glass-tab-bar px-4 py-2 flex items-center justify-around">
      {navItems.slice(0, 2).map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium touch-active ${
              isActive ? 'text-[var(--ios-blue)] font-semibold' : 'text-[var(--ios-label-secondary)]'
            }`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
            <span>{item.label}</span>
          </button>
        );
      })}

      {/* Center 1-Tap Floating Quick Log Button */}
      <button
        onClick={onQuickLogClick}
        className="w-12 h-12 -mt-4 rounded-full bg-[var(--ios-blue)] text-white flex items-center justify-center shadow-lg touch-active"
        aria-label="Quick Log Interaction"
      >
        <Plus size={26} strokeWidth={2.8} />
      </button>

      {navItems.slice(2).map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium touch-active ${
              isActive ? 'text-[var(--ios-blue)] font-semibold' : 'text-[var(--ios-label-secondary)]'
            }`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
