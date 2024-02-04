package handlers

import (
	data "botgvg/internal"
	utils "botgvg/middleware"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"text/template"

	_ "github.com/mattn/go-sqlite3"
)

// Page d'accueil "/"
func ServeHome(w http.ResponseWriter, r *http.Request) {
	ts, err := template.ParseFiles("./index.html")
	if err != nil {
		log.Fatal(err)
	}
	ts.Execute(w, nil)
}

// page de redirection du logger Discord "/discord"
func DiscordHandler(w http.ResponseWriter, r *http.Request) {
	ts, err := template.ParseFiles("./discord.html")
	if err != nil {
		log.Fatal(err)
	}
	ts.Execute(w, nil)
}

// Check d'exécution de la page "/discord"
func DiscordApiHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" && r.URL.Path == "/api/discord" {
		database, err := sql.Open("sqlite3", "../database/databaseGvG.db")
		utils.CheckErr("open database : ", err)
		defer database.Close()

		var sendHTML *data.SendHTML
		if utils.CheckUser(w, r, database) {
			sendHTML = &data.SendHTML{
				Logged:   true,
				Redirect: "/home",
			}
		} else {
			sendHTML = &data.SendHTML{
				Logged:   false,
				Redirect: "/",
			}
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(sendHTML)
	}
}

// page "/home" (utilisateur connecté)
func HomeHandler(w http.ResponseWriter, r *http.Request) {
	ts, err := template.ParseFiles("./home.html")
	if err != nil {
		log.Fatal(err)
	}
	ts.Execute(w, nil)
}
