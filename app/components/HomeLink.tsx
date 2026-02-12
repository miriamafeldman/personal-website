'use client';

import { usePathname } from 'next/navigation';

export default function HomeLink() {
  const pathname = usePathname();

  if (pathname === '/') return null;

  return (
    <a
      href="/"
      className="home-link"
      style={{ position: 'fixed', top: '20px', left: '24px', zIndex: 50, textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}
    >
      MAF
    </a>
  );
}