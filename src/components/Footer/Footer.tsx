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
    <footer className="bg-gray-900 shadow-inner">
      <div className="max-w-6xl mx-auto flex items-center gap-4 py-8">
        <div className="flex flex-1 flex-col gap-4">
          <span className="text-xs uppercase tracking-wide text-gray-500">
            Developers
          </span>
          <div className="flex space-x-6 text-sm text-gray-300">
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

        <div className="flex-1 text-center text-gray-400">
          <p>2025</p>
        </div>

        <div className="flex flex-1 justify-end">
          <Link href="/">
            <Image width={48} height={48} src="/rss-logo.svg" alt="RS_logo" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
