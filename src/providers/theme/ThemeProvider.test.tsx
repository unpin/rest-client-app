import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider';
import { ThemeContext } from './ThemeContext';
import { useContext } from 'react';

const TestConsumer = () => {
  const context = useContext(ThemeContext);
  if (!context) return null;
  const { theme, toggleTheme } = context;
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.setAttribute('data-theme', 'dark');
  });

  it('should default to the "dark" theme', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('should load the theme from localStorage if available', () => {
    window.localStorage.setItem('theme', 'light');
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should toggle the theme from dark to light', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });

    act(() => {
      fireEvent.click(toggleButton);
    });

    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(window.localStorage.getItem('theme')).toBe('light');
  });

  it('should toggle the theme from light to dark', () => {
    window.localStorage.setItem('theme', 'light');
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });

    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');

    act(() => {
      fireEvent.click(toggleButton);
    });

    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(window.localStorage.getItem('theme')).toBe('dark');
  });
});
