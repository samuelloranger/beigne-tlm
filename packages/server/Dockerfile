FROM oven/bun:1 AS build
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY prisma ./prisma
COPY prisma.config.ts ./
RUN DATABASE_URL="file:./placeholder.db" bunx prisma generate

COPY . .

FROM oven/bun:1
WORKDIR /app

COPY --from=build /app .

EXPOSE 3001
CMD ["sh", "-c", "bunx prisma migrate deploy && bun run src/index.ts"]
