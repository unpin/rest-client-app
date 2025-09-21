import Image from 'next/image';
import Nav from './Nav';
import Link from 'next/link';

type HeaderProps = {
  scrolled: boolean;
};

export default function Header({ scrolled }: HeaderProps) {
  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300
        ${scrolled ? 'bg-white shadow-md h-14' : 'bg-gray-100 h-20'}
        dark:bg-gray-900
      `}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 h-full">
        <div
          className={`transition-transform duration-300 ${
            scrolled ? 'scale-90' : 'scale-100'
          }`}
        >
          <Link href={'/'}>
            <Image width={48} height={48} src="/logo.png" alt="logo" />
          </Link>
        </div>
        <Nav />
      </div>
    </header>
  );
}
