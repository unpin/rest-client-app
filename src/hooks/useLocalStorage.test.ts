import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  const KEY = 'test-key';

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should return the initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('should return the stored value from localStorage on initial render', () => {
    window.localStorage.setItem(KEY, JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage(KEY, 'initial'));
    expect(result.current[0]).toBe('stored');
  });

  it('should update the value in both state and localStorage', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(window.localStorage.getItem(KEY)).toBe(JSON.stringify('updated'));
  });

  it('should handle complex objects', () => {
    const initialObject = { a: 1, b: 'test' };
    const updatedObject = { a: 2, b: 'new-test' };
    const { result } = renderHook(() => useLocalStorage(KEY, initialObject));

    act(() => {
      result.current[1](updatedObject);
    });

    expect(result.current[0]).toEqual(updatedObject);
    expect(window.localStorage.getItem(KEY)).toBe(
      JSON.stringify(updatedObject)
    );
  });

  it('should handle JSON parsing errors gracefully', () => {
    window.localStorage.setItem(KEY, 'not-a-valid-json');
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage(KEY, 'fallback'));

    expect(result.current[0]).toBe('fallback');
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
