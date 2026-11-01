# IPF + OneDev on one host: OneDev :6610 (private), Node/SPA on $PORT (public).
# Based on the official OneDev image so git/issues stay in-process on loopback.
FROM 1dev/server:16.3.4

USER root

# Node 22 (official binary — avoids distro Node lag on the OneDev base image).
ARG NODE_VERSION=22.14.0
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl xz-utils \
  && curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" \
    | tar -xJ -C /usr/local --strip-components=1 \
  && node -v && npm -v \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
# postinstall runs prisma generate — schema must exist first
COPY prisma ./prisma
COPY scripts/postinstall-prisma.mjs ./scripts/postinstall-prisma.mjs
RUN npm ci

COPY . .
RUN npm run build \
  && chmod +x scripts/start-colocated.sh

# OneDev data dir (mount a Railway volume here in production).
VOLUME ["/opt/onedev"]

# Public app port only — do not publish 6610 on Railway.
ENV PORT=8080 \
    ONEDEV_INTERNAL_URL=http://127.0.0.1:6610 \
    NODE_ENV=production

EXPOSE 8080 6610 6611

CMD ["bash", "scripts/start-colocated.sh"]
