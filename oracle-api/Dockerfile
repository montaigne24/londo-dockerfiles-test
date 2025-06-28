# Étape de construction du client Oracle
FROM oraclelinux:8-slim AS oracle-builder

# Utilisez yum au lieu de dnf (Oracle Linux 8 utilise yum par défaut)
RUN yum -y install oracle-release-el8 && \
    yum -y install oracle-instantclient19.19-basiclite && \
    rm -rf /var/cache/yum

# Étape de construction de l'application
FROM node:22-alpine AS app-builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Étape finale
FROM node:18-alpine

# Création de l'utilisateur non-root (note: 1000 peut être déjà utilisé, donc 1001)
RUN addgroup -g 1001 oracleapp && \
    adduser -u 1001 -G oracleapp -D oracleapp

WORKDIR /app

# Copie du client Oracle
COPY --from=oracle-builder /usr/lib/oracle /usr/lib/oracle
COPY --from=oracle-builder /usr/share/oracle /usr/share/oracle

# Variables d'environnement pour Oracle
ENV LD_LIBRARY_PATH /usr/lib/oracle/19.19/client64/lib:$LD_LIBRARY_PATH
ENV ORACLE_HOME /usr/lib/oracle/19.19/client64

# Installation des dépendances requises
RUN apk add --no-cache libaio

# Copie de l'application
COPY --from=app-builder --chown=oracleapp:oracleapp /app/node_modules ./node_modules
COPY --from=app-builder --chown=oracleapp:oracleapp /app/dist ./dist
COPY --chown=oracleapp:oracleapp package.json .

# Configuration
ENV NODE_ENV production
ENV PORT 1521

EXPOSE 1521

USER oracleapp

CMD ["node", "dist/main"]