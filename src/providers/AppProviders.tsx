import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from './theme/ThemeProvider';

export default function AppProviders({ children }: React.PropsWithChildren) {
  return (
    <NextIntlClientProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </NextIntlClientProvider>
  );
}
