import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('should render the developers section with correct links', () => {
    render(<Footer />);

    const germanLink = screen.getByRole('link', { name: /german/i });
    expect(germanLink).toBeInTheDocument();
    expect(germanLink).toHaveAttribute('href', 'https://github.com/unpin');

    const matsveiLink = screen.getByRole('link', { name: /matsvei/i });
    expect(matsveiLink).toBeInTheDocument();
    expect(matsveiLink).toHaveAttribute(
      'href',
      'https://github.com/geniusx1990'
    );

    const stanislavLink = screen.getByRole('link', { name: /stanislav/i });
    expect(stanislavLink).toBeInTheDocument();
    expect(stanislavLink).toHaveAttribute(
      'href',
      'https://github.com/Quoralis'
    );
  });

  it('should render the current year', () => {
    render(<Footer />);
    expect(screen.getByText('2025')).toBeInTheDocument();
  });

  it('should render the RS School logo with a link to the home page', () => {
    render(<Footer />);
    const logoLink = screen.getByRole('link', { name: /rs_logo/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');

    const logoImage = screen.getByAltText('RS_logo');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', '/rss-logo.svg');
  });
});
