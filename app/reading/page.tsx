'use client';

import { useState, useEffect } from 'react';

// ============================================
// DATA LOADING FROM CSV FILES
// ============================================
// Place your CSV files in public/data/:
//
// public/data/articles.csv with columns:
//   Title,Author,Publication,Date,URL
//
// public/data/books.csv with columns:
//   Title,Author,Date,RatingFirst,RatingEOY,URL
//
// The component will load these automatically.
// To update your reading list, just edit the CSV files
// and redeploy (git add, commit, push).
// ============================================

interface Article {
  title: string;
  author: string;
  publication: string;
  date: string;
  url: string;
}

interface Book {
  title: string;
  author: string;
  date: string;
  ratingFirst: number;
  ratingEOY: number;
  url: string;
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current = '';
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(current.trim());
        current = '';
      } else if (char === '\n' || (char === '\r' && next === '\n')) {
        row.push(current.trim());
        if (row.some(cell => cell !== '')) rows.push(row);
        row = [];
        current = '';
        if (char === '\r') i++;
      } else {
        current += char;
      }
    }
  }
  // Last row
  row.push(current.trim());
  if (row.some(cell => cell !== '')) rows.push(row);

  return rows;
}

function parseArticlesCSV(text: string): Article[] {
  const rows = parseCSV(text);
  // Skip header row
  return rows.slice(1).map(row => ({
    title: row[0] || '',
    author: row[1] || '',
    publication: row[2] || '',
    date: row[3] || '',
    url: row[4] || '',
  }));
}

function parseBooksCSV(text: string): Book[] {
  const rows = parseCSV(text);
  // Skip header row
  return rows.slice(1).map(row => ({
    title: row[0] || '',
    author: row[1] || '',
    date: row[2] || '',
    ratingFirst: parseInt(row[3]) || 0,
    ratingEOY: parseInt(row[4]) || 0,
    url: row[5] || '',
  }));
}

// ============================================
// Helper: render star rating
// ============================================
function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ letterSpacing: '1px' }}>
      <span style={{ color: 'var(--gold)', letterSpacing: '1px', WebkitTextStroke: '0.5px var(--brown)' }}>{'★'.repeat(rating)}</span>
      <span style={{ color: 'var(--brown)' }}>{'☆'.repeat(5 - rating)}</span>
    </span>
  );
}


// ============================================
// Toggle Switch Component
// ============================================
function ToggleSwitch({
  activeTab,
  onToggle,
}: {
  activeTab: 'articles' | 'books';
  onToggle: (tab: 'articles' | 'books') => void;
}) {
  const isBooks = activeTab === 'books';

  return (
    <div className="flex items-center justify-center gap-4 text-lg">
      <span
        style={{
          fontWeight: !isBooks ? 'bold' : 'normal',
          opacity: !isBooks ? 1 : 0.5,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onClick={() => onToggle('articles')}
      >
        Articles
      </span>

      <div
        onClick={() => onToggle(isBooks ? 'articles' : 'books')}
        style={{
          width: '56px',
          height: '28px',
          borderRadius: '14px',
          backgroundColor: isBooks ? 'var(--brown)' : 'var(--olive)',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background-color 0.3s ease',
        }}
      >
        <div
          style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            backgroundColor: 'var(--offwhite)',
            position: 'absolute',
            top: '3px',
            left: isBooks ? '31px' : '3px',
            transition: 'left 0.3s ease',
          }}
        />
      </div>

      <span
        style={{
          fontWeight: isBooks ? 'bold' : 'normal',
          opacity: isBooks ? 1 : 0.5,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onClick={() => onToggle('books')}
      >
        Books
      </span>
    </div>
  );
}

// ============================================
// Main Component
// ============================================
export default function ReadingList() {
  const [activeTab, setActiveTab] = useState<'articles' | 'books'>('articles');
  const [articles, setArticles] = useState<Article[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [articlesRes, booksRes] = await Promise.all([
          fetch('/data/articles.csv'),
          fetch('/data/books.csv'),
        ]);

        if (articlesRes.ok) {
          const articlesText = await articlesRes.text();
          setArticles(parseArticlesCSV(articlesText));
        }

        if (booksRes.ok) {
          const booksText = await booksRes.text();
          setBooks(parseBooksCSV(booksText));
        }
      } catch (error) {
        console.error('Error loading CSV data:', error);
      }
      setLoading(false);
    }

    loadData();
  }, []);

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--offwhite)' }}>
      {/* Header */}
      <section className="py-16 px-6 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-8">
          Reading
        </h1>

        <ToggleSwitch activeTab={activeTab} onToggle={setActiveTab} />
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : activeTab === 'articles' ? (
          <ArticlesTable articles={articles} />
        ) : (
          <BooksTable books={books} />
        )}
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-sm" style={{ color: 'var(--brown)' }}>
        © 2026 Miriam Ames Feldman
      </footer>
    </main>
  );
}

// ============================================
// Highlighter text component
// ============================================
function HighlightText({ children }: { children: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isHovered ? 'var(--gold)' : 'transparent',
        transition: 'background-color 0.2s ease',
        padding: '2px 0',
        boxDecorationBreak: 'clone',
        WebkitBoxDecorationBreak: 'clone',
      }}
    >
      {children}
    </span>
  );
}

// ============================================
// Articles Table
// ============================================
function ArticlesTable({ articles }: { articles: Article[] }) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <table className="w-full" style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ color: 'var(--olive)' }}>
          <th className="text-left pb-4 pr-8 font-normal" style={{ width: '45%' }}>Title</th>
          <th className="text-left pb-4 pr-8 font-normal italic" style={{ width: '18%' }}>Author</th>
          <th className="text-left pb-4 pr-8 font-normal" style={{ width: '20%' }}>Publication</th>
          <th className="text-left pb-4 font-normal" style={{ width: '17%' }}>Date</th>
        </tr>
      </thead>
      <tbody>
        {articles.map((article, index) => {
          const highlight = hoveredRow === index ? 'var(--gold)' : 'transparent';
          const cellStyle = { backgroundColor: highlight, transition: 'background-color 0.2s ease', padding: '2px 0', boxDecorationBreak: 'clone' as const, WebkitBoxDecorationBreak: 'clone' as const };

          return (
            <tr
              key={index}
              onMouseEnter={() => setHoveredRow(index)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <td className="py-3 pr-8">
                {article.url ? (
                  <a href={article.url} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <span style={cellStyle}>{article.title}</span>
                  </a>
                ) : (
                  <span style={cellStyle}>{article.title}</span>
                )}
              </td>
              <td className="py-3 pr-8"><span style={cellStyle} className="italic">{article.author}</span></td>
              <td className="py-3 pr-8"><span style={cellStyle}>{article.publication}</span></td>
              <td className="py-3"><span style={cellStyle}>{article.date}</span></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ============================================
// Books Table
// ============================================
function BooksTable({ books }: { books: Book[] }) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <table className="w-full" style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ color: 'var(--olive)' }}>
          <th className="text-left pb-4 pr-8 font-normal" style={{ width: '35%' }}>Title</th>
          <th className="text-left pb-4 pr-8 font-normal italic" style={{ width: '18%' }}>Author</th>
          <th className="text-left pb-4 pr-8 font-normal" style={{ width: '12%' }}>Date</th>
          <th className="text-left pb-4 pr-4 font-normal" style={{ width: '17%' }}>At First Read</th>
          <th className="text-left pb-4 font-normal" style={{ width: '17%' }}>At EOY</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book, index) => {
          const highlight = hoveredRow === index ? 'var(--gold)' : 'transparent';
          const cellStyle = { backgroundColor: highlight, transition: 'background-color 0.2s ease', padding: '2px 0', boxDecorationBreak: 'clone' as const, WebkitBoxDecorationBreak: 'clone' as const };

          return (
            <tr
              key={index}
              onMouseEnter={() => setHoveredRow(index)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <td className="py-3 pr-8">
                {book.url ? (
                  <a href={book.url} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <span style={cellStyle}>{book.title}</span>
                  </a>
                ) : (
                  <span style={cellStyle}>{book.title}</span>
                )}
              </td>
              <td className="py-3 pr-8"><span style={cellStyle} className="italic">{book.author}</span></td>
              <td className="py-3 pr-8"><span style={cellStyle}>{book.date}</span></td>
              <td className="py-3 pr-4"><Stars rating={book.ratingFirst} /></td>
              <td className="py-3"><Stars rating={book.ratingEOY} /></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}