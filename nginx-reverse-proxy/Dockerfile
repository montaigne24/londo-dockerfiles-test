FROM owasp/modsecurity-crs:nginx-alpine

# 1. Créer l'utilisateur non-root avant toute opération
RUN addgroup -g 1000 nginx && \
    adduser -D -u 1000 -G nginx nginx

# 2. Copier les fichiers avec les bonnes permissions
COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx modsecurity.conf /etc/modsecurity.d/modsecurity.conf
# COPY --chown=nginx:nginx crs-setup.conf /etc/modsecurity.d/crs-setup.conf

# 3. Créer les répertoires nécessaires avec les bonnes permissions
RUN mkdir -p /etc/nginx/includes \
    && mkdir -p /etc/nginx/ssl \
    && mkdir -p /var/log/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && chown -R nginx:nginx /var/cache/nginx

# 4. Copier les fichiers supplémentaires
COPY --chown=nginx:nginx includes/ /etc/nginx/includes/
COPY --chown=nginx:nginx ssl/ /etc/nginx/ssl/

# 5. Configurations finales
RUN sed -i "s/SecRuleEngine DetectionOnly/SecRuleEngine On/" /etc/modsecurity.d/modsecurity.conf \
    && echo "SecAuditLog /var/log/nginx/modsec_audit.log" >> /etc/modsecurity.d/modsecurity.conf \
    && sed -i "s/# server_tokens off;/server_tokens off;/g" /etc/nginx/nginx.conf

# 6. Ports et volumes
EXPOSE 80 443
VOLUME ["/var/log/nginx", "/etc/nginx/ssl"]

USER nginx
CMD ["nginx", "-g", "daemon off;"]