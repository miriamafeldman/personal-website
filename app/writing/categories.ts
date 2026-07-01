export const ALL_CATEGORIES = ['Arts', 'Tech', 'Lit', 'Business'] as const;

export type Category = (typeof ALL_CATEGORIES)[number];

// Substack doesn't expose per-post tags via RSS, so categories are maintained
// here by hand. Keyed by the post slug (the last segment of its URL, e.g.
// miriamafeldman.substack.com/p/<slug>). Posts can carry multiple tags.
// New posts default to no tags until added below.
export const POST_CATEGORIES: Record<string, Category[]> = {
  'no-art-at-tech-week': ['Tech', 'Arts', 'Business'],
  'assimilation-anxiety': ['Lit'],
  'red-white-and-cobalt-blue': ['Arts', 'Business'],
  'paypals-oscar-nom': ['Business', 'Arts'],
  'to-the-moon-and-back': ['Tech', 'Business', 'Arts'],
  'the-t-s-eliot-prize-by-the-numbers': ['Lit'],
  'on-fire': ['Arts'],
};
