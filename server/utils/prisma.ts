import { PrismaPg } from "@prisma/adapter-pg";
import * as prismaPkg from "@prisma/client";
import { Pool } from "pg";

const PrismaClient = (prismaPkg as any).PrismaClient as typeof prismaPkg.PrismaClient;

const connectionString: string = process.env.DATABASE_URL ?? "";
if (!connectionString) throw new Error("DATABASE_URL is not set");

const pool: Pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as { prisma?: any };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
