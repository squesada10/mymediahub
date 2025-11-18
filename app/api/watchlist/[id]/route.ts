import { NextResponse } from 'next/server'
import { patchSchema } from "@/lib/schemas/mediaItem";
import { mediaItemRepo } from "@/lib/repositories/mediaItemRepo";

console.log('✅ [id]/route.ts loaded')

export async function DELETE(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;
    await mediaItemRepo.delete(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;
    const json = await req.json();
    const data = patchSchema.parse(json);

    const item = await mediaItemRepo.updateStatus(id, data.status);

    return NextResponse.json(item);
  } catch (err) {
    console.error("PATCH error:", err);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}
