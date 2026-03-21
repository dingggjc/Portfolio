import { getUserId } from "@/services/supabase/server"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const userId = await getUserId()
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const profile = await prisma.profiles.findUnique({
    where: { id: userId },
  })

  return NextResponse.json(profile)
}
