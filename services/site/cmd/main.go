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
	// page utilisateur connecté/autorisé
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
	http.HandleFunc("/api/logout", handlers.LogoutHandler)

	// Appel des fichiers annexes et les mettres en cache navigateur client autmatiquement
	cssHandler := http.StripPrefix("/css/", http.FileServer(http.Dir("./public/css/")))
	http.HandleFunc("/css/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "max-age=31536000, only-if-cached")
		cssHandler.ServeHTTP(w, r)
	})

	jsHandler := http.StripPrefix("/js/", http.FileServer(http.Dir("./public/js/")))
	http.HandleFunc("/js/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "max-age=31536000, only-if-cached")
		jsHandler.ServeHTTP(w, r)
	})

	imgHandler := http.StripPrefix("/img/", http.FileServer(http.Dir("./public/images/")))
	http.HandleFunc("/img/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "max-age=31536000, only-if-cached")
		imgHandler.ServeHTTP(w, r)
	})

	fmt.Println("Server started at : http://" + data.SITE_DOMAIN + ":" + data.PORT)

	// Mise en écoute du serveur HTTP
	http.ListenAndServe(":"+data.PORT, nil)
}
