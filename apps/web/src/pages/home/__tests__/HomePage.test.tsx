import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MemoryRouter } from 'react-router-dom';

import { AppThemeProvider } from '@demo-app/ui';

import { HomePage } from '../HomePage.js';

// ── Helpers ────────────────────────────────────────────────────────────────
const renderWithProviders = (ui: React.ReactElement): ReturnType<typeof render> =>
  render(
    <AppThemeProvider defaultMode="dark">
      <MemoryRouter>{ui}</MemoryRouter>
    </AppThemeProvider>,
  );

// ── Tests ──────────────────────────────────────────────────────────────────
describe('HomePage', () => {
  it('renders the welcome heading', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders demo-app brand name', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/demo-app/i)).toBeInTheDocument();
  });
});
