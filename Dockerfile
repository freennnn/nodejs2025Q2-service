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

# Runtime dependencies stage - Install minimal production deps + prisma for migrations
FROM base AS runtime-deps

WORKDIR /app
COPY package*.json ./

# Install production deps + prisma CLI for migrations
RUN npm install --only=production \
  @nestjs/common@^11.0.0 \
  @nestjs/core@^11.0.0 \
  @nestjs/mapped-types@^2.1.0 \
  @nestjs/platform-express@^11.0.0 \
  @nestjs/swagger@^11.2.0 \
  class-transformer@^0.5.1 \
  class-validator@^0.14.1 \
  dotenv@^16.4.5 \
  js-yaml@^4.1.0 \
  reflect-metadata@^0.2.1 \
  rxjs@^7.8.1 \
  uuid@^9.0.1 \
  prisma@^6.9.0 \
  --no-audit --no-fund --no-package-lock

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

# Copy minimal runtime dependencies (now includes prisma CLI)
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