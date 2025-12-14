# Multi-stage build - Supports both development and production
FROM node:22.16.0-alpine AS base

RUN apk add --no-cache dumb-init
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001 -G nodejs

# Development stage - Hot reloading with all dependencies
FROM base AS development

WORKDIR /app
COPY package*.json ./
RUN npm ci  # Install ALL dependencies including devDependencies

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN chown -R nestjs:nodejs /app

USER nestjs
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node --version || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:dev"]

# Build stage - For production optimization
FROM base AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

# Runtime dependencies stage - Install all production deps (omit=dev) from package.json
FROM base AS runtime-deps

WORKDIR /app
COPY package*.json ./

# Install all production dependencies (omit=dev) from package.json (instead of a hardcoded list)
RUN npm ci --omit=dev
# Clean up documentation and test files
RUN find node_modules -name "*.md" -delete && \
  find node_modules -name "*.txt" -delete && \
  find node_modules -name "CHANGELOG*" -delete && \
  find node_modules -name "LICENSE*" -delete && \
  find node_modules -name "README*" -delete && \
  find node_modules -name "*.map" -delete && \
  rm -rf node_modules/*/test node_modules/*/tests node_modules/*/__tests__ 2>/dev/null || true

# Final production stage
FROM base AS production

WORKDIR /app

# Copy minimal runtime dependencies (now includes all production deps from package.json)
COPY --from=runtime-deps --chown=nestjs:nodejs /app/node_modules ./node_modules

# Copy only the generated Prisma client 
COPY --from=builder --chown=nestjs:nodejs /app/generated ./generated

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Copy Prisma schema and migrations (needed for migrations)
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

# Copy minimal necessary files
COPY --chown=nestjs:nodejs package.json ./

# Copy startup script (created outside Docker)
COPY --chown=nestjs:nodejs start.sh ./start.sh
RUN chmod +x start.sh

USER nestjs
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node --version || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["./start.sh"] 