import { createTheme, type Theme } from '@mui/material/styles';
import { colorTokens } from './tokens.js';

const buildLightTheme = (): Theme =>
  createTheme({
    palette: {
      mode: 'light',
      primary: {
        main:  colorTokens.gold[600],
        light: colorTokens.gold[500],
        dark:  colorTokens.gold[700],
        contrastText: '#FFFFFF',
      },
      secondary: { main: '#8B7355', contrastText: '#FFFFFF' },
      error:   { main: '#C62828' },
      warning: { main: '#E65100' },
      info:    { main: '#0277BD' },
      success: { main: '#2E7D32' },
      background: { default: '#F8F5F0', paper: '#FFFFFF' },
      text: { primary: '#1A1200', secondary: '#5A4E3A' },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica Neue", sans-serif',
    },
    shape: { borderRadius: 12 },
  });

export const lightTheme = buildLightTheme();
