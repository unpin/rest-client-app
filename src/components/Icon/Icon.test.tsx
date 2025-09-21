import { render, screen } from '@testing-library/react';
import { CaretDown, MagicWand, PaperPlaneRight } from './Icon';

describe('Icon', () => {
  it('should render icon', () => {
    render(<CaretDown />);
    expect(screen.getByTestId('icon-caret-down')).toBeInTheDocument();
  });

  it('should render MagicWand icon', () => {
    render(<MagicWand />);
    expect(screen.getByTestId('magic-wand')).toBeInTheDocument();
  });

  it('should render PaperPlaneRight icon', () => {
    render(<PaperPlaneRight />);
    expect(screen.getByTestId('paper-plane-right')).toBeInTheDocument();
  });
});
