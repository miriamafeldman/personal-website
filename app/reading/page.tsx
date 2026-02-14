'use client';

import { useState, useEffect, useId } from 'react';

// ============================================
// DATA LOADING FROM CSV FILES
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
  published: string;
  yearRead: string;
  ratingFirst: number;
  ratingEOY: number;
  goodreads: number;
  quote: string;
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
  row.push(current.trim());
  if (row.some(cell => cell !== '')) rows.push(row);
  return rows;
}

function parseArticlesCSV(text: string): Article[] {
  const rows = parseCSV(text);
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
  return rows.slice(1).map(row => ({
    title: row[0] || '',
    author: row[1] || '',
    published: row[2] || '',
    yearRead: row[3] || '',
    ratingFirst: parseFloat(row[4]) || 0,
    ratingEOY: parseFloat(row[5]) || 0,
    goodreads: parseFloat(row[6]) || 0,
    quote: row[7] || '',
  }));
}

// ============================================
// Half-star rating component (SVG)
// ============================================
const STAR_SIZE = 16;

function FullStarIcon() {
  return (
    <svg width={STAR_SIZE} height={STAR_SIZE} viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="var(--gold)" stroke="var(--brown)" strokeWidth="1" />
    </svg>
  );
}

function HalfStarIcon({ clipId }: { clipId: string }) {
  return (
    <svg width={STAR_SIZE} height={STAR_SIZE} viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width="12" height="24" />
        </clipPath>
      </defs>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" stroke="var(--brown)" strokeWidth="1" />
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="var(--gold)" stroke="var(--brown)" strokeWidth="1" clipPath={`url(#${clipId})`} />
    </svg>
  );
}

function EmptyStarIcon() {
  return (
    <svg width={STAR_SIZE} height={STAR_SIZE} viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" stroke="var(--brown)" strokeWidth="1" />
    </svg>
  );
}

function Stars({ rating }: { rating: number }) {
  const rounded = Math.max(0, Math.min(5, Math.round(rating * 2) / 2));
  const fullStars = Math.floor(rounded);
  const hasHalf = rounded % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  const clipId = `${useId()}-halfClip`;

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0px', whiteSpace: 'nowrap' }}>
      {Array.from({ length: fullStars }).map((_, i) => <FullStarIcon key={`f${i}`} />)}
      {hasHalf && <HalfStarIcon key="h" clipId={clipId} />}
      {Array.from({ length: emptyStars }).map((_, i) => <EmptyStarIcon key={`e${i}`} />)}
    </span>
  );
}
// ============================================
// Rating change badge
// ============================================
function RatingChange({ diff, visible }: { diff: number; visible: boolean }) {
  if (diff === 0 || !visible) return null;
  const isPositive = diff > 0;
  const displayDiff = Math.round(diff * 2) / 2;
  const displayText = isPositive ? `+${displayDiff}` : `${displayDiff}`;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '1px',
        fontSize: '11px',
        fontWeight: 'bold',
        color: isPositive ? 'var(--olive)' : 'var(--red)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        marginLeft: '6px',
      }}
    >
      <span style={{ fontSize: '10px' }}>{isPositive ? '▲' : '▼'}</span>
      {displayText}
    </span>
  );
}

// ============================================
// Main Toggle Switch
// ============================================
function ToggleSwitch({
  activeTab,
  onToggle,
}: {
  activeTab: 'articles' | 'books';
  onToggle: (tab: 'articles' | 'books') => void;
}) {
  const isArticles = activeTab === 'articles';

  return (
    <div className="flex items-center justify-center gap-4 text-lg">
      <span
        className="clickable"
        style={{
          fontWeight: !isArticles ? 'bold' : 'normal',
          opacity: !isArticles ? 1 : 0.5,
          transition: 'all 0.3s ease',
        }}
        onClick={() => onToggle('books')}
      >
        A book
      </span>

      <div
        className="clickable"
        onClick={() => onToggle(isArticles ? 'books' : 'articles')}
        style={{
          width: '56px',
          height: '28px',
          borderRadius: '14px',
          backgroundColor: isArticles ? 'var(--brown)' : 'var(--gold)',
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
            left: isArticles ? '31px' : '3px',
            transition: 'left 0.3s ease',
          }}
        />
      </div>

      <span
        className="clickable"
        style={{
          fontWeight: isArticles ? 'bold' : 'normal',
          opacity: isArticles ? 1 : 0.5,
          transition: 'all 0.3s ease',
        }}
        onClick={() => onToggle('articles')}
      >
        An article
      </span>
    </div>
  );
}

// ============================================
// Mini Rating Toggle
// ============================================
function RatingToggle({
  activeRating,
  onToggle,
}: {
  activeRating: 'first' | 'eoy';
  onToggle: (rating: 'first' | 'eoy') => void;
}) {
  const isEOY = activeRating === 'eoy';
  return (
    <div className="flex items-center gap-2" style={{ fontSize: '12px', marginTop: '4px' }}>
      <span
        className="clickable"
        style={{ fontWeight: !isEOY ? 'bold' : 'normal', opacity: !isEOY ? 1 : 0.4, transition: 'all 0.3s ease' }}
        onClick={() => onToggle('first')}
      >
        @ First Read
      </span>
      <div
        className="clickable"
        onClick={() => onToggle(isEOY ? 'first' : 'eoy')}
        style={{ width: '32px', height: '16px', borderRadius: '8px', backgroundColor: isEOY ? 'var(--olive)' : 'var(--gold)', position: 'relative', transition: 'background-color 0.3s ease' }}
      >
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--offwhite)', position: 'absolute', top: '2px', left: isEOY ? '18px' : '2px', transition: 'left 0.3s ease' }} />
      </div>
      <span
        className="clickable"
        style={{ fontWeight: isEOY ? 'bold' : 'normal', opacity: isEOY ? 1 : 0.4, transition: 'all 0.3s ease' }}
        onClick={() => onToggle('eoy')}
      >
        @ EOY
      </span>
    </div>
  );
}

// ============================================
// Filter Pill
// ============================================
function FilterPill({
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
      className="clickable"
      style={{
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '13px',
        border: '1px solid var(--brown)',
        backgroundColor: active ? 'var(--brown)' : 'transparent',
        color: active ? 'var(--offwhite)' : 'var(--brown)',
        transition: 'all 0.2s ease',
      }}
    >
      {label}
    </button>
  );
}

// ============================================
// Author Search
// ============================================
function AuthorSearch({
  authors,
  authorFilter,
  onSelect,
}: {
  authors: string[];
  authorFilter: string | null;
  onSelect: (author: string | null) => void;
}) {
  const [search, setSearch] = useState('');
  const filtered = authors.filter(a => a.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ marginTop: '12px', paddingLeft: '52px' }}>
      <input
        type="text"
        placeholder="Type to search authors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoFocus
        style={{
          padding: '6px 12px',
          borderRadius: '12px',
          border: '1px solid var(--olive)',
          backgroundColor: 'transparent',
          fontSize: '13px',
          outline: 'none',
          width: '220px',
          marginBottom: '8px',
        }}
      />
      <div className="flex flex-wrap gap-2">
        {filtered.slice(0, 15).map(author => (
          <button
            key={author}
            className="clickable"
            onClick={() => onSelect(authorFilter === author ? null : author)}
            style={{
              padding: '3px 10px',
              borderRadius: '12px',
              fontSize: '12px',
              border: '1px solid var(--olive)',
              backgroundColor: authorFilter === author ? 'var(--olive)' : 'transparent',
              color: authorFilter === author ? 'var(--offwhite)' : 'var(--olive)',
              transition: 'all 0.2s ease',
            }}
          >
            {author}
          </button>
        ))}
        {filtered.length > 15 && (
          <span style={{ fontSize: '12px', color: 'var(--brown)', opacity: 0.5, padding: '3px 6px' }}>
            +{filtered.length - 15} more — keep typing...
          </span>
        )}
        {filtered.length === 0 && (
          <span style={{ fontSize: '12px', color: 'var(--brown)', opacity: 0.5 }}>No matches</span>
        )}
      </div>
    </div>
  );
}

// ============================================
// Filter Bar
// ============================================
function BookFilters({
  books,
  authorFilter,
  setAuthorFilter,
  decadeFilter,
  setDecadeFilter,
  ratingFilter,
  setRatingFilter,
  yearReadFilter,
  setYearReadFilter,
}: {
  books: Book[];
  authorFilter: string | null;
  setAuthorFilter: (v: string | null) => void;
  decadeFilter: string | null;
  setDecadeFilter: (v: string | null) => void;
  ratingFilter: number | null;
  setRatingFilter: (v: number | null) => void;
  yearReadFilter: string | null;
  setYearReadFilter: (v: string | null) => void;
}) {
  const authors = [...new Set(books.map(b => b.author))].sort();
  const decades = [...new Set(books.map(b => {
    const year = parseInt(b.published);
    if (isNaN(year)) return null;
    return `${Math.floor(year / 10) * 10}s`;
  }).filter(Boolean))].sort() as string[];
  const yearsRead = [...new Set(books.map(b => b.yearRead).filter(Boolean))].sort().reverse();
  const ratings = [5, 4, 3, 2, 1];

  const [showAuthors, setShowAuthors] = useState(false);
  const [showDecades, setShowDecades] = useState(false);
  const [showRatings, setShowRatings] = useState(false);
  const [showYearRead, setShowYearRead] = useState(false);

  const hasActiveFilter = authorFilter || decadeFilter || ratingFilter || yearReadFilter;

  const closeAll = () => { setShowAuthors(false); setShowDecades(false); setShowRatings(false); setShowYearRead(false); };

  return (
    <div style={{ marginBottom: '24px' }}>
      <div className="flex items-center gap-3 flex-wrap">
        <span style={{ fontSize: '13px', color: 'var(--brown)', fontWeight: 'bold' }}>Filter:</span>

        <FilterPill
          label={decadeFilter ? `Published: ${decadeFilter}` : 'Published'}
          active={!!decadeFilter}
          onClick={() => { closeAll(); setShowDecades(!showDecades); }}
        />
        <FilterPill
          label={yearReadFilter ? `Year Read: ${yearReadFilter}` : 'Year Read'}
          active={!!yearReadFilter}
          onClick={() => { closeAll(); setShowYearRead(!showYearRead); }}
        />
        <FilterPill
          label={ratingFilter ? `Rating: ${ratingFilter}★` : 'Rating'}
          active={!!ratingFilter}
          onClick={() => { closeAll(); setShowRatings(!showRatings); }}
        />
        <FilterPill
          label={authorFilter ? `Author: ${authorFilter}` : 'Author'}
          active={!!authorFilter}
          onClick={() => { closeAll(); setShowAuthors(!showAuthors); }}
        />

        {hasActiveFilter && (
          <button
            onClick={() => { setAuthorFilter(null); setDecadeFilter(null); setRatingFilter(null); setYearReadFilter(null); closeAll(); }}
            className="clickable"
            style={{ fontSize: '12px', color: 'var(--red)', textDecoration: 'underline', background: 'none', border: 'none', padding: '4px 8px' }}
          >
            Clear all
          </button>
        )}
      </div>

      {showDecades && (
        <div className="flex flex-wrap gap-2" style={{ marginTop: '12px', paddingLeft: '52px' }}>
          {decades.map(decade => (
            <button
              key={decade}
              className="clickable"
              onClick={() => { setDecadeFilter(decadeFilter === decade ? null : decade); setShowDecades(false); }}
              style={{
                padding: '3px 10px', borderRadius: '12px', fontSize: '12px',
                border: '1px solid var(--olive)',
                backgroundColor: decadeFilter === decade ? 'var(--olive)' : 'transparent',
                color: decadeFilter === decade ? 'var(--offwhite)' : 'var(--olive)',
                transition: 'all 0.2s ease',
              }}
            >
              {decade}
            </button>
          ))}
        </div>
      )}

      {showYearRead && (
        <div className="flex flex-wrap gap-2" style={{ marginTop: '12px', paddingLeft: '52px' }}>
          {yearsRead.map(year => (
            <button
              key={year}
              className="clickable"
              onClick={() => { setYearReadFilter(yearReadFilter === year ? null : year); setShowYearRead(false); }}
              style={{
                padding: '3px 10px', borderRadius: '12px', fontSize: '12px',
                border: '1px solid var(--olive)',
                backgroundColor: yearReadFilter === year ? 'var(--olive)' : 'transparent',
                color: yearReadFilter === year ? 'var(--offwhite)' : 'var(--olive)',
                transition: 'all 0.2s ease',
              }}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      {showRatings && (
        <div className="flex flex-wrap gap-2" style={{ marginTop: '12px', paddingLeft: '52px' }}>
          {ratings.map(r => (
            <button
              key={r}
              className="clickable"
              onClick={() => { setRatingFilter(ratingFilter === r ? null : r); setShowRatings(false); }}
              style={{
                padding: '3px 10px', borderRadius: '12px', fontSize: '12px',
                border: '1px solid var(--olive)',
                backgroundColor: ratingFilter === r ? 'var(--olive)' : 'transparent',
                color: ratingFilter === r ? 'var(--offwhite)' : 'var(--olive)',
                transition: 'all 0.2s ease',
              }}
            >
              {r}★
            </button>
          ))}
        </div>
      )}

      {showAuthors && (
        <AuthorSearch
          authors={authors}
          authorFilter={authorFilter}
          onSelect={(author) => { setAuthorFilter(author); setShowAuthors(false); }}
        />
      )}
    </div>
  );
}

// ============================================
// Main Component
// ============================================
export default function ReadingList() {
  const [activeTab, setActiveTab] = useState<'articles' | 'books'>('books');
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
      <section className="py-16 px-6 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-8">Reading</h1>
        <ToggleSwitch activeTab={activeTab} onToggle={setActiveTab} />
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : activeTab === 'articles' ? (
          <ArticlesTable articles={articles} />
        ) : (
          <BooksTable books={books} />
        )}
      </section>

      <footer className="text-center py-8 text-sm" style={{ color: 'var(--brown)' }}>
        © 2026 Miriam Ames Feldman
      </footer>
    </main>
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
        <tr style={{ color: 'var(--black)' }}>
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
              className={article.url ? 'clickable' : ''}
              onMouseEnter={() => setHoveredRow(index)}
              onMouseLeave={() => setHoveredRow(null)}
              onClick={() => {
                if (article.url) {
                  window.open(article.url, '_blank');
                }
              }}
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
  const [activeRating, setActiveRating] = useState<'first' | 'eoy'>('first');
  const [showChangeBadge, setShowChangeBadge] = useState(false);
  const [authorFilter, setAuthorFilter] = useState<string | null>(null);
  const [decadeFilter, setDecadeFilter] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [yearReadFilter, setYearReadFilter] = useState<string | null>(null);
  const [expandedQuote, setExpandedQuote] = useState<number | null>(null);

  const handleRatingToggle = (rating: 'first' | 'eoy') => {
    setActiveRating(rating);
    setShowChangeBadge(false);
    setTimeout(() => setShowChangeBadge(true), 50);
  };

  const filteredBooks = books.filter(book => {
    if (authorFilter && book.author !== authorFilter) return false;
    if (decadeFilter) {
      const year = parseInt(book.published);
      const decade = `${Math.floor(year / 10) * 10}s`;
      if (decade !== decadeFilter) return false;
    }
    if (yearReadFilter && book.yearRead !== yearReadFilter) return false;
    if (ratingFilter) {
      const rating = Math.round(activeRating === 'first' ? book.ratingFirst : (book.ratingEOY || book.ratingFirst));
      if (rating !== ratingFilter) return false;
    }
    return true;
  });

  const numCols = 6;

  return (
    <div>
      <BookFilters
        books={books}
        authorFilter={authorFilter}
        setAuthorFilter={setAuthorFilter}
        decadeFilter={decadeFilter}
        setDecadeFilter={setDecadeFilter}
        ratingFilter={ratingFilter}
        setRatingFilter={setRatingFilter}
        yearReadFilter={yearReadFilter}
        setYearReadFilter={setYearReadFilter}
      />

      <table className="w-full" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ color: 'var(--black)' }}>
            <th className="text-left pb-4 pr-8 font-normal" style={{ width: '28%' }}>Title</th>
            <th className="text-left pb-4 pr-8 font-normal italic" style={{ width: '16%' }}>Author</th>
            <th className="text-left pb-4 pr-8 font-normal" style={{ width: '7%' }}>Published</th>
            <th className="text-left pb-4 pr-8 font-normal" style={{ width: '11%' }}>Read</th>
            <th className="text-left pb-4 pr-4 font-normal" style={{ width: '22%' }}>
              <div>
                <span>My Rating</span>
                <RatingToggle activeRating={activeRating} onToggle={handleRatingToggle} />
              </div>
            </th>
            <th className="text-left pb-4 font-normal" style={{ width: '16%' }}>Goodreads</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book, index) => {
            const isExpanded = expandedQuote === index;
            const highlight = hoveredRow === index ? 'var(--gold)' : 'transparent';
            const cellStyle = { backgroundColor: highlight, transition: 'background-color 0.2s ease', padding: '2px 0', boxDecorationBreak: 'clone' as const, WebkitBoxDecorationBreak: 'clone' as const };
            const currentRating = activeRating === 'first' ? book.ratingFirst : book.ratingEOY;
            const hasEOY = book.ratingEOY > 0;
            const diff = hasEOY ? book.ratingEOY - book.ratingFirst : 0;
            const isFiveStar = book.ratingFirst === 5 || book.ratingEOY === 5;
            const hasQuote = (book.quote || '').length > 0;

            if (isExpanded) {
return (
                <tr
                  key={index}
                  className="clickable"
                  onClick={() => setExpandedQuote(null)}
                >
                  <td
                    colSpan={numCols}
                    style={{
                      position: 'relative',
                      borderTop: '1px solid var(--gold)',
                      borderBottom: '1px solid var(--gold)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        padding: '24px 32px',
                        opacity: 1,
                        transform: 'translateY(0)',
                        animation: 'quoteReveal 0.4s ease-out',
                      }}
                    >
                      <span
                        onClick={(e) => { e.stopPropagation(); setExpandedQuote(null); }}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '12px',
                          color: 'var(--black)',
                          fontSize: '14px',
                          opacity: 0.5,
                          lineHeight: 1,
                        }}
                      >
                        ✕
                      </span>

                      <p
                        className="italic"
                        style={{
                          color: 'var(--black)',
                          fontSize: '16px',
                          lineHeight: '1.7',
                          maxWidth: '80%',
                          margin: '0 auto',
                          textAlign: 'center',
                        }}
                      >
                        &ldquo;{book.quote}&rdquo;
                      </p>

                      <p
                        style={{
                          color: 'var(--brown)',
                          fontSize: '12px',
                          opacity: 0.5,
                          textAlign: 'center',
                          marginTop: '12px',
                        }}
                      >
                        — {book.author}, <span className="italic">{book.title}</span>
                      </p>
                    </div>
                  </td>
                </tr>
              );
            }

            return (
              <tr
                key={index}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
                className={hasQuote ? 'clickable' : ''}
                onClick={() => {
                  if (hasQuote) {
                    setExpandedQuote(expandedQuote === index ? null : index);
                  }
                }}
                style={{ fontWeight: isFiveStar ? 'bold' : 'normal' }}
              >
                <td className="py-3 pr-8">
                  <span style={cellStyle}>
                    {book.title}
                    {hasQuote && (
                      <span
                        style={{
                          display: 'inline-block',
                          marginLeft: '6px',
                          fontSize: '11px',
                          color: 'var(--brown)',
                          opacity: 0.6,
                          verticalAlign: 'middle',
                        }}
                      >
                        ❝
                      </span>
                    )}
                  </span>
                </td>
                <td className="py-3 pr-8"><span style={cellStyle} className="italic">{book.author}</span></td>
                <td className="py-3 pr-8"><span style={cellStyle}>{book.published}</span></td>
                <td className="py-3 pr-8"><span style={cellStyle}>{book.yearRead}</span></td>
                <td className="py-3 pr-4">
                  {activeRating === 'eoy' && !hasEOY ? (
                    <span style={{ color: 'var(--brown)', fontSize: '13px', opacity: 0.5 }}>—</span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <Stars rating={currentRating} />
                      {activeRating === 'eoy' && hasEOY && diff !== 0 && (
                        <RatingChange diff={diff} visible={showChangeBadge} />
                      )}
                    </span>
                  )}
                </td>
                <td className="py-3"><Stars rating={book.goodreads} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {filteredBooks.length === 0 && (
        <p className="text-center py-8" style={{ color: 'var(--brown)', opacity: 0.5 }}>
          No books match the current filters.
        </p>
      )}
    </div>
  );
}

