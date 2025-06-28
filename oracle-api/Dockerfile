# Étape de construction du client Oracle
FROM oraclelinux:8 AS oracle-builder

# Installer les dépendances nécessaires
RUN yum install -y wget && \
    # Télécharger le package RPM directement depuis le site d'Oracle
    wget https://download.oracle.com/otn_software/linux/instantclient/1919000/oracle-instantclient19.19-basiclite-19.19.0.0.0-1.x86_64.rpm && \
    # Installer le client Oracle
    yum localinstall -y oracle-instantclient19.19-basiclite-19.19.0.0.0-1.x86_64.rpm && \
    # Nettoyer
    rm -f oracle-instantclient19.19-basiclite-19.19.0.0.0-1.x86_64.rpm && \
    yum clean all

# Étape de construction de l'application Node.js
FROM node:22-alpine AS app-builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape finale
FROM node:22-alpine

# Création de l'utilisateur non-root
RUN addgroup -g 1001 oracleapp && \
    adduser -u 1001 -G oracleapp -D oracleapp

WORKDIR /app

# Copie du client Oracle depuis le builder
COPY --from=oracle-builder /usr/lib/oracle /usr/lib/oracle
COPY --from=oracle-builder /usr/share/oracle /usr/share/oracle

# Installation des dépendances nécessaires
RUN apk add --no-cache libaio

# Configuration des variables d'environnement Oracle
ENV LD_LIBRARY_PATH /usr/lib/oracle/19.19/client64/lib:$LD_LIBRARY_PATH
ENV ORACLE_HOME /usr/lib/oracle/19.19/client64
ENV PATH $ORACLE_HOME/bin:$PATH

# Copie de l'application Node.js
COPY --from=app-builder --chown=oracleapp:oracleapp /app/node_modules ./node_modules
COPY --from=app-builder --chown=oracleapp:oracleapp /app/dist ./dist
COPY --chown=oracleapp:oracleapp package.json .

# Configuration
ENV NODE_ENV production
ENV PORT 1521

EXPOSE 1521

USER oracleapp

CMD ["node", "dist/main"]