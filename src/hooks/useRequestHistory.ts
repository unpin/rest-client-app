import { useLocalStorage } from './useLocalStorage';
import { ProxyResponseData } from '@/app/api/proxy/route';

export function useRequestHistory() {
  const [history, setHistory] = useLocalStorage<ProxyResponseData[]>(
    'requestHistory',
    []
  );

  const getHistory = () => {
    return history;
  };

  const addItem = (item: ProxyResponseData) => {
    setHistory([item, ...history]);
  };

  const removeItem = (timestamp: string) => {
    setHistory(
      history.filter(
        (item) => new Date(item.timestamp).toISOString() !== timestamp
      )
    );
  };

  const clearAll = () => {
    setHistory([]);
  };

  return { getHistory, addItem, removeItem, clearAll };
}
