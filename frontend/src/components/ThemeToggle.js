import React, { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

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
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-lime/60 text-lime hover:bg-lime hover:text-navy transition ${className}`}
    >
      {isDark
        ? <MoonIcon className="h-5 w-5" />
        : <SunIcon className="h-5 w-5" />}
    </button>
  );
}
