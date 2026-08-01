# --- Build stage ---
# Use full node:22 image to compile native modules (better-sqlite3 needs python3, make, g++)
FROM node:22-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

# Tell node-gyp to use the locally shipped Node headers instead of downloading
# from unofficial-builds.nodejs.org (which times out in this build environment).
# node:22-alpine ships headers at /usr/local/include/node — nodedir points there.
ENV npm_config_nodedir=/usr/local

COPY package*.json ./
RUN npm install --production

# --- Runtime stage ---
# Copy only the compiled node_modules into a lean Alpine runtime image
FROM node:22-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY . .

EXPOSE 4000

CMD ["node", "server.js"]
