import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from './theme/ThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider/AuthProvider';

export default function AppProviders({ children }: React.PropsWithChildren) {
  return (
    <NextIntlClientProvider>
      <AuthProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
