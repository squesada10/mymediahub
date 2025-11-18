import { NextResponse } from 'next/server'
import { Prisma } from "@prisma/client";
import { mediaItemCreateSchema, mediaItemOutputSchema, MediaItemOutput } from '@/lib/schemas/mediaItem'
import { mediaItemRepo } from "@/lib/repositories/mediaItemRepo";


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
    const items = await mediaItemRepo.getAll();
    return NextResponse.json(items);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = mediaItemCreateSchema.parse(json);

    const item = await mediaItemRepo.create(data);

    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
}
