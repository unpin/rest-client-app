import Image from 'next/image';
import Link from 'next/link';

const team = [
  {
    name: 'German',
    github: 'https://github.com/unpin',
    id: 1,
  },
  {
    name: 'Matsvei',
    github: 'https://github.com/geniusx1990',
    id: 2,
  },
  {
    name: 'Stanislav',
    github: 'https://github.com/Quoralis',
    id: 3,
  },
];

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-gray-100 dark:bg-neutral-900 shadow-inner">
      <div className="flex items-center justify-between gap-4 px-6 h-20">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
            Developers
          </span>
          <div className="flex space-x-6 text-sm text-gray-600 dark:text-gray-300">
            {team.map((member) => (
              <Link
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                key={member.id}
              >
                {member.name}
              </Link>
            ))}
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400">2025</p>
        <Link href="/">
          <Image width={48} height={48} src="/rss-logo.svg" alt="RS_logo" />
        </Link>
      </div>
    </footer>
  );
}
