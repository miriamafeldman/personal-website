'use client';

import { useMemo, useState } from 'react';
import { ALL_CATEGORIES, type Category } from './categories';
import type { Post } from './data';

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

function PostCard({ post, matched, filterActive }: { post: Post; matched: boolean; filterActive: boolean }) {
  const highlighted = filterActive && matched;
  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="clickable post-card"
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        border: '1px solid rgba(85, 49, 26, 0.15)',
        borderRadius: '10px',
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        filter: matched ? 'grayscale(0)' : 'grayscale(1)',
        opacity: matched ? 1 : 0.45,
        transition: 'filter 0.3s ease, opacity 0.3s ease',
      }}
    >
      {post.image && (
        <div style={{ width: '100%', aspectRatio: '16 / 9', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}
      <div style={{ padding: '1rem 1.1rem' }}>
        <p style={{ fontSize: '0.7rem', color: 'var(--brown)', opacity: 0.6, marginBottom: '0.4rem' }}>
          MIRIAM FELDMAN &middot; {post.date}
        </p>
        <h3
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            marginBottom: '0.35rem',
            lineHeight: 1.3,
            color: highlighted ? 'var(--red)' : 'inherit',
            transition: 'color 0.3s ease',
          }}
        >
          {post.title}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--brown)', opacity: 0.75, lineHeight: 1.5 }}>
          {post.excerpt}
        </p>
      </div>
    </a>
  );
}

export default function WritingClient({ posts }: { posts: Post[] }) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const orderedPosts = useMemo(() => {
    if (!activeCategory) return posts;
    const matching = posts.filter((p) => p.categories.includes(activeCategory));
    const rest = posts.filter((p) => !p.categories.includes(activeCategory));
    return [...matching, ...rest];
  }, [posts, activeCategory]);

  return (
    <>
      <div
        className="category-pills"
        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
      >
        {ALL_CATEGORIES.map((category) => (
          <CategoryPill
            key={category}
            label={category}
            active={activeCategory === category}
            onClick={() => setActiveCategory(activeCategory === category ? null : category)}
          />
        ))}
      </div>

      <section
        className="post-grid"
        style={{
          maxWidth: '1100px',
          margin: '3rem auto 0',
          padding: '0 1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
          textAlign: 'left',
        }}
      >
        {orderedPosts.map((post) => (
          <PostCard
            key={post.slug}
            post={post}
            matched={!activeCategory || post.categories.includes(activeCategory)}
            filterActive={!!activeCategory}
          />
        ))}
      </section>

      {posts.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--brown)', opacity: 0.5, marginTop: '3rem' }}>
          No posts found.
        </p>
      )}

      <style>{`
        @media (max-width: 640px) {
          .category-pills {
            gap: 0.5rem !important;
          }
          .category-pill {
            padding: 5px 10px !important;
            font-size: 0.7rem !important;
          }
          .post-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .post-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </>
  );
}
