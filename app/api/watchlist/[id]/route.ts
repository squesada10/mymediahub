import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.mediaItem.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/watchlist/[id] error:', error)
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json()
    const { status } = data

    const item = await prisma.mediaItem.update({
      where: { id: params.id },
      data: { status },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('PATCH /api/watchlist/[id] error:', error)
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

