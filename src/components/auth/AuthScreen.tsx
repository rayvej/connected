import React from 'react';
import '../../styles/glass.css';

interface AuthScreenProps {
  onSignIn: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSignIn }) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center overflow-hidden"
      style={{
        background: 'var(--bg-solid)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)'
      }}
    >
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden opacity-60">
        <div className="absolute -top-24 -left-24 w-[280px] h-[280px] rounded-full bg-amber-500/12 blur-[120px] animate-float-1" />
        <div className="absolute top-[40%] right-6 w-[240px] h-[240px] rounded-full bg-rose-600/10 blur-[120px] animate-float-2" />
        <div className="absolute -bottom-24 left-[5%] w-[260px] h-[260px] rounded-full bg-amber-500/8 blur-[120px] animate-float-1" />
      </div>

      <div className="w-full max-w-xs flex flex-col items-center gap-7">
        {/* Logo Container with Radial Gold Glow */}
        <div className="relative group">
          <div 
            className="absolute -inset-4 rounded-[32px] opacity-40 blur-2xl transition-opacity duration-1000 group-hover:opacity-75"
            style={{ background: 'radial-gradient(circle, rgba(var(--gold-rgb), 0.5) 0%, rgba(224, 169, 109, 0.3) 100%)' }}
          />
          <img 
            src="/app-logo.jpg" 
            alt="Connected Sunset Logo" 
            className="relative w-28 h-28 rounded-[26px] object-cover shadow-2xl border"
            style={{ borderColor: 'var(--border-strong)' }}
          />
        </div>

        {/* Title & Tagline */}
        <div className="flex flex-col gap-2">
          <h1 
            className="text-3xl font-serif font-bold tracking-tight"
            style={{ color: 'var(--gold)' }}
          >
            Connected
          </h1>
          <p className="text-[14px] font-medium text-[var(--text-secondary)]">
            Your intimate touchpoints & memory log
          </p>
        </div>

        {/* Google Sign-In Button */}
        <button
          onClick={onSignIn}
          className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-2xl font-semibold text-sm border transition-all active:scale-[0.98] shadow-lg touch-active mt-2"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border-strong)',
            color: 'var(--text-primary)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Sign in with Google</span>
        </button>

        <p className="text-[11px] text-[var(--text-tertiary)] font-mono">
          Private • Offline First • Encrypted
        </p>
      </div>
    </div>
  );
};
