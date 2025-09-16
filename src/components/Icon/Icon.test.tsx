import { render, screen } from '@testing-library/react';
import { CaretDown } from './Icon';

describe('Icon', () => {
  it('should render icon', () => {
    render(<CaretDown />);
    expect(screen.getByTestId('icon-caret-down')).toBeInTheDocument();
  });
});
