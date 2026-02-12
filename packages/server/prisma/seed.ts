import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "../generated/prisma";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = resolve(__dirname, "..", "dev.db");

const adapter = new PrismaLibSQL({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

const colleagues = [
  "Samuel",
  "Hugo",
  "Marie-Eve",
  "Maxime",
  "Rosalie",
  "Mathieu",
  "Kat",
];

async function main() {
  console.log("Seeding database...");

  for (const name of colleagues) {
    await prisma.user.upsert({
      where: { id: colleagues.indexOf(name) + 1 },
      update: {},
      create: { name },
    });
  }

  console.log(`Seeded ${colleagues.length} colleagues.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
