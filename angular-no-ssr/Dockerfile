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
COPY --from=builder /app/dist/angular-no-ssr /usr/share/nginx/html

# Configuration NGINX
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Création des répertoires nécessaires avec les bonnes permissions
RUN mkdir -p /var/cache/nginx && \
    mkdir -p /var/run && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/run && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /var/cache/nginx && \
    touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid

# Suppression de la directive 'user' si vous utilisez un utilisateur non-root
# (elle sera gérée par la commande USER ci-dessous)

EXPOSE 80

USER nginx

CMD ["nginx", "-g", "daemon off;"]