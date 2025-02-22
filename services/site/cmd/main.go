package main

import (
	handlers "botgvg/handlers"
	data "botgvg/internal"
	"flag"
	"fmt"
	"net/http"
)

func main() {
	// Initialisation database
	data.Createdb()

	flag.Parse()
	// Page not connected
	http.HandleFunc("/", handlers.ServeHome)

	// page de transition de connexion
	http.HandleFunc("/discord", handlers.DiscordHandler)
	http.HandleFunc("/api/discord", handlers.DiscordApiHandler)

	// Page de connexion app mobile
	// http.HandleFunc("/authdiscordappmobile", handlers.DiscordAppApiHandler)
	http.HandleFunc("/api/discordapp", handlers.DiscordApiHandler)

	// Pour le Google Play Store
	http.HandleFunc("/app/reglesdeconfidentialite", handlers.Reglesdeconfidentialite)

	// page Application mobile
	http.HandleFunc("/app/login", handlers.AppMobileHandler)
	http.HandleFunc("/app/user", handlers.AppMobileHandler)
	http.HandleFunc("/app/caserne", handlers.AppMobileHandler)
	http.HandleFunc("/app/updatecaserne", handlers.AppMajCaserneHandler)
	http.HandleFunc("/app/charactercard", handlers.AppMobileHandler)
	http.HandleFunc("/app/updatecharactercard", handlers.AppMobileHandler)
	http.HandleFunc("/app/updateinscription", handlers.AppMobileHandler)

	// page user connected/autorised
	http.HandleFunc("/api/home", handlers.ApiHandler)
	http.HandleFunc("/api/charactercard", handlers.ApiHandler)
	http.HandleFunc("/api/caserne", handlers.ApiHandler)
	http.HandleFunc("/api/majcaserne", handlers.ApiHandler)
	http.HandleFunc("/api/creategroup", handlers.ApiHandler)
	http.HandleFunc("/api/chargergrouptypeatt", handlers.ApiHandler)
	http.HandleFunc("/api/chargergrouptypedef", handlers.ApiHandler)
	http.HandleFunc("/api/CheckAppAdmin", handlers.ApiHandler)
	http.HandleFunc("/api/statGvG", handlers.ApiHandler)
	http.HandleFunc("/api/consulcaserne", handlers.ApiHandler)
	http.HandleFunc("/api/majspecificcaserne", handlers.ApiHandler)
	http.HandleFunc("/api/screenhouse", handlers.ApiHandler)

	http.HandleFunc("/api/logout", handlers.ApiWithoutReturnHandler)
	http.HandleFunc("/api/updateCharacterCard", handlers.ApiWithoutReturnHandler)
	http.HandleFunc("/api/saveGroupInDB", handlers.ApiWithoutReturnHandler)
	http.HandleFunc("/api/UpdateAdmin", handlers.ApiWithoutReturnHandler)
	http.HandleFunc("/api/adminitrateBot", handlers.ApiWithoutReturnHandler)
	http.HandleFunc("/api/newscreenhouse", handlers.ApiWithoutReturnHandler)

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
