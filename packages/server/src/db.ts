import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "../generated/prisma";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbUrl =
  process.env.DATABASE_URL ?? `file:${resolve(__dirname, "..", "dev.db")}`;

const adapter = new PrismaLibSQL({ url: dbUrl });

export const prisma = new PrismaClient({ adapter });
