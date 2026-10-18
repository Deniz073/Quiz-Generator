# syntax=docker/dockerfile:1

ARG NODE_VERSION=24

# ---- deps: install the full dependency tree (cached unless the lockfile changes)
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# --ignore-scripts: no third-party lifecycle scripts run during the build
RUN --mount=type=cache,target=/root/.npm \
    npm ci --ignore-scripts --no-audit --no-fund

# ---- build: validate quizzes + Nitro production build -> /app/.output
FROM deps AS build
# Baked into the client/SSR bundle at build time (canonical URL, OG tags).
# Optional: the build works without it.
ARG VITE_SITE_URL=""
ENV VITE_SITE_URL=${VITE_SITE_URL} \
    NODE_ENV=production
COPY . .
RUN npm run build

# ---- runtime: Nitro output is self-contained (traced deps are bundled), so no
# npm, no node_modules, no source in the final image.
FROM node:${NODE_VERSION}-alpine AS runtime
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000
WORKDIR /app
COPY --from=build --chown=node:node /app/.output ./.output

# Unprivileged user (uid 1000) provided by the base image.
USER node
EXPOSE 3000

# Uses Node itself, so no curl/wget needed in the image.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD ["node", "-e", "fetch('http://127.0.0.1:'+(process.env.NITRO_PORT||process.env.PORT||3000)+'/').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"]

# Exec form: node is PID 1 and receives SIGTERM directly.
CMD ["node", ".output/server/index.mjs"]
