import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

console.log('✅ [id]/route.ts loaded')

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  console.log('🧨 DELETE handler invoked with:', context)
  const { id } = context.params
  try {
    await prisma.mediaItem.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  console.log('🧩 PATCH handler invoked with:', context)
  const { id } = context.params
  const { status } = await req.json()
  try {
    const item = await prisma.mediaItem.update({
      where: { id },
      data: { status },
    })
    return NextResponse.json(item)
  } catch (error) {
    console.error('PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

