FROM owasp/modsecurity-crs:nginx-alpine

# 1. Utiliser l'utilisateur existant (nginx) de l'image de base
USER root

# 2. Configurer les permissions nécessaires
RUN mkdir -p /etc/nginx/includes \
    && mkdir -p /etc/nginx/ssl \
    && chown -R nginx:nginx /etc/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && chown -R nginx:nginx /var/cache/nginx

# 3. Copier les fichiers de configuration
COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx modsecurity.conf /etc/modsecurity.d/modsecurity.conf
# COPY --chown=nginx:nginx crs-setup.conf /etc/modsecurity.d/crs-setup.conf
COPY --chown=nginx:nginx includes/ /etc/nginx/includes/
COPY --chown=nginx:nginx ssl/ /etc/nginx/ssl/

# 4. Configurations finales
RUN sed -i "s/SecRuleEngine DetectionOnly/SecRuleEngine On/" /etc/modsecurity.d/modsecurity.conf \
    && echo "SecAuditLog /var/log/nginx/modsec_audit.log" >> /etc/modsecurity.d/modsecurity.conf \
    && sed -i "s/# server_tokens off;/server_tokens off;/g" /etc/nginx/nginx.conf

# 5. Retour à l'utilisateur nginx
USER nginx

# 6. Ports et volumes
EXPOSE 80 443
VOLUME ["/var/log/nginx", "/etc/nginx/ssl"]

CMD ["nginx", "-g", "daemon off;"]