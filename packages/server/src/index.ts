import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { prisma } from "./db";

const app = new Elysia()
  .use(cors())

  // Get all users
  .get("/users", async () => {
    return prisma.user.findMany({
      orderBy: { name: "asc" },
    });
  })

  // Create a new user
  .post(
    "/users",
    async ({ body }) => {
      return prisma.user.create({
        data: { name: body.name },
      });
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
      }),
    }
  )

  // Catch someone! Add a beigne
  .post(
    "/beignes",
    async ({ body }) => {
      return prisma.beigne.create({
        data: { userId: body.userId },
        include: { user: true },
      });
    },
    {
      body: t.Object({
        userId: t.Number(),
      }),
    }
  )

  // Get all beignes (pending donuts to bring)
  .get("/beignes", async () => {
    return prisma.beigne.findMany({
      include: { user: true },
      orderBy: { caughtAt: "desc" },
    });
  })

  // Update beigne cost
  .patch(
    "/beignes/:id",
    async ({ params, body }) => {
      return prisma.beigne.update({
        where: { id: Number(params.id) },
        data: { cost: body.cost },
        include: { user: true },
      });
    },
    {
      body: t.Object({
        cost: t.Number({ minimum: 0 }),
      }),
    }
  )

  // Scoreboard
  .get("/scoreboard", async () => {
    const users = await prisma.user.findMany({
      include: {
        beignes: true,
      },
    });

    const scoreboard = users
      .map((user) => ({
        id: user.id,
        name: user.name,
        timesCaught: user.beignes.length,
        totalSpent: user.beignes.reduce((sum, b) => sum + (b.cost ?? 0), 0),
      }))
      .filter((u) => u.timesCaught > 0)
      .sort((a, b) => {
        // Sort by total spent desc, then times caught desc
        if (b.totalSpent !== a.totalSpent) return b.totalSpent - a.totalSpent;
        return b.timesCaught - a.timesCaught;
      });

    return scoreboard;
  })

  // Delete a beigne
  .delete("/beignes/:id", async ({ params }) => {
    return prisma.beigne.delete({ where: { id: Number(params.id) } });
  })

  // Delete a user
  .delete("/users/:id", async ({ params }) => {
    await prisma.beigne.deleteMany({ where: { userId: Number(params.id) } });
    return prisma.user.delete({ where: { id: Number(params.id) } });
  })

  .listen(3001);

console.log(`🍩 Beigne server running at http://localhost:3001`);
