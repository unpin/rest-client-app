import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from './theme/ThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider/AuthProvider';
import StickyHeader from '@/components/Header/StickyHeader';

export default function AppProviders({ children }: React.PropsWithChildren) {
  return (
    <NextIntlClientProvider>
      <AuthProvider>
        <StickyHeader />
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
