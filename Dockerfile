# Multi-stage build for Next.js application
# Stage 1: Dependencies installation
FROM node:18-alpine AS deps
# Install libc6-compat for better compatibility
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
# Install dependencies
RUN npm ci

# Stage 2: Build application
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy application source code
COPY . .

# Set environment variable for build
ENV NEXT_TELEMETRY_DISABLED 1

# Build Next.js application
RUN npm run build

# Stage 3: Production runtime
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port 3000 (Next.js default, will be mapped to 3003 in docker-compose)
EXPOSE 3000

# Set environment variable for Next.js
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start Next.js server
CMD ["node", "server.js"]

