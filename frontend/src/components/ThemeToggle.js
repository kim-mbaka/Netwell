import React, { useEffect, useState } from 'react';

function getInitialTheme() {
  if (typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark')) {
    return 'dark';
  }
  return 'light';
}

export default function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const isDark = theme === 'dark';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      /* ignore storage errors (private mode, etc.) */
    }
  }, [theme, isDark]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full border transition-colors
        ${isDark
          ? 'bg-white/10 border-lime/60'
          : 'bg-navy/5 border-navy/25'} ${className}`}
    >
      {/* Icons sit behind the knob */}
      <span
        className={`pointer-events-none absolute left-1.5 text-[11px] leading-none transition-opacity ${
          isDark ? 'opacity-100' : 'opacity-0'
        }`}
      >
        🌙
      </span>
      <span
        className={`pointer-events-none absolute right-1.5 text-[11px] leading-none transition-opacity ${
          isDark ? 'opacity-0' : 'opacity-100'
        }`}
      >
        ☀️
      </span>
      {/* Sliding knob */}
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-lime shadow-md transition-transform duration-300 ${
          isDark ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
