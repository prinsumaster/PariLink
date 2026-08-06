# Base Stage
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat dumb-init
WORKDIR /usr/src/app

# Dependencies Stage
FROM base AS deps
COPY package*.json ./
COPY prisma ./prisma
RUN npm install

# Builder Stage
FROM base AS builder
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Production Stage
FROM base AS production
ENV NODE_ENV=production

# Change to non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY package*.json ./
# Install only production dependencies cleanly
RUN npm install --omit=dev && npm cache clean --force

COPY --from=builder /usr/src/app/prisma ./prisma
# Generate prisma client with production binaries
RUN npx prisma generate

COPY --from=builder --chown=nestjs:nodejs /usr/src/app/dist ./dist

# Set correct permissions
RUN chown -R nestjs:nodejs /usr/src/app

USER nestjs

# Health Check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-3000}/health/readiness || exit 1

EXPOSE 3000

COPY --chown=nestjs:nodejs start.sh ./
RUN chmod +x start.sh

# Use dumb-init to handle PID 1 signals properly
ENTRYPOINT ["dumb-init", "./start.sh"]
CMD ["node", "dist/main.js"]
