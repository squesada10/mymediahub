import { NextResponse } from 'next/server';
import { TMDB_BASE_URL } from '@/lib/api-constants';

// Define the structure of the data we want to return from our API route
export interface TmdbSearchResult {
  id: number;
  title: string;
  release_date: string;
  media_type: 'movie' | 'tv'; // 'tv' is for series
  poster_path: string | null;
  overview: string;
}

// Handler for GET requests (http://localhost:3000/api/search?query=dune)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  const API_KEY = process.env.TMDB_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'TMDB_API_KEY not configured' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(query)}&api_key=${API_KEY}`,
      {
        // Optional: set cache to revalidate daily
        next: { revalidate: 86400 }
      }
    );

    if (!response.ok) {
      // Log the error but return a generic response
      console.error('TMDB API Error:', response.statusText);
      return NextResponse.json({ error: 'Failed to fetch data from TMDB' }, { status: 502 });
    }

    const data = await response.json();

    // Filter and map the results to a cleaner format
    const results: TmdbSearchResult[] = data.results
      .filter((item: any) =>
        // Only include movies and TV shows that have a title
        (item.media_type === 'movie' || item.media_type === 'tv') && item.title
      )
      .map((item: any) => ({
        id: item.id,
        title: item.title || item.name, // 'name' for TV shows
        release_date: item.release_date || item.first_air_date || 'N/A',
        media_type: item.media_type,
        poster_path: item.poster_path,
        overview: item.overview || 'No overview available.',
      }));


    return NextResponse.json(results);

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
