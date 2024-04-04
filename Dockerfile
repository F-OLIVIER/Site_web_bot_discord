# Pour lancer l'application :
# sudo docker build -t appligvg .


# Utiliser une image Node.js pour l'application Node.js
FROM node:18 AS node_app
LABEL versionBot="3.0"

LABEL description="Site web de gestion GvG pour Conqueror's Blade"
LABEL authors="OLIVIER Fabien"
LABEL release-date="Mars 2024"

# Définir le répertoire de travail pour l'application Node.js
WORKDIR /app/bot

# Copier le code source de l'application Node.js dans le conteneur
COPY ./bot .

# Installer les dépendances de l'application Node.js
RUN npm install

# Exposer le port sur lequel l'application Node.js fonctionne
EXPOSE 53134

# Utiliser une image Golang pour l'application Go
FROM golang:1.21 AS go_app
LABEL versionSite="1.0"

# Définir le répertoire de travail pour l'application Go
WORKDIR /app/go

# Copier le code source de l'application Go dans le conteneur
COPY . .

# Compiler l'application Go
RUN go build -o main ./cmd/main.go

# Exécuter les deux applications simultanément avec supervisord
FROM python:alpine

# Installation de supervisord
RUN pip install supervisor

# Copier les fichiers de configuration supervisord
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copier les applications Node.js et Go
COPY --from=node_app /app/bot /app/bot
COPY --from=go_app /app/go/main /app/go/main

# Exposer le port de l'application Node.js (si nécessaire)
EXPOSE 53134

# Commande par défaut pour exécuter supervisord
CMD ["/usr/local/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
