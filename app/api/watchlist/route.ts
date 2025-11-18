import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mediaItemCreateSchema } from '@/lib/validation/mediaItem'

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
    const json = await req.json()
    const data = mediaItemCreateSchema.parse(json)

    const item = await prisma.mediaItem.create({
      data: {
        title: data.title,
        type: data.type,
        status: data.status,
        overview: data.overview ?? null,
        posterUrl: data.posterUrl ?? null,
        genresJson: JSON.stringify(data.genres ?? []),
      },
    })

    return new Response(JSON.stringify(item), { status: 201 })
  } catch (error) {
    console.error("POST validation error:", error)
    return new Response("Invalid input", { status: 400 })
  }
}


// export async function POST(req: Request) {
//   try {
//     const { title, overview, posterUrl, genres, status, tmdbId, type } = await req.json()
//
//     const item = await prisma.mediaItem.create({
//       data: {
//         tmdbId: Number(tmdbId),
//         type: String(type),
//         title: String(title),
//         overview: String(overview ?? ''),
//         posterUrl: posterUrl ?? null,
//         genresJson: JSON.stringify(genres ?? []),
//         status: String(status),
//       },
//     })
//
//     return NextResponse.json(item)
//   } catch (error) {
//     console.error('POST /api/watchlist error:', error)
//     return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
//   }
// }

