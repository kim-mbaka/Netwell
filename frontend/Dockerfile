# --- Build stage: compile the React app ---
# Node 24 (npm 11) matches the npm that generates package-lock.json, so
# `npm ci` stays in sync. Older npm (node:20 = npm 10) rejects the lockfile.
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Serve stage: nginx serves the static build (TLS handled by host nginx) ---
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
