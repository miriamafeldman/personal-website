# Writing page

Pulls posts from the Substack RSS feed (`https://miriamafeldman.substack.com/feed`)
and renders them as cards, filterable by tag. Substack hosts the actual writing —
this page never stores post content, just title/excerpt/link/date/image pulled
live from the feed.

## How the data flows

- [`data.ts`](data.ts) fetches the RSS feed server-side (in the page's Server
  Component, not the browser) and hand-parses the XML with regex — the feed's
  `<item>` structure is flat and simple enough that a small parser is easier to
  reason about than a dependency.
- Fetching happens server-side because Substack's feed doesn't send
  `Access-Control-Allow-Origin`, so a client-side `fetch()` would be blocked by
  CORS.
- [`categories.ts`](categories.ts) holds the tag mapping. **Substack's RSS
  doesn't expose per-post tags** (no `<category>` elements) unless you use
  Substack Sections, which this account doesn't. So tags are maintained by hand
  here, keyed by post slug (the last segment of the URL, e.g.
  `miriamafeldman.substack.com/p/no-art-at-tech-week` → `no-art-at-tech-week`).
  Posts can carry multiple tags. A post with no entry in the map just renders
  with zero tags (still shows up, just won't match any pill filter).

## Keeping it fresh

Two mechanisms work together so a new Substack post shows up without a manual
redeploy:

1. **Passive (ISR)** — the `fetch()` in `data.ts` is cached with
   `next: { revalidate: 3600 }`. Once an hour has passed, the next visitor
   triggers a background refetch. Zero setup, but only fires on actual traffic.
2. **Active (Cron)** — [`vercel.json`](../../vercel.json) defines a Vercel Cron
   Job that hits [`/api/revalidate-writing`](../api/revalidate-writing/route.ts)
   every day at 8am UTC, which force-refreshes the `/writing` page cache
   regardless of traffic.

**When you publish a new post:** it'll appear on the site within a day even if
you do nothing. If you want it live sooner, visit `/writing` (a stale-but-live
page still serves instantly, then revalidates in the background) or manually
hit `/api/revalidate-writing`.

**New posts won't have tags** until you add a line to `categories.ts` and
redeploy (or just edit it directly on GitHub — no build step required beyond
the normal deploy). Untagged posts still show up in the "all" view, they just
won't highlight under any pill.

## Securing the cron endpoint (optional)

`/api/revalidate-writing` is unauthenticated unless a `CRON_SECRET` env var is
set on the Vercel project. If set, Vercel automatically sends it as
`Authorization: Bearer <CRON_SECRET>` on cron-triggered requests, and the route
checks it. Without it, the endpoint still works, it's just publicly callable —
low risk since it only forces a cache refresh, not a data mutation, but worth
locking down if you'd rather not have it exposed.
