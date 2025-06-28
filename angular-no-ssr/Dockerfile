# Étape de construction
FROM node:18-alpine AS builder

WORKDIR /app

# Installation des dépendances
COPY package.json package-lock.json ./
RUN npm ci

# Copie des sources et construction
COPY . .
RUN npm run build -- --configuration production

# Étape de serveur web
FROM nginx:1.25-alpine

# Copie des fichiers construits
COPY --from=builder /app/dist/angular-app /usr/share/nginx/html

# Configuration NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Création d'un utilisateur non-root
RUN addgroup -g 1000 nginx && \
    adduser -D -u 1000 -G nginx nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80

USER nginx

CMD ["nginx", "-g", "daemon off;"]