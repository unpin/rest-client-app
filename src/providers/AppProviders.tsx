import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from './theme/ThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider/AuthProvider';
import Header from '@/components/Header/Header';

export default function AppProviders({ children }: React.PropsWithChildren) {
  return (
    <NextIntlClientProvider>
      <AuthProvider>
        <Header />
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
