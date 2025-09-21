import { render, screen, fireEvent } from '@testing-library/react';
import LocaleSwitcher from './LocaleSwitcher';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTransition } from 'react';

jest.mock('@/i18n/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useTransition: jest.fn(),
}));

const mockUseRouter = useRouter as jest.Mock;
const mockUsePathname = usePathname as jest.Mock;
const mockUseTransition = useTransition as jest.Mock;
const mockReplace = jest.fn();
const mockStartTransition = jest.fn((callback) => callback());

describe('LocaleSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ replace: mockReplace });
    mockUsePathname.mockReturnValue('/current-path');
    mockUseTransition.mockReturnValue([false, mockStartTransition]);
  });

  it('should render the select with children and default value', () => {
    render(
      <LocaleSwitcher defaultValue="en">
        <option value="en">English</option>
        <option value="ru">Русский</option>
      </LocaleSwitcher>
    );

    const selectElement = screen.getByRole('combobox') as HTMLSelectElement;
    expect(selectElement).toBeInTheDocument();
    expect(selectElement.value).toBe('en');
    expect(screen.getByRole('option', { name: 'English' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Русский' })).toBeInTheDocument();
  });

  it('should call router.replace with the new locale on change', () => {
    render(
      <LocaleSwitcher defaultValue="en">
        <option value="en">English</option>
        <option value="ru">Русский</option>
      </LocaleSwitcher>
    );

    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'ru' } });

    expect(mockStartTransition).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith(
      { pathname: '/current-path' },
      { locale: 'ru' }
    );
  });

  it('should be disabled and have reduced opacity when a transition is pending', () => {
    mockUseTransition.mockReturnValue([true, mockStartTransition]);
    render(
      <LocaleSwitcher defaultValue="en">
        <option value="en">English</option>
      </LocaleSwitcher>
    );

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeDisabled();
    expect(selectElement).toHaveClass('opacity-60');
  });
});
