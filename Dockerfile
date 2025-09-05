# Etapa 1 — Build
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copia apenas os arquivos de dependência para cache
COPY package*.json ./
RUN npm ci

# Copia o código
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

ENV NEXT_PUBLIC_API_URL="https://backend-registro-de-ponto-623675162711.us-central1.run.app/v1"

RUN npm run build

# Etapa 2 — Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# A variável PORT é injetada automaticamente pelo Cloud Run.
# Você pode manter esta linha ou removê-la, pois o Cloud Run a substituirá.
ENV PORT=8080

# Copia artefatos de build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expõe porta (boa prática, mas o Cloud Run foca na variável PORT)
EXPOSE 8080

# Start com Turbo para Cloud Run
CMD ["npm", "run", "start", "--", "-H", "0.0.0.0"]