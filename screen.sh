# ouvrir une console avec un nom

screen -S site
sh ./launch_site.sh
# CTRL + A puis d pour detacher

screen -S bot
sh ./launch_bot.sh
# CTRL + A puis d pour detacher

# https://caddyserver.com/docs/install
screen -S caddy
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

# Pour monitorer, voici les commandes de base de `Screen`
# ```sh
# # Afficher les consoles Screen en cours
# screen -ls

# # Allez sur la console Screen detacher du nom `name`
# screen -r name

# # détruire la console Screen du nom `name`
# screen -S name -X kill
```
