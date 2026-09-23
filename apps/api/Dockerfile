# Base Stage
FROM node:26-alpine AS base
RUN apk add --no-cache libc6-compat dumb-init openssl
WORKDIR /usr/src/app

# Dependencies Stage
FROM base AS deps
COPY package*.json ./
COPY prisma ./prisma
RUN npm install --legacy-peer-deps

# Builder Stage
FROM base AS builder
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Production Stage
FROM base AS production
ENV NODE_ENV=production
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

# Change to non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs && \
    chown -R nestjs:nodejs /usr/src/app

COPY --chown=nestjs:nodejs package*.json ./

USER nestjs

# Install only production dependencies cleanly as the nestjs user
# This avoids needing a separate 800MB layer for chowning node_modules!
RUN npm install --omit=dev --legacy-peer-deps && npm cache clean --force

# Copy pre-generated Prisma client and dist directly as nestjs user
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/dist ./dist

# Health Check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-3000}/api/v1/health/readiness || exit 1

EXPOSE 3000

COPY --chown=nestjs:nodejs start.sh ./
RUN chmod +x start.sh

# Use dumb-init to handle PID 1 signals properly
ENTRYPOINT ["dumb-init", "./start.sh"]
CMD ["node", "dist/src/main.js"]
