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
COPY --from=builder /app/dist/angular-no-ssr/browser /usr/share/nginx/html

# USER root

# # 2. Configurer les permissions nécessaires
# RUN chown -R nginx:nginx /etc/nginx \
#     && chown -R nginx:nginx /var/log/nginx 

# # Configuration NGINX
# COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# USER nginx

# CMD ["nginx", "-g", "daemon off;"]