# # Start from the official Node.js LTS base image
# FROM node:18-alpine


# # Set the working directory
# WORKDIR /app

# # Copy package.json and package-lock.json before other files
# # Utilise Docker cache to save re-installing dependencies if unchanged
# COPY package*.json ./


# # Install dependencies
# RUN npm install 

# RUN npm ci --only=production
# RUN npm cache clean --force

# # Copy all files
# COPY . .

# RUN npm run build


# # Expose the listening port
# EXPOSE 3003

# # Run npm start script
# CMD ["npm", "run", "start"]



# # Build stage
# FROM node:18-alpine AS builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # Production stage
# FROM node:18-alpine AS runner
# WORKDIR /app

# ENV NODE_ENV=production
# ENV NEXT_TELEMETRY_DISABLED=1

# COPY --from=builder /app/next.config.js ./
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next/static ./.next/static
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/.next/server ./.next/server

# EXPOSE 3003

# CMD ["npm", "run", "start"]


# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy configuration files first
COPY package.json pnpm-lock.yaml next.config.js ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY public ./public
COPY src ./src
COPY tsconfig.json ./

# Build application
RUN pnpm build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install pnpm
RUN npm install -g pnpm

# Copy runtime files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile

EXPOSE 3003

CMD ["pnpm", "dev"]