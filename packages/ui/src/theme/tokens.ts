/**
 * Design tokens derived from Figma Make gold dark theme.
 * ALL color/spacing decisions live here — do not hard-code colors elsewhere.
 */
export const colorTokens = {
  gold: {
    50:  '#FFF8E7',
    100: '#FEEFC3',
    200: '#FDE68A',
    300: '#F6D25A',
    400: '#E8C547',
    500: '#C9A84C',  // primary.main
    600: '#A67C2A',  // primary.dark
    700: '#7D5A1E',
    800: '#4D3710',
    900: '#2A1E08',
  },
  dark: {
    background: '#0A0A0A',
    paper:      '#111111',
    surface:    '#1A1600',
    border:     '#2C2200',
    hover:      'rgba(201,168,76,0.08)',
  },
  text: {
    primary:   '#F5E6C8',
    secondary:  '#B8A082',
    disabled:   '#5A4E3A',
    inverse:    '#0A0A0A',
  },
  semantic: {
    error:   '#CF6679',
    warning: '#D4A04A',
    info:    '#5A9FD4',
    success: '#4CAF82',
  },
} as const;

export const buttonSizeTokens = {
  small:   { fontSize: '0.75rem',  padding: '4px 10px',  height: '30px' },
  medium:  { fontSize: '0.875rem', padding: '6px 16px',  height: '36px' },
  large:   { fontSize: '1rem',     padding: '8px 22px',  height: '42px' },
  xlarge:  { fontSize: '1.125rem', padding: '10px 28px', height: '50px' },
  xxlarge: { fontSize: '1.25rem',  padding: '14px 36px', height: '60px' },
} as const;
