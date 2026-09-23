# =============================================================================
# PariLink Web — Production Docker Image
# Built from monorepo root context (context: .)
# =============================================================================

# Base Stage
FROM node:26-alpine AS base
RUN apk add --no-cache libc6-compat dumb-init
WORKDIR /app

# Deps Stage — workspace-aware install
FROM base AS deps
# Copy root workspace config
COPY package.json package-lock.json ./
# Copy ALL workspace package.json files to maintain exactly the same tree structure as the host
COPY apps/web/package.json ./apps/web/package.json
COPY apps/api/package.json ./apps/api/package.json
COPY apps/mobile/package.json ./apps/mobile/package.json
COPY packages/plugin-sdk/package.json ./packages/plugin-sdk/package.json
# Install all workspace dependencies exactly as host
RUN npm ci --legacy-peer-deps

# Builder Stage
FROM base AS builder
COPY package.json package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_module[s] ./apps/web/node_modules
COPY --from=deps /app/packages/plugin-sdk/node_module[s] ./packages/plugin-sdk/node_modules
# Copy plugin-sdk source
COPY packages/plugin-sdk ./packages/plugin-sdk
# Build plugin-sdk first
RUN cd packages/plugin-sdk && npx tsc
# Copy web app source
COPY apps/web ./apps/web
# Build Next.js
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GIT_SHA
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GIT_SHA=$NEXT_PUBLIC_GIT_SHA
ENV NEXT_TELEMETRY_DISABLED=1
RUN ls -la /app/node_modules/react || true
RUN cd apps/web && npm run build

# Runner Stage
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
RUN chown nextjs:nodejs /app

USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["dumb-init", "node", "apps/web/server.js"]
