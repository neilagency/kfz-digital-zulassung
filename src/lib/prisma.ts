import { PrismaClient } from '@/generated/prisma';
import { PrismaLibSql } from '@prisma/adapter-libsql';

function createPrismaClient() {
  // Force local SQLite (for Hostinger migration)
  if (process.env.USE_LOCAL_DB === 'true') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
    const path = require('path');
    const dbPath = process.env.DATABASE_URL?.replace('file:', '') || path.join(process.cwd(), 'production-db-backup.db');
    const adapter = new PrismaBetterSqlite3({ url: 'file:' + dbPath });
    return new PrismaClient({ adapter });
  }

  // On Vercel (or any env with TURSO_DATABASE_URL), use Turso/LibSQL
  if (process.env.TURSO_DATABASE_URL) {
    const adapter = new PrismaLibSql({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return new PrismaClient({ adapter });
  }

  // Local development fallback: use better-sqlite3
  // This code path is never reached on Vercel
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
  const path = require('path');
  const dbPath = path.join(process.cwd(), 'dev.db');
  const adapter = new PrismaBetterSqlite3({ url: 'file:' + dbPath });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: ReturnType<typeof createPrismaClient> };

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Warm up the database connection on startup to avoid cold-start latency
if (typeof globalThis !== 'undefined') {
  prisma.$queryRaw`SELECT 1`.catch(() => {});
}

export default prisma;
