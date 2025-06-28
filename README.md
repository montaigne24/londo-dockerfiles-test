# LONDO Tech - Optimised Docker Stack

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

Ce projet contient une implémentation optimisée des stacks Docker demandées par LONDO Tech, suivant les meilleures pratiques de containerisation.

Fonctionnalités

- **Reverse Proxy Nginx** avec :
  - WAF (ModSecurity)
  - HTTP/2 et HTTPS
  - Compression Gzip
  - Masquage de version
  - Redirection vers les microservices

- **Applications conteneurisées** :
  - Angular avec SSR
  - Angular sans SSR
  - API NestJS
  - API Express
  - Connecteur Oracle Database

- **Bonnes pratiques implémentées** :
  - Multi-stage builds
  - Utilisateurs non-root
  - Minimisation des images
  - Sécurité renforcée
  - Health checks
  - Gestion optimisée du cache

## Structure du projet
├── angular-no-ssr/ # Application Angular sans SSR
│ ├── Dockerfile # Build optimisé avec Nginx
│ ├── nginx.conf # Configuration Nginx
│ └── ... # Code source Angular
├── angular-ssr/ # Application Angular avec SSR
│ ├── Dockerfile # Build multi-stage
│ └── ... # Code source Angular Universal
├── express/ # API Express
│ ├── Dockerfile # Build optimisé Node.js
│ └── ... # Code source Express
├── nestjs/ # API NestJS
│ ├── Dockerfile # Build optimisé Node.js
│ └── ... # Code source NestJS
├── nginx-reverse-proxy/ # Reverse Proxy
│ ├── Dockerfile # Build custom avec ModSecurity
│ ├── nginx.conf # Configuration principale
│ ├── modsecurity.conf # Règles WAF
│ ├── includes/ # Configurations supplémentaires
│ └── ssl/ # Certificats TLS
├── oracle-api/ # Connecteur Oracle
│ ├── Dockerfile # Avec client Oracle officiel
│ └── ... # Code source de l'API
└── docker-compose.yml # Orchestration complète


## Installation

1. **Prérequis** :
   - Docker Engine 20.10+
   - Docker Compose 2.0+
   - 4GB de RAM minimum (8GB recommandé pour Oracle)

2. **Lancer l'infrastructure** :
   ```bash
   docker-compose up -d --build

3. **Arrêter l'infrastructure** :
```bash
   docker-compose down


Accès aux services
Nginx       Proxy	https://localhost	443	Point d'entrée principal
Angular     SSR	http://angular-ssr	4000	Version SSR
Angular     No-SSR	http://angular-app	80	Version statique
NestJS      API	http://nestjs-api	3000	API NestJS
Express        API	http://express-api	8080	API Express
Oracle Database	    oracle-api:1521	1521	Instance Oracle

Sécurité
Tous les containers s'exécutent avec des utilisateurs non-root

WAF (ModSecurity) activé avec règles OWASP CRS

Version de Nginx masquée

Isolation réseau entre frontend/backend

Healthchecks pour tous les services

Bonnes pratiques implémentées
Optimisation des images :

Utilisation d'images Alpine

Multi-stage builds

Nettoyage des caches

Sécurité :

No-new-privileges

Read-only filesystem quand possible

Secrets management (à implémenter en prod)

Performance :

Cache Docker optimisé

Compression HTTP

HTTP/2 activé

Observabilité :

Healthchecks

Logging structuré

Métriques exposées
