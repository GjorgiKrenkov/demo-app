import type { JSX, ReactNode } from 'react';
import { useMemo, useState } from 'react';

import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';

import { darkTheme } from '../theme/dark.theme.js';
import { lightTheme } from '../theme/light.theme.js';
import { type ColorMode, ThemeContext } from './theme-context.js';

interface AppThemeProviderProps {
  readonly children: ReactNode;
  readonly defaultMode?: ColorMode;
}

export const AppThemeProvider = ({
  children,
  defaultMode = 'dark',
}: AppThemeProviderProps): JSX.Element => {
  const [mode, setMode] = useState<ColorMode>(defaultMode);

  const toggleMode = (): void => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const value = useMemo(() => ({ mode, toggleMode }), [mode]);
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
