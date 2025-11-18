import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from "@prisma/client";
import type { z } from "zod";
import { mediaItemCreateSchema, mediaItemOutputSchema } from '@/lib/validation/mediaItem'


export type MediaItemOutput = z.infer<typeof mediaItemOutputSchema>;
type PrismaMediaItem = Prisma.MediaItemGetPayload<true>;

export function transformMediaItem(item: PrismaMediaItem): MediaItemOutput {
  const transformed = {
    ...item,
    genres: JSON.parse(item.genresJson || "[]"),
  };

  return mediaItemOutputSchema.parse(transformed);
}


export async function GET() {
  try {
    const items = await prisma.mediaItem.findMany({
      orderBy: { createdAt: "desc" },
    });

    const output = items.map(transformMediaItem);

    return NextResponse.json(output);
  } catch (error) {
    console.error("GET /api/watchlist error:", error);
    return NextResponse.json(
      { error: "Failed to fetch watchlist" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = mediaItemCreateSchema.parse(json);

    const created = await prisma.mediaItem.create({
      data: {
        title: data.title,
        type: data.type,
        status: data.status,
        overview: data.overview ?? null,
        posterUrl: data.posterUrl ?? null,
        genresJson: JSON.stringify(data.genres ?? []),
      },
    });

    const output = transformMediaItem(created);

    return NextResponse.json(output, { status: 201 });
  } catch (error) {
    console.error("POST validation error:", error);
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
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

