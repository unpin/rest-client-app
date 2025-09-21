import { render, screen } from '@testing-library/react';
import AppProviders from './AppProviders';

jest.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="next-intl-provider">{children}</div>
  ),
}));

jest.mock('./theme/ThemeProvider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

jest.mock('@/providers/AuthProvider/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}));

describe('AppProviders', () => {
  it('should render all nested providers and children', () => {
    render(
      <AppProviders>
        <div>Child Content</div>
      </AppProviders>
    );

    expect(screen.getByTestId('next-intl-provider')).toBeInTheDocument();
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();

    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('should correctly nest the providers', () => {
    render(
      <AppProviders>
        <div>Child</div>
      </AppProviders>
    );

    const intlProvider = screen.getByTestId('next-intl-provider');
    const authProvider = screen.getByTestId('auth-provider');
    const themeProvider = screen.getByTestId('theme-provider');

    expect(intlProvider).toContainElement(authProvider);
    expect(authProvider).toContainElement(themeProvider);
    expect(themeProvider).toContainElement(screen.getByText('Child'));
  });
});
