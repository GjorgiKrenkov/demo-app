import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme } from '../theme/dark.theme.js';
import { lightTheme } from '../theme/light.theme.js';

type ColorMode = 'dark' | 'light';

interface ThemeContextValue {
  readonly mode: ColorMode;
  readonly toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useThemeMode = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) { throw new Error('useThemeMode must be used within AppThemeProvider'); }
  return ctx;
};

interface AppThemeProviderProps {
  readonly children: ReactNode;
  readonly defaultMode?: ColorMode;
}

export const AppThemeProvider = ({ children, defaultMode = 'dark' }: AppThemeProviderProps) => {
  const [mode, setMode] = useState<ColorMode>(defaultMode);

  const toggleMode = () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const value = useMemo<ThemeContextValue>(() => ({ mode, toggleMode }), [mode]);
  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
