import type { Metadata } from 'next';
import './../../globals.css';
import AppProviders from '@/providers/AppProviders';
import { ReactNode } from 'react';
import StickyHeader from '@/components/Header/StickyHeader';
import Footer from '@/components/Footer/Footer';

export const metadata: Metadata = {
  title: 'Rest Client',
  description:
    'A powerful and intuitive web-based REST client for making HTTP requests.',
};

type RootLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({
  params,
  children,
}: RootLayoutProps) {
  const { locale } = await params;
  return (
    <html lang={locale}>
      <AppProviders>
        <body className="grid min-h-screen w-full grid-rows-[auto_1fr_auto] gap-4">
          <StickyHeader />
          <main className="">{children}</main>
          <Footer />
        </body>
      </AppProviders>
    </html>
  );
}
