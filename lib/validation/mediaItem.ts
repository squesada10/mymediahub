import { z } from "zod";
import { MediaType, MediaStatus } from "@prisma/client";

export const mediaItemCreateSchema = z.object({
  title: z.string(),
  type: z.nativeEnum(MediaType),
  status: z.nativeEnum(MediaStatus),
  overview: z.string().optional(),
  posterUrl: z.string().optional(),
  genres: z.array(z.string()).optional(),
});

export const mediaItemUpdateSchema = z.object({
  status: z.enum(["to-watch", "watching", "watched"]),
});

