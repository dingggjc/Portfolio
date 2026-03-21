import { prisma } from "@/lib/prisma"

export async function updateUserSettings(
  userId: string,
  goal: number,
  balance: number
) {
  if (balance > goal) {
    throw new Error("Initial balance cannot exceed goal hours.")
  }

  return await prisma.attendance_settings.upsert({
    where: { userId },
    update: { goalHours: goal, initialBalance: balance },
    create: { userId, goalHours: goal, initialBalance: balance },
  })
}
