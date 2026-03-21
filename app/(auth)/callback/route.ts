import { prisma } from "@/lib/prisma"
import { createClient } from "@/services/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const settings = await prisma.attendance_settings.findUnique({
      where: { userId: user.id },
    })
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()

  const updated = await prisma.attendance_settings.upsert({
    where: { userId: user.id },
    update: { goalHours: body.goalHours },
    create: { userId: user.id, goalHours: body.goalHours },
  })

  return NextResponse.json(updated)
}
