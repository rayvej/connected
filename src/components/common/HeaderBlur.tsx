import React from 'react';
import '../../styles/glass.css';

interface HeaderBlurProps {
  title: string;
  subtitle?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export const HeaderBlur: React.FC<HeaderBlurProps> = ({
  title,
  subtitle,
  leftAction,
  rightAction,
}) => {
  return (
    <header className="glass-header px-4 py-3 flex items-center justify-between min-h-[54px]">
      <div className="flex items-center gap-2">
        {leftAction}
        <div>
          <h1 className="text-[17px] font-semibold tracking-tight text-[var(--ios-label-primary)]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[12px] font-normal text-[var(--ios-label-secondary)]">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {rightAction && (
        <div className="flex items-center gap-2">
          {rightAction}
        </div>
      )}
    </header>
  );
};
