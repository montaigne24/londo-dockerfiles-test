FROM nginx:1.25-alpine

# 1. Installation des paquets nécessaires
RUN apk add --no-cache \
    modsecurity \
    modsecurity-nginx \
    openssl \
    certbot \
    certbot-nginx \
    && mkdir -p /etc/nginx/modsec

# 2. Configuration de ModSecurity
COPY modsecurity.conf /etc/nginx/modsec/
COPY includes/ /etc/nginx/includes/
COPY ssl/ /etc/nginx/ssl/

# 3. Configuration Nginx optimisée
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/

# 4. Sécurité et optimisation
RUN sed -i "s/# server_tokens off;/server_tokens off;/g" /etc/nginx/nginx.conf \
    && echo "SecRuleEngine On" >> /etc/nginx/modsec/modsecurity.conf \
    && echo "SecAuditLog /var/log/nginx/modsec_audit.log" >> /etc/nginx/modsec/modsecurity.conf \
    && echo "include /etc/nginx/modsec/modsecurity.conf" > /etc/nginx/modsec/main.conf

# 5. Création d'un utilisateur non-root
RUN addgroup -g 1000 nginx \
    && adduser -D -u 1000 -G nginx nginx \
    && chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && chown -R nginx:nginx /etc/nginx

# 6. Configuration des volumes et ports
VOLUME ["/var/log/nginx", "/etc/nginx/ssl"]
EXPOSE 80 443

# 7. Point d'entrée avec vérification SSL
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER nginx
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]