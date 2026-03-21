import { prisma } from "@/lib/prisma"
import { getUserId } from "@/services/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const userId = await getUserId()
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const sessions = await prisma.attendance_sessions.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      created_at: 'desc'
    }
  })

  return NextResponse.json(sessions)
}

export async function POST(request: Request) {
  const userId = await getUserId()
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const { clockIn, clockOut, break: breakSeconds, status } = body
    
    const session = await prisma.attendance_sessions.create({
      data: {
        userId,
        clockIn: clockIn ? new Date(clockIn) : null,
        clockOut: clockOut ? new Date(clockOut) : null,
        break: breakSeconds || 0,
        status: status || "active",
        data: new Date(),
      },
    })

    return NextResponse.json(session)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create session"

    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  const userId = await getUserId()
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    await prisma.attendance_sessions.delete({
      where: { 
        id,
        userId // Ensure user can only delete their own sessions
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete session"

    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  const userId = await getUserId()
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const { id, clockIn, clockOut, break: breakSeconds, status } = body
    
    const session = await prisma.attendance_sessions.update({
      where: { id },
      data: {
        clockIn: clockIn ? new Date(clockIn) : undefined,
        clockOut: clockOut ? new Date(clockOut) : undefined,
        break: breakSeconds !== undefined ? breakSeconds : undefined,
        status: status || "active",
      },
    })

    return NextResponse.json(session)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update session"

    return NextResponse.json({ error: message }, { status: 400 })
  }
}
