import React from 'react';
import type { Category } from '../../db/schema';
import '../../styles/glass.css';

interface HeaderBlurProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onAddContactClick: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const HeaderBlur: React.FC<HeaderBlurProps> = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onSelectCategory,
  onAddContactClick,
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <header className="glass-header px-4 pt-3.5 pb-3 space-y-3 shrink-0">
      {/* Top Title & Control Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl overflow-hidden border shrink-0" style={{ borderColor: 'var(--border-strong)' }}>
            <img 
              src="/app-logo.jpg" 
              alt="Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // SVG Fallback if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <h1 
            className="text-[20px] font-bold tracking-tight truncate"
            style={{ fontFamily: 'var(--font-header)', color: 'var(--gold)' }}
          >
            Connected
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Sun / Moon Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="w-8 h-8 rounded-full flex items-center justify-center touch-active text-[13px] border"
            style={{
              background: 'var(--bg-input)',
              borderColor: 'var(--border-strong)',
              color: 'var(--text-secondary)',
            }}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme mode"
          >
            <i className={`fa-solid ${isDarkMode ? 'fa-moon' : 'fa-sun'}`} />
          </button>

          {/* Add Person Button */}
          <button
            onClick={onAddContactClick}
            className="px-3 py-1.5 rounded-full font-semibold text-[12px] flex items-center gap-1.5 touch-active"
            style={{
              background: 'rgba(var(--gold-rgb), 0.15)',
              color: 'var(--gold)',
              border: '1px solid var(--border-strong)',
            }}
          >
            <i className="fa-solid fa-plus text-[11px]" />
            <span>Add Person</span>
          </button>
        </div>
      </div>

      {/* Top Search Input */}
      <div className="relative">
        <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[12px] text-[var(--text-tertiary)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search people, groups, notes..."
          className="w-full pl-9 pr-3.5 py-2 rounded-xl text-[13.5px] outline-none transition-all"
          style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
        <button
          onClick={() => onSelectCategory('All')}
          className={`px-3 py-1 rounded-full text-[11.5px] font-semibold whitespace-nowrap touch-active transition-all ${
            selectedCategory === 'All'
              ? 'bg-[var(--gold)] text-[#181412] font-bold'
              : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]'
          }`}
        >
          All
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className={`px-3 py-1 rounded-full text-[11.5px] font-semibold whitespace-nowrap touch-active transition-all ${
                isSelected
                  ? 'bg-[var(--gold)] text-[#181412] font-bold'
                  : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </header>
  );
};
