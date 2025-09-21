import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthForm from './AuthForm';
import * as firebase from '@/firebase';
import { useAuth } from '@/providers/AuthProvider/AuthContext';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FirebaseError } from 'firebase/app';

jest.mock('@/firebase', () => ({
  logInWithEmailAndPassword: jest.fn(),
  registerWithEmailAndPassword: jest.fn(),
}));

jest.mock('@/providers/AuthProvider/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

const mockLogIn = firebase.logInWithEmailAndPassword as jest.Mock;
const mockRegister = firebase.registerWithEmailAndPassword as jest.Mock;
const mockUseAuth = useAuth as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockUseTranslations = useTranslations as jest.Mock;
const mockPush = jest.fn();

describe('AuthForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUseAuth.mockReturnValue({ user: null, loading: false, error: null });
    mockUseTranslations.mockImplementation(
      (namespace: string) => (key: string) => {
        if (namespace === 'Auth') {
          return `Auth.${key}`;
        }
        if (namespace === 'errors') {
          return `errors.${key}`;
        }
        return key;
      }
    );
  });

  describe('Sign In Form', () => {
    it('should render the sign-in form correctly', () => {
      render(<AuthForm form="signIn" />);
      expect(
        screen.getByRole('heading', { name: 'Auth.login.subtitle' })
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText('Auth.login.emailLabel')
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText('Auth.login.passwordLabel')
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Auth.login.submit' })
      ).toBeInTheDocument();
    });

    it('should call logInWithEmailAndPassword on submit', async () => {
      render(<AuthForm form="signIn" />);
      fireEvent.change(screen.getByLabelText('Auth.login.emailLabel'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Auth.login.passwordLabel'), {
        target: { value: 'password123' },
      });
      fireEvent.click(
        screen.getByRole('button', { name: 'Auth.login.submit' })
      );

      await waitFor(() => {
        expect(mockLogIn).toHaveBeenCalledWith(
          'test@example.com',
          'password123'
        );
      });
    });

    it('should display a Firebase error message on login failure', async () => {
      mockLogIn.mockRejectedValue(
        new FirebaseError('auth/invalid-credential', 'Invalid credential')
      );
      render(<AuthForm form="signIn" />);
      fireEvent.change(screen.getByLabelText('Auth.login.emailLabel'), {
        target: { value: 'wrong@test.com' },
      });
      fireEvent.change(screen.getByLabelText('Auth.login.passwordLabel'), {
        target: { value: 'wrong' },
      });
      fireEvent.click(
        screen.getByRole('button', { name: 'Auth.login.submit' })
      );

      await waitFor(() => {
        expect(
          screen.getByText('Auth.errors.invalid-credential')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Sign Up Form', () => {
    it('should render the sign-up form correctly', () => {
      render(<AuthForm form="signUp" />);
      expect(
        screen.getByRole('heading', { name: 'Auth.register.subtitle' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Auth.register.submit' })
      ).toBeInTheDocument();
    });

    it('should call registerWithEmailAndPassword on submit', async () => {
      render(<AuthForm form="signUp" />);
      fireEvent.change(screen.getByLabelText('Auth.login.emailLabel'), {
        target: { value: 'new@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Auth.login.passwordLabel'), {
        target: { value: 'Password123!' },
      });
      fireEvent.click(
        screen.getByRole('button', { name: 'Auth.register.submit' })
      );

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith(
          'new@example.com',
          'Password123!'
        );
      });
    });
  });

  it('should show a loading indicator when auth is loading', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true, error: null });
    render(<AuthForm form="signIn" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should redirect to home page if user is already logged in', () => {
    mockUseAuth.mockReturnValue({
      user: { email: 'test@example.com' },
      loading: false,
      error: null,
    });
    render(<AuthForm form="signIn" />);
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
