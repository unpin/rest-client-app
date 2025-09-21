import { render, screen, fireEvent } from '@testing-library/react';
import ProxyResponseView from './ProxyResponseContainer';
import { ProxyResponseData } from '@/app/api/proxy/route';

const mockSuccessResponse: ProxyResponseData = {
  status: 200,
  statusText: 'OK',
  responseBody: JSON.stringify({ message: 'Success' }),
  responseHeaders: { 'content-type': 'application/json' },
  responseTime: 123,
  responseSize: 45,
  requestHeaders: [],
  requestBody: '',
  requestMethod: 'GET',
  requestSize: 0,
  timestamp: new Date().toISOString(),
  endpointURL: 'https://api.example.com',
};

const mockErrorResponse: ProxyResponseData = {
  status: 404,
  statusText: 'Not Found',
  responseBody: 'The requested resource was not found.',
  responseHeaders: { 'content-type': 'text/plain' },
  responseTime: 50,
  responseSize: 35,
  requestHeaders: [],
  requestBody: '',
  requestMethod: 'GET',
  requestSize: 0,
  timestamp: new Date().toISOString(),
  endpointURL: 'https://api.example.com',
};

describe('ProxyResponseView', () => {
  it('should render the response status, time, and size', () => {
    render(<ProxyResponseView response={mockSuccessResponse} />);
    expect(screen.getByText('200 OK')).toBeInTheDocument();
    expect(screen.getByText('123 ms')).toBeInTheDocument();
    expect(screen.getByText('45 bytes')).toBeInTheDocument();
  });

  it('should apply success styling for 2xx status codes', () => {
    render(<ProxyResponseView response={mockSuccessResponse} />);
    const statusElement = screen.getByText('200 OK');
    expect(statusElement).toHaveClass('bg-green-800');
  });

  it('should apply error styling for non-2xx status codes', () => {
    render(<ProxyResponseView response={mockErrorResponse} />);
    const statusElement = screen.getByText('404 Not Found');
    expect(statusElement).toHaveClass('bg-red-800');
  });

  it('should display the response body by default', () => {
    render(<ProxyResponseView response={mockSuccessResponse} />);
    expect(
      screen.getByText((content) => content.includes('"message": "Success"'))
    ).toBeInTheDocument();
  });

  it('should switch to the headers view when the Headers button is clicked', () => {
    render(<ProxyResponseView response={mockSuccessResponse} />);
    const headersButton = screen.getByRole('button', { name: /headers/i });
    fireEvent.click(headersButton);

    expect(
      screen.getByText((content) =>
        content.includes('"content-type": "application/json"')
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByText((content) => content.includes('"message": "Success"'))
    ).not.toBeInTheDocument();
  });

  it('should switch back to the body view when the Body button is clicked again', () => {
    render(<ProxyResponseView response={mockSuccessResponse} />);
    const headersButton = screen.getByRole('button', { name: /headers/i });
    const bodyButton = screen.getByRole('button', { name: /body/i });

    fireEvent.click(headersButton);
    expect(
      screen.queryByText((content) => content.includes('"message": "Success"'))
    ).not.toBeInTheDocument();

    fireEvent.click(bodyButton);
    expect(
      screen.getByText((content) => content.includes('"message": "Success"'))
    ).toBeInTheDocument();
  });

  it('should correctly format a plain text response body', () => {
    render(<ProxyResponseView response={mockErrorResponse} />);
    expect(
      screen.getByText(mockErrorResponse.responseBody as string)
    ).toBeInTheDocument();
  });
});
