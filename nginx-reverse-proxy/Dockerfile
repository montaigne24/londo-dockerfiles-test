# Étape de construction
FROM nginx:1.25-alpine AS builder

# Installation des dépendances pour compiler les modules (avec PCRE2)
RUN apk add --no-cache \
    build-base \
    openssl-dev \
    pcre2-dev \
    zlib-dev \
    linux-headers \
    libmaxminddb-dev \
    git \
    wget \
    automake \
    autoconf \
    libtool \
    pkgconf \
    flex \
    bison \
    yajl-dev \
    lmdb-dev \
    libxml2-dev \
    curl-dev \
    geoip-dev

# Compilation de ModSecurity pour WAF
RUN git clone --depth 1 -b v3/master --single-branch https://github.com/SpiderLabs/ModSecurity \
    && cd ModSecurity \
    && git submodule init \
    && git submodule update \
    && ./build.sh \
    && ./configure --with-pcre2 \
    && make \
    && make install

# Téléchargement et compilation de Nginx avec ModSecurity
RUN wget http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz \
    && tar zxvf nginx-${NGINX_VERSION}.tar.gz \
    && cd nginx-${NGINX_VERSION} \
    && ./configure \
        --prefix=/etc/nginx \
        --sbin-path=/usr/sbin/nginx \
        --modules-path=/usr/lib/nginx/modules \
        --with-http_ssl_module \
        --with-http_v2_module \
        --with-http_realip_module \
        --with-http_gunzip_module \
        --with-http_gzip_static_module \
        --with-http_stub_status_module \
        --with-pcre \
        --add-module=../ModSecurity-nginx \
    && make \
    && make install

# Étape finale
FROM nginx:1.25-alpine

# Copie des binaires compilés
COPY --from=builder /usr/sbin/nginx /usr/sbin/nginx
COPY --from=builder /usr/lib/nginx/modules /usr/lib/nginx/modules
COPY --from=builder /usr/local/modsecurity /usr/local/modsecurity

# Installation des dépendances d'exécution
RUN apk add --no-cache \
    libstdc++ \
    libmaxminddb \
    yajl \
    lmdb \
    libxml2 \
    libcurl \
    geoip \
    pcre2 \
    tzdata

# Configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY modsecurity.conf /etc/nginx/modsecurity.conf
COPY includes/ /etc/nginx/includes/
COPY ssl/ /etc/nginx/ssl/

# Création d'un utilisateur non-root
RUN addgroup -g 1000 nginx && \
    adduser -D -u 1000 -G nginx nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx

# Masquer la version de NGINX
RUN sed -i "s/# server_tokens off;/server_tokens off;/g" /etc/nginx/nginx.conf

# Ports
EXPOSE 80 443

# Utilisateur non-root
USER nginx

CMD ["nginx", "-g", "daemon off;"]