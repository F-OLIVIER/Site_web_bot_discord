###################################
#### APPLICATION SITE INTERNET ####
###################################

FROM golang:1.21

# Information sur l'application
LABEL description="Site web LNB de gestion GvG"
LABEL authors="OLIVIER Fabien"
LABEL release-date="Mars 2024"
LABEL version="1"

WORKDIR /site

# Ajoutez les fichiers go.mod et go.sum
COPY go.mod .
COPY go.sum .
RUN chmod 644 go.mod go.sum

# Téléchargez les dépendances
RUN go mod download

# Copiez le reste du code source
COPY . .

# Compilation de l'appplication
# action option nom_executable emplacement_fichier_main
RUN go build -o /sitelnb cmd/main.go

EXPOSE 53134

# CMD pour lancer l'application Go
CMD ["./sitelnb"]

