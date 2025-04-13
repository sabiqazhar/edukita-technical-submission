# Stage 1: Build TS to JS
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install deps
COPY package.json package-lock.json ./
RUN npm install

# Copy rest of source
COPY . .

# Build TypeScript -> JS (output to dist/)
RUN npm run build

# Stage 2: Run built JS (production)
FROM node:20-alpine

WORKDIR /app

# Only copy built files & dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Expose port (match with server.ts)
EXPOSE 3000

# Run compiled server
CMD ["node", "dist/server.js"]
