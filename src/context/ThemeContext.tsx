import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'night' | 'day';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'pathsetu-theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      // 1. Check user preference stored in localStorage
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      if (savedTheme === 'night' || savedTheme === 'day') {
        return savedTheme;
      }

      // 2. On first visit, respect operating system preference when possible
      if (typeof window !== 'undefined' && window.matchMedia) {
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
          return 'day';
        }
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'night';
        }
      }
    } catch {
      // Fallback
    }

    // Otherwise default to Night Mode
    return 'night';
  });

  useEffect(() => {
    try {
      const root = document.documentElement;
      if (theme === 'night') {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'night');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'day');
      }
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.error('Failed to sync theme to localStorage', e);
    }
  }, [theme]);

  // Listen for system theme changes if user has not explicitly chosen
  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        const hasSaved = localStorage.getItem(THEME_STORAGE_KEY);
        if (!hasSaved) {
          setThemeState(e.matches ? 'night' : 'day');
        }
      };

      mediaQuery.addEventListener?.('change', handleChange);
      return () => mediaQuery.removeEventListener?.('change', handleChange);
    } catch {
      // Ignore
    }
  }, []);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'night' ? 'day' : 'night'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

