###################################
#### APPLICATION SITE INTERNET ####
###################################

FROM golang:1.22.2

# Information sur l'application
LABEL description="Site web LNB de gestion GvG"
LABEL authors="OLIVIER Fabien"
LABEL release-date="Mars 2024"
LABEL version="1.0"

WORKDIR /app
COPY . ./
# RUN go mod download && go build -o /sitelnb cmd/main.go
EXPOSE 8080


# CMD ["/sitelnb"]
CMD [ "go", "run", "./cmd/main.go" ]

# lancement manuel :
# docker build -t sitelnb .
# docker run -d -p 8080:8080 --name site sitelnb
# docker image ls -a