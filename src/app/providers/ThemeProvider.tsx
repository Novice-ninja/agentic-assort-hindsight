import { createContext, useContext, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { applyTheme, DEFAULT_THEME, themes } from '@design-system';
import type { ThemeName } from '@design-system';
import { useLocalStorage } from '@shared/hooks';
import { STORAGE_KEYS } from '@shared/constants';

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<ThemeName>(STORAGE_KEYS.theme, DEFAULT_THEME);

  useEffect(() => {
    applyTheme(themes[theme]);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    [theme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
