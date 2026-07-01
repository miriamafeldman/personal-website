'use client';

import { useState } from 'react';

const categories = ['Arts', 'Tech', 'Lit', 'Business'];

function CategoryPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="clickable category-pill"
      style={{
        padding: '6px 18px',
        borderRadius: '9999px',
        border: '1.5px solid var(--red)',
        backgroundColor: active ? 'var(--red)' : 'rgba(211, 64, 22, 0.1)',
        color: active ? 'var(--offwhite)' : 'var(--red)',
        fontWeight: 600,
        fontSize: '0.75rem',
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        transition: 'all 0.2s ease',
      }}
    >
      {label}
    </button>
  );
}

export default function WritingPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--offwhite)' }}>
      <section className="py-16 px-6 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-8">Writing</h1>

        <p
          style={{
            color: 'var(--red)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1.1rem',
          }}
        >
          Opining on...
        </p>

        <div
          className="category-pills"
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
        >
          {categories.map((category) => (
            <CategoryPill
              key={category}
              label={category}
              active={activeCategory === category}
              onClick={() =>
                setActiveCategory(activeCategory === category ? null : category)
              }
            />
          ))}
        </div>
      </section>

      <footer className="text-center py-8 text-sm" style={{ color: 'var(--brown)' }}>
        © 2026 Miriam Ames Feldman
      </footer>

      <style>{`
        @media (max-width: 640px) {
          .category-pills {
            gap: 0.5rem !important;
          }
          .category-pill {
            padding: 5px 10px !important;
            font-size: 0.7rem !important;
          }
        }
      `}</style>
    </main>
  );
}
