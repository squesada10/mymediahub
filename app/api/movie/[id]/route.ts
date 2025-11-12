import { NextResponse } from 'next/server';
import { TMDB_BASE_URL } from '@/lib/api-constants';

// Returns { runtimeMinutes: number } for a given TMDB movie id
export async function GET(request: Request) {
  // Extract the id from the request URL to avoid relying on the runtime 'context' parameter.
  // Example pathname: /api/movie/123
  const url = new URL(request.url);
  const match = url.pathname.match(/\/api\/movie\/([^\/]+)$/);
  const id = match ? decodeURIComponent(match[1]) : undefined;
  const API_KEY = process.env.TMDB_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'TMDB_API_KEY not configured' }, { status: 500 });
  }

  try {
    if (!id) {
      return NextResponse.json({ error: 'Missing movie id' }, { status: 400 });
    }

    const res = await fetch(`${TMDB_BASE_URL}/movie/${encodeURIComponent(id)}?api_key=${API_KEY}`, {
      next: { revalidate: 86400 },
    });

    const text = await res.text();
  let data: Record<string, unknown> | null = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      // not JSON
    }

    if (!res.ok) {
      console.error('TMDB movie detail error', res.status, text);
      const msg = data?.status_message || text || 'Failed to fetch movie details';
      return NextResponse.json({ error: msg }, { status: res.status || 502 });
    }

    // TMDB returns `runtime` in minutes for movies
    const runtime = data?.runtime ?? 0;

    return NextResponse.json({ runtimeMinutes: runtime });
  } catch (err) {
    console.error('Movie API route error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
