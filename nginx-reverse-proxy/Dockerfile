FROM owasp/modsecurity-crs:nginx-alpine

# 1. Configuration personnalisée
COPY nginx.conf /etc/nginx/nginx.conf
COPY modsecurity.conf /etc/modsecurity.d/modsecurity.conf
COPY crs-setup.conf /etc/modsecurity.d/crs-setup.conf
COPY includes/ /etc/nginx/includes/
COPY ssl/ /etc/nginx/ssl/

# 2. Optimisations de sécurité
RUN sed -i "s/SecRuleEngine DetectionOnly/SecRuleEngine On/" /etc/modsecurity.d/modsecurity.conf \
    && echo "SecAuditLog /var/log/nginx/modsec_audit.log" >> /etc/modsecurity.d/modsecurity.conf \
    && sed -i "s/# server_tokens off;/server_tokens off;/g" /etc/nginx/nginx.conf

# 3. Configuration utilisateur non-root
RUN chown -R nginx:nginx /etc/nginx /var/log/nginx /var/cache/nginx

# 4. Ports et volumes
EXPOSE 80 443
VOLUME ["/var/log/nginx", "/etc/nginx/ssl"]

USER nginx
CMD ["nginx", "-g", "daemon off;"]