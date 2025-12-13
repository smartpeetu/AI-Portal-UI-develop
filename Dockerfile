# ---------- Stage 1: deps ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install
# satisfy policy for this stage (build stage doesn't need a real check)
HEALTHCHECK NONE

# ---------- Stage 2: build ----------
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN CI=false npm run build
# satisfy policy for this stage
HEALTHCHECK NONE

# ---------- Stage 3: runtime (nginx) ----------
FROM nginx:1.28.0-alpine

# Copy built app
COPY --from=build /app/dist /usr/share/nginx/html

# Copy configs:
#   - main nginx.conf (sets pid to /tmp)
#   - site/server config into conf.d
COPY nginx.main.conf /etc/nginx/nginx.conf
COPY site.conf /etc/nginx/conf.d/default.conf

# Prep writable dirs (cache/logs can be kept; /tmp is already writable)
RUN mkdir -p /var/cache/nginx /var/log/nginx \
 && chown -R nginx:nginx /var/cache/nginx /var/log/nginx /usr/share/nginx/html

# Drop root
USER nginx

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/ || exit 1

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]