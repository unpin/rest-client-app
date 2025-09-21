import { renderHook, act } from '@testing-library/react';
import { useRequestHistory } from './useRequestHistory';
import { useLocalStorage } from './useLocalStorage';
import { ProxyResponseData } from '@/app/api/proxy/route';

jest.mock('./useLocalStorage', () => ({
  useLocalStorage: jest.fn(),
}));

const mockUseLocalStorage = useLocalStorage as jest.Mock;

const mockItem1: ProxyResponseData = {
  timestamp: new Date('2023-01-01T12:00:00.000Z').toISOString(),
  status: 200,
  statusText: 'OK',
  responseBody: 'data1',
  responseHeaders: {},
  responseTime: 100,
  responseSize: 10,
  requestHeaders: [],
  requestBody: '',
  requestMethod: 'GET',
  requestSize: 0,
  endpointURL: '/test1',
};

const mockItem2: ProxyResponseData = {
  timestamp: new Date('2023-01-02T12:00:00.000Z').toISOString(),
  status: 404,
  statusText: 'Not Found',
  responseBody: 'data2',
  responseHeaders: {},
  responseTime: 200,
  responseSize: 20,
  requestHeaders: [],
  requestBody: '',
  requestMethod: 'POST',
  requestSize: 0,
  endpointURL: '/test2',
};

describe('useRequestHistory', () => {
  let mockSetHistory: jest.Mock;
  let historyState: ProxyResponseData[];

  beforeEach(() => {
    historyState = [];
    mockSetHistory = jest.fn((newValue) => {
      historyState =
        typeof newValue === 'function' ? newValue(historyState) : newValue;
    });
    mockUseLocalStorage.mockImplementation(() => [
      historyState,
      mockSetHistory,
    ]);
  });

  it('should return the current history', () => {
    historyState = [mockItem1];
    const { result } = renderHook(() => useRequestHistory());
    expect(result.current.getHistory()).toEqual([mockItem1]);
  });

  it('should add a new item to the beginning of the history', () => {
    historyState = [mockItem1];
    const { result } = renderHook(() => useRequestHistory());

    act(() => {
      result.current.addItem(mockItem2);
    });

    expect(mockSetHistory).toHaveBeenCalledWith([mockItem2, mockItem1]);
  });

  it('should remove an item from the history by its timestamp', () => {
    historyState = [mockItem1, mockItem2];
    const { result } = renderHook(() => useRequestHistory());

    act(() => {
      result.current.removeItem(mockItem1.timestamp);
    });

    expect(mockSetHistory).toHaveBeenCalledWith([mockItem2]);
  });

  it('should clear the entire history', () => {
    historyState = [mockItem1, mockItem2];
    const { result } = renderHook(() => useRequestHistory());

    act(() => {
      result.current.clearAll();
    });

    expect(mockSetHistory).toHaveBeenCalledWith([]);
  });
});
