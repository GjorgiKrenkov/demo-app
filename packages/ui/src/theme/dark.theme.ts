import { createTheme, type Theme } from '@mui/material/styles';
import { colorTokens, buttonSizeTokens } from './tokens.js';

// Extend MUI theme to support xlarge/xxlarge button sizes
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    containedGold: true;
  }
  interface ButtonPropsSizeOverrides {
    xlarge: true;
    xxlarge: true;
  }
}

const buildDarkTheme = (): Theme =>
  createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main:  colorTokens.gold[500],
        light: colorTokens.gold[400],
        dark:  colorTokens.gold[600],
        contrastText: colorTokens.text.inverse,
      },
      secondary: {
        main: '#8B7355',
        light: '#A89070',
        dark:  '#6B5840',
        contrastText: colorTokens.text.inverse,
      },
      error:   { main: colorTokens.semantic.error },
      warning: { main: colorTokens.semantic.warning },
      info:    { main: colorTokens.semantic.info },
      success: { main: colorTokens.semantic.success },
      background: {
        default: colorTokens.dark.background,
        paper:   colorTokens.dark.paper,
      },
      text: {
        primary:   colorTokens.text.primary,
        secondary:  colorTokens.text.secondary,
        disabled:   colorTokens.text.disabled,
      },
      divider: colorTokens.dark.border,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica Neue", sans-serif',
      h1: { fontWeight: 800, color: colorTokens.text.primary },
      h2: { fontWeight: 800, color: colorTokens.text.primary },
      h3: { fontWeight: 600, color: colorTokens.text.primary },
      h4: { fontWeight: 600, color: colorTokens.text.primary },
      h5: { fontWeight: 500, color: colorTokens.text.primary },
      h6: { fontWeight: 500, color: colorTokens.text.primary },
      body1: { color: colorTokens.text.primary },
      body2: { color: colorTokens.text.secondary },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: ({ ownerState }) => ({
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
            ...(ownerState.size === 'xlarge' && {
              fontSize: buttonSizeTokens.xlarge.fontSize,
              padding: buttonSizeTokens.xlarge.padding,
              height: buttonSizeTokens.xlarge.height,
            }),
            ...(ownerState.size === 'xxlarge' && {
              fontSize: buttonSizeTokens.xxlarge.fontSize,
              padding: buttonSizeTokens.xxlarge.padding,
              height: buttonSizeTokens.xxlarge.height,
            }),
          }),
          containedPrimary: {
            background: colorTokens.gold[500],
            color: colorTokens.text.inverse,
            '&:hover': { background: colorTokens.gold[400], boxShadow: '0 4px 16px rgba(201,168,76,0.4)' },
          },
          outlinedPrimary: {
            borderWidth: 2,
            borderColor: colorTokens.gold[500],
            color: colorTokens.gold[500],
            '&:hover': { background: colorTokens.dark.hover, borderWidth: 2 },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: colorTokens.dark.surface,
            border: `1px solid ${colorTokens.dark.border}`,
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            transition: 'border-color 0.2s ease',
            '&:hover': { borderColor: 'rgba(201,168,76,0.5)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: 'rgba(10,10,10,0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: `1px solid rgba(201,168,76,0.2)`,
            boxShadow: 'none',
          },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              background: colorTokens.dark.paper,
              '& fieldset': { borderColor: colorTokens.dark.border },
              '&:hover fieldset': { borderColor: colorTokens.gold[600] },
              '&.Mui-focused fieldset': { borderColor: colorTokens.gold[500] },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          outlined: {
            borderColor: colorTokens.gold[500],
            color: colorTokens.gold[500],
          },
        },
      },
    },
  });

export const darkTheme = buildDarkTheme();
