import { PrismaClient } from "@generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { env } from "@/env.js";

const adapter = new PrismaBetterSqlite3({ url: env.database.url });
export const prisma = new PrismaClient({ adapter });
