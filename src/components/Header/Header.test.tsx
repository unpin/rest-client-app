import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('renders the header text', () => {
    render(<Header />);
    const headerElement = screen.getByText(/Header/i);
    expect(headerElement).toBeInTheDocument();
  });
});
