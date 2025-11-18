import { prisma } from "@/lib/prisma";
import { mediaItemOutputSchema, MediaItemOutput } from "@/lib/schemas/mediaItem";
import { Prisma } from "@prisma/client";

type PrismaMediaItem = Prisma.MediaItemGetPayload<true>;

function toOutput(item: PrismaMediaItem): MediaItemOutput {
  return mediaItemOutputSchema.parse({
    ...item,
    genres: JSON.parse(item.genresJson || "[]"),
  });
}

export const mediaItemRepo = {
  async getAll(): Promise<MediaItemOutput[]> {
    const items = await prisma.mediaItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    return items.map(toOutput);
  },

  async create(data: {
    title: string;
    type: "movie" | "show";
    status: "to_watch" | "watching" | "watched";
    overview?: string | null;
    posterUrl?: string | null;
    genres?: string[];
  }): Promise<MediaItemOutput> {
    const item = await prisma.mediaItem.create({
      data: {
        title: data.title,
        type: data.type,
        status: data.status,
        overview: data.overview ?? null,
        posterUrl: data.posterUrl ?? null,
        genresJson: JSON.stringify(data.genres ?? []),
      },
    });
    return toOutput(item);
  },

  async delete(id: string): Promise<void> {
    await prisma.mediaItem.delete({ where: { id } });
  },

  async updateStatus(id: string, status: "to_watch" | "watching" | "watched"): Promise<MediaItemOutput> {
    const item = await prisma.mediaItem.update({
      where: { id },
      data: { status },
    });
    return toOutput(item);
  },
};

