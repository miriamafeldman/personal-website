import { fetchPosts } from './data';
import WritingClient from './WritingClient';

export default async function WritingPage() {
  const posts = await fetchPosts();

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

        <WritingClient posts={posts} />
      </section>

      <footer className="text-center py-8 text-sm" style={{ color: 'var(--brown)' }}>
        © 2026 Miriam Ames Feldman
      </footer>
    </main>
  );
}
