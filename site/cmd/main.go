package main

import (
	"botgvg/handlers"
	"flag"
	"fmt"
	"log"
	"net/http"
	"time"
)

const port = "53134"

var addr = flag.String("addr", ":"+port, "http service address")

func main() {
	// Initialisation de la database
	// data.Createdb()

	flag.Parse()
	http.HandleFunc("/", handlers.ServeHome)
	http.HandleFunc("/discord", handlers.DiscordHandler)
	http.HandleFunc("/api/discord", handlers.DiscordApiHandler)
	http.HandleFunc("/home", handlers.HomeHandler)

	// En fonction de l'URL, chargement de l'api correspondante
	// http.HandleFunc("/api/Compte", handlers.CompteHandler)
	// http.HandleFunc("/api/ForgetPassword", handlers.ForgetPasswordHandler)

	// Appel des fichiers annexes
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("./public/css/"))))
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("./public/js/"))))
	http.Handle("/public/imgages/", http.StripPrefix("/public/imgages/", http.FileServer(http.Dir("./public/imgages/"))))
	server := &http.Server{
		Addr:              *addr,
		ReadHeaderTimeout: 3 * time.Second,
	}
	fmt.Println("Server started on port " + port + " : http://localhost:" + port)

	err := server.ListenAndServe()
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
