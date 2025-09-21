import { render, screen } from '@testing-library/react';
import ErrorForm from './ErrorForm';

describe('ErrorForm', () => {
  it('should render nothing when no message is provided', () => {
    const { getByTestId } = render(<ErrorForm />);
    const divElement = getByTestId('error-form-container');
    expect(divElement).toBeInTheDocument();
    expect(divElement.textContent).toBe('');
  });

  it('should render the error message when provided', () => {
    const errorMessage = 'This is a test error.';
    render(<ErrorForm message={errorMessage} />);
    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement.tagName).toBe('P');
  });

  it('should have the correct styling for the error message', () => {
    const errorMessage = 'Styled error.';
    render(<ErrorForm message={errorMessage} />);
    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toHaveClass('text-red-500', 'text-sm');
  });
});
