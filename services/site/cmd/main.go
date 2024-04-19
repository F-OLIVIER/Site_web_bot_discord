package main

import (
	handlers "botgvg/handlers"
	data "botgvg/internal"
	"flag"
	"fmt"
	"net/http"
)

func main() {
	// Initialisation de la database
	data.Createdb()

	flag.Parse()
	// home non connecté
	http.HandleFunc("/", handlers.ServeHome)
	// page de transition de connexion
	http.HandleFunc("/discord", handlers.DiscordHandler)
	http.HandleFunc("/api/discord", handlers.DiscordApiHandler)
	// page utilisateur connecté
	http.HandleFunc("/api/home", handlers.HomeHandler)
	http.HandleFunc("/api/charactercard", handlers.CharacterCardHandler)
	http.HandleFunc("/api/updateCharacterCard", handlers.UpdateCharacterCard)
	http.HandleFunc("/api/caserne", handlers.CaserneHandler)
	http.HandleFunc("/api/majcaserne", handlers.MAJCaserneHandler)
	http.HandleFunc("/api/creategroup", handlers.CreateGroupHandler)
	http.HandleFunc("/api/saveGroupInDB", handlers.SaveGroupInDB)
	http.HandleFunc("/api/CheckAppAdmin", handlers.CheckAppAdmin)
	http.HandleFunc("/api/UpdateAdmin", handlers.UpdateAdmin)
	http.HandleFunc("/api/adminitrateBot", handlers.AdminitrateBot)
	http.HandleFunc("/api/statGvG", handlers.StatGvG)

	// Appel des fichiers annexes
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("./public/css/"))))
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("./public/js/"))))
	http.Handle("/img/", http.StripPrefix("/img/", http.FileServer(http.Dir("./public/images/"))))

	fmt.Println("Server started on port " + data.PORT + "\nhttp://localhost:" + data.PORT)

	// Mise en écoute du serveur HTTP
	http.ListenAndServe(":"+data.PORT, nil)
}
