# Pour lancer l'application :
# sudo docker build -t appligvg .


# Utiliser une image Node.js pour l'application Node.js
FROM node:18 AS node_app
LABEL versionBot="3.0"

LABEL description="Site web de gestion GvG pour Conqueror's Blade"
LABEL authors="OLIVIER Fabien"
LABEL release-date="Mars 2024"

WORKDIR /app/bot
COPY ./bot .
RUN npm install

# Utiliser une image Golang pour l'application Go
FROM golang:1.21 AS go_app
LABEL versionSite="1.0"
WORKDIR /app/go
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

# Exposer le port sur lequel l'application Node.js fonctionne (80 or 443 by default)
EXPOSE 80
# Exposer le port de l'application go
EXPOSE 53134

# Commande par défaut pour exécuter supervisord
CMD ["/usr/local/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
