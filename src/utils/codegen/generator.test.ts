import { createCodeSample } from './generator';
import { convert } from 'postman-code-generators';
import { Request as PostmanRequest } from 'postman-collection';

jest.mock('postman-code-generators', () => ({
  convert: jest.fn(),
}));

const mockConvert = convert as jest.Mock;

describe('createCodeSample', () => {
  const mockRequest = new PostmanRequest({
    url: 'https://example.com',
    method: 'GET',
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should resolve with the generated code snippet on success', async () => {
    const expectedCode = "fetch('https://example.com');";

    mockConvert.mockImplementation((lang, variant, req, opts, callback) => {
      callback(null, expectedCode);
    });

    const code = await createCodeSample('javascript', 'fetch', mockRequest, {});

    expect(code).toBe(expectedCode);
    expect(mockConvert).toHaveBeenCalledWith(
      'javascript',
      'fetch',
      mockRequest,
      {},
      expect.any(Function)
    );
  });

  it('should reject with an error on failure', async () => {
    const mockError = new Error('Conversion failed');

    mockConvert.mockImplementation((lang, variant, req, opts, callback) => {
      callback(mockError, null);
    });

    await expect(
      createCodeSample('python', 'requests', mockRequest, {})
    ).rejects.toThrow('Conversion failed');

    expect(mockConvert).toHaveBeenCalledWith(
      'python',
      'requests',
      mockRequest,
      {},
      expect.any(Function)
    );
  });
});
