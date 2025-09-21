import { render, screen } from '@testing-library/react';
import AuthBlock from './AuthBlock';
import { useAuth } from '@/providers/AuthProvider/AuthContext';
import { useTranslations } from 'next-intl';

jest.mock('@/providers/AuthProvider/AuthContext', () => ({
  useAuth: jest.fn(),
}));
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

const mockUseAuth = useAuth as jest.Mock;
const mockUseTranslations = useTranslations as jest.Mock;

describe('AuthBlock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTranslations.mockReturnValue((key: string) => key);
  });

  it('should show a loading message when auth state is loading', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });
    render(<AuthBlock />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  describe('When user is not authenticated', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ user: null, loading: false });
      render(<AuthBlock />);
    });

    it('should display the main title and subtitle', () => {
      expect(screen.getByText('MainPage.title')).toBeInTheDocument();
      expect(screen.getByText('MainPage.subtitle')).toBeInTheDocument();
    });

    it('should display Sign In and Sign Up links', () => {
      const signInLink = screen.getByRole('link', {
        name: 'Auth.login.submit',
      });
      expect(signInLink).toBeInTheDocument();
      expect(signInLink).toHaveAttribute('href', '/auth/signin');

      const signUpLink = screen.getByRole('link', {
        name: 'Auth.register.submit',
      });
      expect(signUpLink).toBeInTheDocument();
      expect(signUpLink).toHaveAttribute('href', '/auth/signup');
    });

    it('should not display links to client, history, or variables', () => {
      expect(
        screen.queryByRole('link', { name: 'Client' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: 'History' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: 'Variables' })
      ).not.toBeInTheDocument();
    });
  });

  describe('When user is authenticated', () => {
    const mockUser = { email: 'user@example.com' };
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ user: mockUser, loading: false });
      render(<AuthBlock />);
    });

    it('should display a personalized welcome message', () => {
      expect(
        screen.getByText(`MainPage.titleLogin ${mockUser.email}`)
      ).toBeInTheDocument();
    });

    it('should display links to client, history, and variables', () => {
      const clientLink = screen.getByRole('link', { name: 'Client' });
      expect(clientLink).toBeInTheDocument();
      expect(clientLink).toHaveAttribute('href', '/client');

      const historyLink = screen.getByRole('link', { name: 'History' });
      expect(historyLink).toBeInTheDocument();
      expect(historyLink).toHaveAttribute('href', '/history');

      const variablesLink = screen.getByRole('link', { name: 'Variables' });
      expect(variablesLink).toBeInTheDocument();
      expect(variablesLink).toHaveAttribute('href', '/variables');
    });

    it('should not display Sign In or Sign Up links', () => {
      expect(
        screen.queryByRole('link', { name: 'Auth.login.submit' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: 'Auth.register.submit' })
      ).not.toBeInTheDocument();
    });
  });
});
