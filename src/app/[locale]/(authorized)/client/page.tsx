import { redirect } from 'next/navigation';

type ClientPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ClientPage({ params }: ClientPageProps) {
  const { locale } = await params;

  redirect('/' + locale + '/client/GET');
}
