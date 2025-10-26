# Dockerfile
# ──────────────────────────────────────────────────────────────────────────────

# 1. Use a lean Node.js base
FROM node:18-alpine

# 2. Set working dir
WORKDIR /app

# 3. Copy only package manifests & install dependencies
COPY package.json package-lock.json ./
# Use npm ci in production for clean, reproducible builds
RUN npm install

# 4. Copy source, build the app
COPY . .
RUN npm run build

# 5. Expose the port Next.js will listen on
EXPOSE 9040

# 6. Launch Next.js in production mode on 9050
CMD ["npx", "next", "start", "--port", "9050"]
