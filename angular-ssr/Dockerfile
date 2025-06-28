# Étape de construction
FROM node:18-alpine AS builder

# Création de l'utilisateur non-root
RUN addgroup -g 1000 angular && \
    adduser -u 1000 -G angular -D angular

WORKDIR /app

# Installation des dépendances
COPY package.json package-lock.json ./
RUN npm ci

# Copie des sources et construction
COPY . .
RUN npm run build:ssr

# Étape d'exécution
FROM node:18-alpine

# Création de l'utilisateur non-root
RUN addgroup -g 1000 angular && \
    adduser -u 1000 -G angular -D angular

WORKDIR /app

# Copie des artefacts de construction
COPY --from=builder --chown=angular:angular /app/dist ./dist
COPY --from=builder --chown=angular:angular /app/node_modules ./node_modules
COPY --chown=angular:angular package.json .

# Configuration
ENV NODE_ENV production
ENV PORT 4000

EXPOSE 4000

USER angular

CMD ["npm", "run", "serve:ssr"]