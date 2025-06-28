# Étape de construction
FROM node:22-alpine AS builder

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
COPY --from=builder /app/dist/angular-no-ssr /usr/share/nginx/html

# Configuration NGINX
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /tmp/

# Préparation des répertoires avec les bonnes permissions
RUN mkdir -p /var/cache/nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    chmod -R 755 /var/cache/nginx && \
    chown -R nginx:nginx /var/run && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /etc/nginx && \
    mv /tmp/default.conf /etc/nginx/conf.d/default.conf && \
    chown nginx:nginx /etc/nginx/conf.d/default.conf

# Script personnalisé pour contourner le problème de permission
COPY entrypoint.sh /docker-entrypoint.d/99-custom-permissions.sh
RUN chmod +x /docker-entrypoint.d/99-custom-permissions.sh

EXPOSE 80

USER nginx

CMD ["nginx", "-g", "daemon off;"]