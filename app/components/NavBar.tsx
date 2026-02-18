'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { label: 'Working', href: '/work', color: 'var(--blue)', width: '5em' },
  { label: 'Making', href: '/studio', color: 'var(--red)', width: '4.8em' },
  { label: 'Reading', href: '/reading', color: 'var(--gold)', width: '5.2em' },
  { label: 'Visiting', href: '/galleries', color: 'var(--olive)', width: '5em' },
];

export default function NavBar() {
  const pathname = usePathname();

  if (pathname === '/') return null;

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        padding: '0.7rem clamp(1rem, 3vw, 2rem)',
        zIndex: 50,
      }}
    >
      <Link
        href="/"
        className="home-link clickable"
        style={{
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '0.95rem',
        }}
      >
        MAF
      </Link>
      <div
        style={{
          display: 'flex',
          gap: 'clamp(0.8rem, 2vw, 1.5rem)',
        }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            label={item.label}
            href={item.href}
            color={item.color}
            width={item.width}
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
  width,
  isActive,
}: {
  label: string;
  href: string;
  color: string;
  width: string;
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
        fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
        fontWeight: 400,
        letterSpacing: '0.01em',
        transition: 'color 0.2s ease',
        display: 'inline-block',
        width: width,
        textAlign: 'right',
      }}
    >
      {showEffect ? (
        <>
          <span
            style={{
              fontFamily: 'var(--font-gothic), cursive',
              fontSize: '1.3em',
              lineHeight: 1,
            }}
          >
            {firstLetter}
          </span>
          <span>{rest}</span>
        </>
      ) : (
        label
      )}
    </Link>
  );
}
