import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CodegenSelector from './CodegenSelector';
import { Request as PostmanRequest } from 'postman-collection';
import * as codegen from 'postman-code-generators';
import * as generator from '@/utils/codegen/generator';

jest.mock('postman-code-generators', () => ({
  getLanguageList: jest.fn(),
}));

jest.mock('@/utils/codegen/generator', () => ({
  createCodeSample: jest.fn(),
}));

const mockGetLanguageList = codegen.getLanguageList as jest.Mock;
const mockCreateCodeSample = generator.createCodeSample as jest.Mock;

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

const mockWriteText = navigator.clipboard.writeText as jest.Mock;

describe('CodegenSelector', () => {
  const mockRequest = new PostmanRequest({
    url: 'https://api.example.com/data',
    method: 'GET',
  });

  const mockLanguages = [
    {
      key: 'javascript',
      label: 'JavaScript',
      variants: [{ key: 'fetch' }],
    },
    {
      key: 'python',
      label: 'Python',
      variants: [{ key: 'requests' }],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetLanguageList.mockReturnValue(mockLanguages);
    mockCreateCodeSample.mockResolvedValue('Generated code snippet');
    mockWriteText.mockResolvedValue(undefined);
  });

  it('should render the language selector and generate button', () => {
    render(<CodegenSelector request={mockRequest} />);
    expect(screen.getByLabelText('Choose language')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /generate/i })
    ).toBeInTheDocument();
  });

  it('should have the generate button disabled initially', () => {
    render(<CodegenSelector request={mockRequest} />);
    expect(screen.getByRole('button', { name: /generate/i })).toBeDisabled();
  });

  it('should enable the generate button when a language is selected', () => {
    render(<CodegenSelector request={mockRequest} />);
    const languageSelect = screen.getByLabelText('Choose language');
    fireEvent.change(languageSelect, { target: { value: 'JavaScript' } });
    expect(screen.getByRole('button', { name: /generate/i })).toBeEnabled();
  });

  it('should generate and display a code snippet', async () => {
    render(<CodegenSelector request={mockRequest} />);

    const languageSelect = screen.getByLabelText('Choose language');
    fireEvent.change(languageSelect, { target: { value: 'JavaScript' } });

    const generateButton = screen.getByRole('button', { name: /generate/i });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(mockCreateCodeSample).toHaveBeenCalledWith(
        'javascript',
        'fetch',
        mockRequest
      );
    });

    const codeTextarea = screen.getByPlaceholderText('Code Example');
    await waitFor(() =>
      expect(codeTextarea).toHaveValue('Generated code snippet')
    );
  });

  it('should copy the code to the clipboard', async () => {
    render(<CodegenSelector request={mockRequest} />);

    fireEvent.change(screen.getByLabelText('Choose language'), {
      target: { value: 'JavaScript' },
    });
    fireEvent.click(screen.getByRole('button', { name: /generate/i }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Code Example')).toHaveValue(
        'Generated code snippet'
      );
    });

    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);

    expect(mockWriteText).toHaveBeenCalledWith('Generated code snippet');

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /copied!/i })
      ).toBeInTheDocument();
    });

    await waitFor(
      () => expect(screen.queryByText('Copied!')).not.toBeInTheDocument(),
      { timeout: 2500 }
    );
  });
});
