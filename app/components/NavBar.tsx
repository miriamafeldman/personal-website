'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { label: 'Working', href: '/work', color: 'var(--blue)' },
  { label: 'Making', href: '/studio', color: 'var(--olive)' },
  { label: 'Reading', href: '/reading', color: 'var(--gold)' },
  { label: 'Visiting', href: '/galleries', color: 'var(--olive)' },
];

export default function NavBar() {
  const pathname = usePathname();

  // Hide on homepage
  if (pathname === '/') return null;

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'baseline',
        padding: '0.55rem 1rem',
        zIndex: 50,
        borderBottom: '1px solid rgba(85, 49, 26, 0.06)',
      }}
    >
      <Link
        href="/"
        className="home-link clickable"
        style={{
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '0.95rem',
          marginRight: 'auto',
        }}
      >
        MAF
      </Link>
      <div
        style={{
          display: 'flex',
          gap: 'clamp(1.2rem, 3vw, 2.5rem)',
        }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            label={item.label}
            href={item.href}
            color={item.color}
            isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
          />
        ))}
      </div>
    </nav>
  );
}

function NavLink({
  label,
  href,
  color,
  isActive,
}: {
  label: string;
  href: string;
  color: string;
  isActive: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const showEffect = isHovered || isActive;
  const firstLetter = label[0];
  const rest = label.slice(1);

  return (
    <Link
      href={href}
      className="clickable"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        textDecoration: 'none',
        color: showEffect ? color : 'var(--black)',
        fontSize: '0.85rem',
        fontWeight: 400,
        letterSpacing: '0.01em',
        transition: 'color 0.2s ease, font-weight 0.2s ease',
        display: 'flex',
        alignItems: 'baseline',
      }}
    >
      <span
        style={{
          fontFamily: showEffect ? 'var(--font-gothic), cursive' : 'inherit',
          fontSize: showEffect ? '1.3em' : '1em',
          fontWeight: showEffect ? 400 : 300,
          lineHeight: 1,
          transition: 'font-size 0.2s ease',
        }}
      >
        {firstLetter}
      </span>
      <span>{rest}</span>
    </Link>
  );
}
