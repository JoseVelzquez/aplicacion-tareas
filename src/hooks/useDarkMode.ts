import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'task-manager-pro-theme';

type ThemePreference = 'dark' | 'light';

function getSystemDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function readInitial(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY) as ThemePreference | null;
  if (stored === 'dark') return true;
  if (stored === 'light') return false;
  return getSystemDark();
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => readInitial());

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return { isDark, toggle };
}
