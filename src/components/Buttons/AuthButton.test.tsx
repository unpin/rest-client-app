import { render, screen } from '@testing-library/react';
import AuthButton from './AuthButton';

jest.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => {
    if (namespace === 'Auth') {
      if (key === 'common.logout') {
        return 'common.logout';
      }
      if (key === 'common.main') {
        return 'common.main';
      }
      return `Auth.${key}`;
    }
    return key;
  },
}));

describe('AuthButton', () => {
  it('should render a "Sign In" button for the "signIn" form', () => {
    render(<AuthButton form="signIn" />);
    const button = screen.getByRole('button', { name: 'Auth.login.submit' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should render a "Sign Up" button for the "signUp" form', () => {
    render(<AuthButton form="signUp" />);
    const button = screen.getByRole('button', { name: 'Auth.register.submit' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should render a "Log Out" button for the "signOut" form', () => {
    render(<AuthButton form="signOut" />);
    const button = screen.getByRole('button', { name: 'common.logout' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
  });

  it('should render a "Main Page" button for the "main" form', () => {
    render(<AuthButton form="main" />);
    const button = screen.getByRole('button', { name: 'common.main' });
    expect(button).toBeInTheDocument();
  });

  it('should call onClick when the button is clicked', () => {
    const mockOnClick = jest.fn();
    render(<AuthButton form="signOut" onClick={mockOnClick} />);
    const button = screen.getByRole('button');
    button.click();
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
