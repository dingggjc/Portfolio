import { getUserId } from "@/services/supabase/server"
import { prisma } from "@/lib/prisma"
import { updateUserSettings } from "@/services/attendance.services"
import { NextResponse } from "next/server"

export async function GET() {
  const userId = await getUserId()
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const settings = await prisma.attendance_settings.findUnique({
    where: { userId },
  })

  return NextResponse.json(settings)
}

export async function PUT(request: Request) {
  const userId = await getUserId()
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const { goalHours, initialBalance } = body
    const settings = await updateUserSettings(
      userId,
      Number(goalHours),
      Number(initialBalance)
    )

    return NextResponse.json(settings)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update settings"

    return NextResponse.json({ error: message }, { status: 400 })
  }
}
