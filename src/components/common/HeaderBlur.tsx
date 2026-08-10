import React from 'react';
import { Search, Plus } from 'lucide-react';
import type { Category } from '../../db/schema';
import '../../styles/glass.css';

interface HeaderBlurProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onAddContactClick: () => void;
}

export const HeaderBlur: React.FC<HeaderBlurProps> = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onSelectCategory,
  onAddContactClick,
}) => {
  return (
    <header className="glass-header px-4 pt-3.5 pb-2.5 space-y-2.5">
      {/* Title & Brand Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src="/app-logo.jpg" alt="Logo" className="w-8 h-8 rounded-xl object-cover border border-[var(--border-strong)]" />
          <h1 className="text-[22px] font-serif font-bold text-[var(--gold)] tracking-tight">
            Connected
          </h1>
        </div>

        <button
          onClick={onAddContactClick}
          className="px-3 py-1.5 rounded-full bg-[var(--gold-muted)] text-[var(--gold)] border border-[var(--border-strong)] font-semibold text-[12px] flex items-center gap-1 touch-active"
        >
          <Plus size={14} />
          <span>Add Person</span>
        </button>
      </div>

      {/* Top Search Input (Option C) */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search people, groups, memories, notes..."
          className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[var(--bg-card-secondary)] border border-[var(--border-color)] text-[13.5px] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none focus:border-[var(--gold)] transition-all"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
        <button
          onClick={() => onSelectCategory('All')}
          className={`px-3 py-1 rounded-full text-[11.5px] font-semibold whitespace-nowrap touch-active transition-all ${
            selectedCategory === 'All'
              ? 'bg-[var(--gold)] text-black font-bold'
              : 'bg-[var(--bg-card-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]'
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
                  ? 'bg-[var(--gold)] text-black font-bold'
                  : 'bg-[var(--bg-card-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]'
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
