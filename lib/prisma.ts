import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
    adapter: new PrismaNeon({
      connectionString: process.env.DATABASE_URL,
    }),
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
