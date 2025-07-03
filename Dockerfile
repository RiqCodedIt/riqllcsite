FROM node:20-alpine AS build

ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . ./

# Specify any needed environment variables here
ARG VITE_API_URL

# Debug: Echo the VITE_API_URL environment variable
RUN echo "BACKEND_URL during build: $VITE_API_URL"

RUN npm run build

FROM caddy

WORKDIR /app

COPY Caddyfile ./

COPY --from=build /app/dist /app/dist

CMD ["caddy", "run", "--config", "Caddyfile", "--adapter", "caddyfile"]
