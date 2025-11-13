import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.mediaItem.findMany({
      orderBy: { createdAt: 'desc' },
    })
    const normalized = items.map((item) => ({
      ...item,
      genres: JSON.parse(item.genresJson || '[]'),
    }))

    return NextResponse.json(normalized)
  } catch (error) {
    console.error('GET /api/watchlist error:', error)
    return NextResponse.json({ error: 'Failed to fetch watchlist' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { title, overview, posterUrl, genres, status, tmdbId, type } = await req.json()

    const item = await prisma.mediaItem.create({
      data: {
        tmdbId: Number(tmdbId),
        type: String(type),
        title: String(title),
        overview: String(overview ?? ''),
        posterUrl: posterUrl ?? null,
        genresJson: JSON.stringify(genres ?? []),
        status: String(status),
      },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('POST /api/watchlist error:', error)
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}

