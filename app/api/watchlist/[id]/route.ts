import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MediaStatus } from "@prisma/client"
import { transformMediaItem } from '../route'
import { z } from "zod"

console.log('✅ [id]/route.ts loaded')

const patchSchema = z.object({
  status: z.nativeEnum(MediaStatus)
});

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  console.log('🧨 DELETE handler invoked with:', context)
  const { id } = await context.params
  try {
    await prisma.mediaItem.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params
    const json = await req.json()
    const data = patchSchema.parse(json)

    const updated = await prisma.mediaItem.update({
      where: { id },
      data: {
        status: data.status,
      },
    });

    const output = transformMediaItem(updated);

    return NextResponse.json(output);
  } catch (err) {
    console.error("PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}


// export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
//   console.log('🧩 PATCH handler invoked with:', context)
//   const { id } = await context.params
//   const { status } = await req.json()
//   try {
//     const item = await prisma.mediaItem.update({
//       where: { id },
//       data: { status },
//     })
//     return NextResponse.json(item)
//   } catch (error) {
//     console.error('PATCH error:', error)
//     return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
//   }
// }

