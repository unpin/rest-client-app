import { render, screen } from '@testing-library/react';
import MainPage from './MainPage';

jest.mock('@/components/MainPage/AuthBlock', () => {
  const AuthBlock = () => <div>Mocked AuthBlock</div>;
  AuthBlock.displayName = 'AuthBlock';
  return AuthBlock;
});

describe('MainPage', () => {
  it('should render the AuthBlock component', () => {
    render(<MainPage />);
    expect(screen.getByText('Mocked AuthBlock')).toBeInTheDocument();
  });
});
