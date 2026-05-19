# syntax=docker/dockerfile:1

FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk add --no-cache libc6-compat openssl
RUN corepack enable

WORKDIR /app

# =========================
# deps
# =========================
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# 固定 pnpm 版本
RUN corepack enable

# 使用 cache mount（Docker BuildKit）
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# =========================
# builder
# =========================
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable

# Prisma generate
RUN pnpm prisma generate

# Next build
RUN pnpm build

# =========================
# runner
# =========================
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN apk add --no-cache libc6-compat openssl

# 非 root 用户
RUN addgroup -S nodejs -g 1001
RUN adduser -S nextjs -u 1001

# standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# prisma schema
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]