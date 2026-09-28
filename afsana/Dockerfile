# ---------- Stage 1: Builder ----------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
# Output goes to /app/dist (static files)

# ---------- Stage 2: Runtime (nginx, non-root by default) ----------
FROM nginxinc/nginx-unprivileged:1.27-alpine

# Custom nginx config: serves SPA + /healthz route on port 3000
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

# nginx-unprivileged image already runs as non-root user "nginx" (uid 101)
USER nginx

EXPOSE 3000

USER root
RUN apk add --no-cache curl
USER nginx

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
