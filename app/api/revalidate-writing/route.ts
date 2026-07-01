import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

// Triggered by the Vercel Cron Job defined in vercel.json. Vercel signs
// cron requests with an Authorization: Bearer <CRON_SECRET> header when the
// CRON_SECRET env var is set on the project, so we verify it here to stop
// this endpoint from being used to spam revalidations from outside.
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  revalidatePath('/writing');
  return NextResponse.json({ revalidated: true, path: '/writing', now: Date.now() });
}
