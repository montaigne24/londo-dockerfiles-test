#!/bin/sh
# /docker-entrypoint.d/99-custom-permissions.sh

# Vérifie et recrée les répertoires temporaires avec les bonnes permissions
mkdir -p /var/cache/nginx/client_temp && \
chown nginx:nginx /var/cache/nginx/client_temp && \
chown nginx:nginx /var/run/nginx.pid && \
chmod 755 /var/run/nginx.pid && \
chmod 755 /var/cache/nginx/client_temp

exec "$@"