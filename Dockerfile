# # Start from the official Node.js LTS base image
# FROM node:18-alpine

# # Set the working directory
# WORKDIR /app

# # Copy package.json and package-lock.json before other files
# # Utilise Docker cache to save re-installing dependencies if unchanged
# COPY package*.json ./

# COPY prisma ./prisma/

# # Install dependencies
# RUN npm install

# RUN npm ci

# # Copy all files
# COPY . .


# RUN npm run build

# # Expose the listening port
# EXPOSE 3003

# # Run npm start script
# CMD ["npm", "run", "start"]




# Base stage with pnpm for ARM architecture
FROM node:18-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies needed for native modules on ARM
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile

# Builder stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client for ARM architecture
RUN pnpm prisma generate

# Build the Next.js application
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# Rename build directory to .next if it exists (for consistency)
RUN if [ -d "build" ] && [ ! -d ".next" ]; then mv build .next; fi

# Production stage - optimized for Raspberry Pi
FROM node:18-alpine AS runner
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install runtime dependencies
RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy package files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy node_modules
COPY --from=builder /app/node_modules ./node_modules

# Copy built application (now always in .next after rename)
COPY --from=builder /app/.next ./.next

# Copy public directory
COPY --from=builder /app/public ./public

# Copy Prisma files
COPY --from=builder /app/prisma ./prisma

# Copy next.config
COPY --from=builder /app/next.config.* ./

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3003

ENV PORT=3003
ENV HOSTNAME="0.0.0.0"

CMD ["pnpm", "start"]