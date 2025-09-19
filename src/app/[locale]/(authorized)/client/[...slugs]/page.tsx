import ClientContainer from '@/components/ClientContainer/ClientContainer';

type ClientPageProps = {
  params: Promise<{
    slugs: string[];
  }>;
};

export default async function ClientPage({ params }: ClientPageProps) {
  const { slugs = [] } = await params;
  const method = slugs[0];
  const base64Url = slugs[1];
  const base64Body = slugs[2];

  return (
    <ClientContainer
      initialMethod={{ method }}
      initialUrl={base64Url}
      initialBody={base64Body}
    />
  );
}
