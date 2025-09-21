import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RequestBar from './RequestBar';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('RequestBar', () => {
  const mockOnUrlChange = jest.fn();
  const mockOnSend = jest.fn((e) => e.preventDefault());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the input field with the initial URL', () => {
    render(
      <RequestBar
        url="https://api.example.com"
        onUrlChange={mockOnUrlChange}
        onSend={mockOnSend}
        urlError={null}
      />
    );
    const inputElement = screen.getByPlaceholderText('placeholder');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue('https://api.example.com');
  });

  it('should call onUrlChange when the input value changes', () => {
    render(
      <RequestBar
        url=""
        onUrlChange={mockOnUrlChange}
        onSend={mockOnSend}
        urlError={null}
      />
    );
    const inputElement = screen.getByPlaceholderText('placeholder');
    fireEvent.change(inputElement, { target: { value: 'https://new.url' } });
    expect(mockOnUrlChange).toHaveBeenCalledWith('https://new.url');
  });

  it('should call onSend when the form is submitted', () => {
    render(
      <RequestBar
        url="https://api.example.com"
        onUrlChange={mockOnUrlChange}
        onSend={mockOnSend}
        urlError={null}
      />
    );
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);
    expect(mockOnSend).toHaveBeenCalledTimes(1);
  });

  it('should apply error styling when urlError is present', () => {
    render(
      <RequestBar
        url="invalid-url"
        onUrlChange={mockOnUrlChange}
        onSend={mockOnSend}
        urlError="Invalid URL"
      />
    );
    const inputElement = screen.getByPlaceholderText('placeholder');
    expect(inputElement).toHaveClass('text-red-300');
  });

  it('should not have error styling when urlError is null', () => {
    render(
      <RequestBar
        url="https://api.example.com"
        onUrlChange={mockOnUrlChange}
        onSend={mockOnSend}
        urlError={null}
      />
    );
    const inputElement = screen.getByPlaceholderText('placeholder');
    expect(inputElement).not.toHaveClass('text-red-300');
  });
});
