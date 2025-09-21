import { render, screen } from '@testing-library/react';
import Header from './Header';

jest.mock('./Nav', () => {
  const Nav = () => <nav>Mocked Nav</nav>;
  Nav.displayName = 'Nav';
  return Nav;
});

describe('Header', () => {
  it('should render the logo with a link to the homepage', () => {
    render(<Header scrolled={false} />);
    const logoLink = screen.getByRole('link', { name: /logo/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');

    const logoImage = screen.getByAltText('logo') as HTMLImageElement;
    expect(logoImage).toBeInTheDocument();
    expect(logoImage.src).toContain(encodeURIComponent('/logo.png'));
  });

  it('should render the Nav component', () => {
    render(<Header scrolled={false} />);
    expect(screen.getByText('Mocked Nav')).toBeInTheDocument();
  });

  it('should have default styles when not scrolled', () => {
    const { container } = render(<Header scrolled={false} />);
    const headerElement = container.firstChild;
    expect(headerElement).toHaveClass('bg-gray-900');
    expect(headerElement).not.toHaveClass('bg-gray-800', 'shadow-md');

    const logoContainer = screen.getByRole('link', {
      name: /logo/i,
    }).parentElement;
    expect(logoContainer).toHaveClass('scale-100');
    expect(logoContainer).not.toHaveClass('scale-90');
  });

  it('should apply scrolled styles when scrolled is true', () => {
    const { container } = render(<Header scrolled={true} />);
    const headerElement = container.firstChild;
    expect(headerElement).toHaveClass('bg-gray-800', 'shadow-md');

    const logoContainer = screen.getByRole('link', {
      name: /logo/i,
    }).parentElement;
    expect(logoContainer).toHaveClass('scale-90');
    expect(logoContainer).not.toHaveClass('scale-100');
  });
});
