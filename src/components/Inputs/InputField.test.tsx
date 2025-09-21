import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputField from './InputsField';

describe('InputField Component', () => {
  it('renders correctly with a label and placeholder', () => {
    render(<InputField label="Username" name="username" />);

    const labelElement = screen.getByText('Username');
    expect(labelElement).toBeInTheDocument();

    const inputElement = screen.getByPlaceholderText('Username');
    expect(inputElement).toBeInTheDocument();
  });

  it('allows the user to type into the input', () => {
    render(<InputField label="Email" name="email" />);

    const inputElement = screen.getByPlaceholderText(
      'Email'
    ) as HTMLInputElement;

    fireEvent.change(inputElement, { target: { value: 'test@example.com' } });

    expect(inputElement.value).toBe('test@example.com');
  });

  it('renders with a default value if provided', () => {
    render(<InputField label="Name" name="name" defaultValue="John Doe" />);

    const inputElement = screen.getByPlaceholderText(
      'Name'
    ) as HTMLInputElement;

    expect(inputElement.value).toBe('John Doe');
  });
});
