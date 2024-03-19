###################################
#### APPLICATION SITE INTERNET ####
###################################

FROM golang:1.21

# Information sur l'application
LABEL description="Site web LNB de gestion GvG"
LABEL authors="OLIVIER Fabien"
LABEL release-date="Mars 2024"
LABEL version="1.0"

# Créez le répertoire de travail
WORKDIR /site

# Ajoutez les fichiers du code source
COPY . .

# Compilation de l'appplication
RUN go mod download && go build -o /sitelnb cmd/main.go
EXPOSE 53134

# CMD pour lancer l'application Go
CMD ["/sitelnb"]

# lancement manuel :
# docker build -t sitelnb .
# docker run -d -p 53134:53134 --name site sitelnb
# docker image ls -a