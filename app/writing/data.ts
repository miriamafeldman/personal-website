import { POST_CATEGORIES, type Category } from './categories';

const FEED_URL = 'https://miriamafeldman.substack.com/feed';

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  link: string;
  date: string;
  image: string | null;
  categories: Category[];
}

function decodeEntities(text: string): string {
  return text
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8216;|&#8217;/g, "'")
    .replace(/&#8212;/g, '—')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

function extractTag(block: string, tag: string): string | null {
  const cdataMatch = block.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`));
  if (cdataMatch) return decodeEntities(cdataMatch[1]).trim();
  const plainMatch = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  if (plainMatch) return decodeEntities(plainMatch[1]).trim();
  return null;
}

function formatDate(pubDate: string): string {
  const parsed = new Date(pubDate);
  if (Number.isNaN(parsed.getTime())) return pubDate;
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function slugFromLink(link: string): string {
  return link.replace(/\/+$/, '').split('/').pop() ?? link;
}

export async function fetchPosts(): Promise<Post[]> {
  const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
  if (!res.ok) return [];

  const xml = await res.text();
  const itemBlocks = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];

  return itemBlocks.map((block) => {
    const title = extractTag(block, 'title') ?? '';
    const excerpt = extractTag(block, 'description') ?? '';
    const link = extractTag(block, 'link') ?? '';
    const pubDate = extractTag(block, 'pubDate') ?? '';
    const enclosureMatch = block.match(/<enclosure url="([^"]+)"/);
    const slug = slugFromLink(link);

    return {
      slug,
      title,
      excerpt,
      link,
      date: formatDate(pubDate),
      image: enclosureMatch ? enclosureMatch[1] : null,
      categories: POST_CATEGORIES[slug] ?? [],
    };
  });
}
