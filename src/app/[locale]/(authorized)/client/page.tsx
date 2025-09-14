import { redirect } from 'next/navigation';

type ClientPageProps = {
  params: {
    locale: string;
  };
};

export default function ClientPage({ params }: ClientPageProps) {
  const { locale } = params;

  redirect('/' + locale + '/client/GET');
}
