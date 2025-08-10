# --- Build Stage ---
FROM node:lts-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --ignore-scripts

# Copy all files
COPY . .

# Build TypeScript
RUN npm run build

# --- Production Stage ---
FROM node:lts-alpine
WORKDIR /app

# Copy only necessary files
COPY --from=build /app/package*.json ./
RUN npm install --omit=dev --ignore-scripts

# Copy built dist files
COPY --from=build /app/dist ./dist

# Health check (optional)
# HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
#   CMD node dist/healthcheck.js || exit 1

# Expose Render's expected port
EXPOSE 8080

# Start app
CMD ["node", "dist/server.js"]
