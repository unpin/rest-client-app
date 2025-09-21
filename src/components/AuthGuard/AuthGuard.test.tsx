import { render, screen } from '@testing-library/react';
import AuthGuard from './AuthGuard';
import { useAuth } from '@/providers/AuthProvider/AuthContext';
import { useRouter } from '@/i18n/navigation';

jest.mock('@/providers/AuthProvider/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/i18n/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('AuthGuard', () => {
  const mockUseAuth = useAuth as jest.Mock;
  const mockUseRouter = useRouter as jest.Mock;
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      replace: mockReplace,
    });
  });

  it('should render a loading message when authentication is in progress', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should redirect to the sign-in page if the user is not authenticated', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(mockReplace).toHaveBeenCalledWith('/auth/signin');
  });

  it('should render the children if the user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { email: 'test@example.com' },
      loading: false,
    });

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('should return null and not render children while redirecting', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });

    const { container } = render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(container.firstChild).toBeNull();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
