# Étape de construction
FROM node:18-alpine AS builder

WORKDIR /app

# Installation des dépendances
COPY package.json package-lock.json ./
RUN npm ci

# Copie des sources et construction
COPY . .
RUN npm run build

# Étape d'exécution
FROM node:18-alpine

# Création de l'utilisateur non-root
RUN addgroup -g 1000 nest && \
    adduser -u 1000 -G nest -D nest

WORKDIR /app

# Copie des artefacts de construction
COPY --from=builder --chown=nest:nest /app/node_modules ./node_modules
COPY --from=builder --chown=nest:nest /app/dist ./dist
COPY --chown=nest:nest package.json .

# Configuration
ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

USER nest

CMD ["node", "dist/main"]