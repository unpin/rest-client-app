import Image from 'next/image';
import Nav from '@/components/Header/Nav';

export default function Header() {
  return (
    <header className="header">
      <div>
        <Image width={50} height={50} src="/logo.png" alt="logo" />
        <Nav />
      </div>
    </header>
  );
}
