# ouvrir une console avec un nom

screen -R site
cd ./services/site
go run ./cmd/main.go
# CTRL + A puis d pour detacher

screen -R bot
cd ./services/bot
npm install
npm start
# CTRL + A puis d pour detacher

# https://caddyserver.com/docs/install
screen -R caddy
caddy
# CTRL + A puis d pour detacher

# Afficher les screens en cours
screen -ls

# Allez sur la console screen du nom
screen -r name

# détruire la console screen du nom
screen -S name -X kill

# détruire toutes les consoles screen
pkill screen

