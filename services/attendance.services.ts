import { prisma } from "@/lib/prisma"

export async function updateUserSettings(
  userId: string,
  goal: number,
  balance: number,
  practiceFields?: object,
  mentorInfo?: object,
  targetDate?: string | null
) {
  if (balance > goal) {
    throw new Error("Initial balance cannot exceed goal hours.")
  }

  const extra = {
    ...(practiceFields !== undefined ? { practiceFields } : {}),
    ...(mentorInfo !== undefined ? { mentorInfo } : {}),
    ...(targetDate !== undefined
      ? { targetDate: targetDate ? new Date(targetDate) : null }
      : {}),
  }

  return await prisma.attendance_settings.upsert({
    where: { userId },
    update: { goalHours: goal, initialBalance: balance, ...extra },
    create: { userId, goalHours: goal, initialBalance: balance, ...extra },
  })
}
