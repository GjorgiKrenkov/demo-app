import { createContext } from 'react';

export type ColorMode = 'dark' | 'light';

export interface ThemeContextValue {
  readonly mode: ColorMode;
  readonly toggleMode: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
