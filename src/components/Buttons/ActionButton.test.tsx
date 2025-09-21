import { render, screen, fireEvent } from '@testing-library/react';
import ActionButton from './ActionButton';

describe('ActionButton', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the button with the correct label', () => {
    render(<ActionButton label="Click Me" />);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('should have type "button" by default', () => {
    render(<ActionButton label="Default Type" />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveAttribute('type', 'button');
  });

  it('should apply the provided type', () => {
    render(<ActionButton label="Submit" type="submit" />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveAttribute('type', 'submit');
  });

  it('should call onClick when the button is clicked', () => {
    render(<ActionButton label="Clickable" onClick={mockOnClick} />);
    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when the disabled prop is true', () => {
    render(<ActionButton label="Disabled" disabled={true} />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeDisabled();
  });

  it('should not call onClick when the disabled button is clicked', () => {
    render(
      <ActionButton
        label="Disabled Click"
        onClick={mockOnClick}
        disabled={true}
      />
    );
    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should apply additional classNames', () => {
    render(<ActionButton label="Styled" className="custom-class" />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass('btn');
    expect(buttonElement).toHaveClass('custom-class');
  });
});
