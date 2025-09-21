import { render, screen } from '@testing-library/react';
import { AuthProvider } from './AuthProvider';
import { useAuthState } from 'react-firebase-hooks/auth';

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: jest.fn(),
}));

jest.mock('./AuthContext', () => ({
  AuthContext: ({
    value,
    children,
  }: {
    value: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="auth-context" data-value={JSON.stringify(value)}>
      {children}
    </div>
  ),
}));

const mockUseAuthState = useAuthState as jest.Mock;

describe('AuthProvider', () => {
  it('should provide the user, loading, and error state from useAuthState', () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    const mockError = new Error('Auth error');
    mockUseAuthState.mockReturnValue([mockUser, false, mockError]);

    render(
      <AuthProvider>
        <div>App Content</div>
      </AuthProvider>
    );

    expect(screen.getByText('App Content')).toBeInTheDocument();

    const contextProvider = screen.getByTestId('auth-context');
    const contextValue = JSON.parse(
      contextProvider.getAttribute('data-value') || '{}'
    );

    expect(contextValue.user).toEqual(mockUser);
    expect(contextValue.loading).toBe(false);
    expect(contextValue.error).toEqual(JSON.parse(JSON.stringify(mockError)));
  });

  it('should correctly reflect the loading state', () => {
    mockUseAuthState.mockReturnValue([null, true, null]);

    render(<AuthProvider>Loading...</AuthProvider>);

    const contextProvider = screen.getByTestId('auth-context');
    const contextValue = JSON.parse(
      contextProvider.getAttribute('data-value') || '{}'
    );

    expect(contextValue.user).toBeNull();
    expect(contextValue.loading).toBe(true);
    expect(contextValue.error).toBeNull();
  });
});
