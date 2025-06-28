# Étape de construction
FROM nginx:1.25-alpine AS builder

# Installation des dépendances
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

# Clone ModSecurity
RUN git clone --depth 1 -b v3/master --single-branch https://github.com/SpiderLabs/ModSecurity
RUN cd ModSecurity && \
    git submodule init && \
    git submodule update && \
    ./build.sh && \
    ./configure --with-pcre2 && \
    make && \
    make install

# Clone ModSecurity-nginx (le connecteur Nginx)
RUN git clone --depth 1 https://github.com/SpiderLabs/ModSecurity-nginx.git

# Téléchargement et compilation de Nginx
ARG NGINX_VERSION=1.25.3
RUN wget http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz && \
    tar zxvf nginx-${NGINX_VERSION}.tar.gz && \
    cd nginx-${NGINX_VERSION} && \
    ./configure \
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

# Copie des artefacts
COPY --from=builder /usr/sbin/nginx /usr/sbin/nginx
COPY --from=builder /usr/lib/nginx/modules /usr/lib/nginx/modules
COPY --from=builder /usr/local/modsecurity /usr/local/modsecurity
COPY --from=builder /ModSecurity/nginx/modsecurity.conf /etc/nginx/modsecurity.conf

# Dépendances d'exécution
RUN apk add --no-cache \
    libstdc++ \
    libmaxminddb \
    yajl \
    lmdb \
    libxml2 \
    libcurl \
    geoip \
    pcre2 \
    tzdata \
    libmodsecurity

# Configuration
RUN mkdir -p /etc/nginx/modsec && \
    cp /usr/local/modsecurity/lib/libmodsecurity.so.3 /usr/lib/ && \
    echo "include /etc/nginx/modsec/modsecurity.conf" > /etc/nginx/modsec/main.conf && \
    echo "include /etc/nginx/modsec/main.conf" >> /etc/nginx/nginx.conf

# Utilisateur non-root
RUN addgroup -g 1000 nginx && \
    adduser -D -u 1000 -G nginx nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx

# Sécurité
RUN sed -i "s/# server_tokens off;/server_tokens off;/g" /etc/nginx/nginx.conf

EXPOSE 80 443
USER nginx
CMD ["nginx", "-g", "daemon off;"]