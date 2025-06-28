# Étape de construction
FROM node:22-alpine AS builder

WORKDIR /app

# Installation des dépendances
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Étape d'exécution
FROM node:18-alpine

# Création de l'utilisateur non-root
RUN addgroup -g 1001 express && \
    adduser -u 1001 -G express -D express

WORKDIR /app

# Copie des artefacts
COPY --from=builder --chown=express:express /app/node_modules ./node_modules
COPY --chown=express:express . .

# Configuration
ENV NODE_ENV production
ENV PORT 8080

EXPOSE 8080

USER express

CMD ["node", "server.js"]