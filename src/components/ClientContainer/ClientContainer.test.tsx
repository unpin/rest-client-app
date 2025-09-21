import { render } from '@testing-library/react';
import ClientContainer from './ClientContainer';

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    forward: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
}));

jest.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations: () => (key: string) => key,
}));

jest.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: () => [[]],
}));

jest.mock('@/hooks/useRequestHistory', () => ({
  useRequestHistory: () => ({
    history: [],
    addToHistory: jest.fn(),
    clearHistory: jest.fn(),
  }),
}));

describe('ClientContainer', () => {
  it('should render without crashing', () => {
    render(
      <ClientContainer initialBody="" initialMethod="GET" initialUrl="" />
    );
  });
});
