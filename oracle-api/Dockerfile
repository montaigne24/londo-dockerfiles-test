# Étape 1: Récupération du client Oracle depuis l'image officielle
FROM container-registry.oracle.com/database/instantclient:19 as oracle-client

# Étape 2: Construction de l'application Node.js
FROM node:22-alpine as app-builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape finale
FROM node:22-alpine

# Configuration de l'utilisateur non-root
RUN addgroup -g 1001 oracleapp && \
    adduser -u 1001 -G oracleapp -D oracleapp

WORKDIR /app

# Copie du client Oracle depuis l'image officielle
COPY --from=oracle-client /usr/lib/oracle /usr/lib/oracle
COPY --from=oracle-client /usr/share/oracle /usr/share/oracle

# Installation des dépendances nécessaires
RUN apk add --no-cache libaio

# Configuration des variables d'environnement Oracle
ENV LD_LIBRARY_PATH=/usr/lib/oracle/19.8/client64/lib:$LD_LIBRARY_PATH
ENV ORACLE_HOME=/usr/lib/oracle/19.8/client64
ENV PATH=$ORACLE_HOME/bin:$PATH
ENV TNS_ADMIN=$ORACLE_HOME/network/admin

# Copie de l'application construite
COPY --from=app-builder --chown=oracleapp:oracleapp /app/node_modules ./node_modules
COPY --from=app-builder --chown=oracleapp:oracleapp /app/dist ./dist
COPY --chown=oracleapp:oracleapp package.json .

# Configuration finale
ENV NODE_ENV=production
ENV PORT=1521
EXPOSE 1521

USER oracleapp
CMD ["node", "dist/main"]