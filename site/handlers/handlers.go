package handlers

import (
	data "botgvg/internal"
	utils "botgvg/middleware"
	"database/sql"
	"encoding/json"
	"fmt"
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

// page de transition discord
func DiscordHandler(w http.ResponseWriter, r *http.Request) {
	ts, err := template.ParseFiles("./discord.html")
	if err != nil {
		log.Fatal(err)
	}
	ts.Execute(w, nil)
}

// Check d'exécution de la page "/discord"
func DiscordApiHandler(w http.ResponseWriter, r *http.Request) {
	// fmt.Println("ENTER DiscordApiHandler")

	var sendHTML *data.SendHTML
	if r.Method == "POST" && r.URL.Path == "/api/discord" {
		// ouverture database
		database, err := sql.Open("sqlite3", "../database/databaseGvG.db")
		utils.CheckErr("open db in homehandler", err)
		defer database.Close()

		if utils.CheckUser(w, r, database) { // l'utilisateur se connecte
			gestion := &data.Gestion{
				Logged:   true,
				Redirect: "/home",
			}
			sendHTML = &data.SendHTML{
				Gestion: *gestion,
			}
		} else { // conexion echoué
			gestion := &data.Gestion{
				Logged:   false,
				Redirect: "/",
			}
			sendHTML = &data.SendHTML{
				Gestion: *gestion,
			}
		}
	} else { // pasen méthode POST
		gestion := &data.Gestion{
			Logged:   false,
			Redirect: "/",
		}

		sendHTML = &data.SendHTML{
			Gestion: *gestion,
		}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(sendHTML)
}

// page "/home" (utilisateur connecté)
func HomeHandler(w http.ResponseWriter, r *http.Request) {
	// fmt.Println("ENTER HomeHandler")

	var sendHTML *data.SendHTML
	// lecture du cookie
	cookie, err1 := r.Cookie("user_token")
	if r.URL.Path == "/api/home" && err1 != http.ErrNoCookie {
		database, err := sql.Open("sqlite3", "../database/databaseGvG.db")
		utils.CheckErr("open db in homehandler", err)
		defer database.Close()

		// récupération des informations utilisateur
		_, DiscordName, DiscordPhoto, officier := utils.UserInfo(cookie.Value, database)

		// Vérification de la validité du cookie
		if !utils.CheckToken(utils.Sessions, cookie) { // si cookie non valide
			utils.Logout(w, r, database)
			gestion := &data.Gestion{
				Logged:   false,
				Redirect: "/",
			}
			sendHTML = &data.SendHTML{
				Gestion: *gestion,
			}
		} else { // si cookies valide
			userInfo := &data.UserInfo{
				DiscordUsername: DiscordName,
				DiscordPhoto:    DiscordPhoto,
			}
			gestion := &data.Gestion{
				Logged:   true,
				Officier: officier,
			}
			sendHTML = &data.SendHTML{
				Gestion:  *gestion,
				UserInfo: *userInfo,
			}
		}
	} else { // absence de cookie
		fmt.Println("probléme cookie")
		gestion := &data.Gestion{
			Logged:   false,
			Redirect: "/",
		}

		sendHTML = &data.SendHTML{
			Gestion: *gestion,
		}
	}
	jsonData, err := json.Marshal(sendHTML)
	if err != nil {
		fmt.Println(err)
		return
	}
	// fmt.Println(string(jsonData))
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

// page "/caserne" (utilisateur connecté)
func CaserneHandler(w http.ResponseWriter, r *http.Request) {
	// fmt.Println("ENTER CaserneHandler")

	var sendHTML *data.SendHTML
	// lecture du cookie
	cookie, err1 := r.Cookie("user_token")
	if r.URL.Path == "/api/caserne" && err1 != http.ErrNoCookie {
		database, err := sql.Open("sqlite3", "../database/databaseGvG.db")
		utils.CheckErr("open db in homehandler", err)
		defer database.Close()

		// récupération des informations utilisateur
		userID, DiscordName, DiscordPhoto, officier := utils.UserInfo(cookie.Value, database)

		// Vérification de la validité du cookie
		if !utils.CheckToken(utils.Sessions, cookie) { // si cookie non valide
			utils.Logout(w, r, database)
			gestion := &data.Gestion{
				Logged:   false,
				Redirect: "/",
			}
			sendHTML = &data.SendHTML{
				Gestion: *gestion,
			}
		} else { // si cookies valide
			caserne := utils.CaserneUser(userID, database)

			userInfo := &data.UserInfo{
				DiscordUsername: DiscordName,
				DiscordPhoto:    DiscordPhoto,
			}
			gestion := &data.Gestion{
				Logged:   true,
				Officier: officier,
			}
			sendHTML = &data.SendHTML{
				Gestion:  *gestion,
				UserInfo: *userInfo,
				ListUnit: caserne,
			}
		}
	} else { // absence de cookie
		gestion := &data.Gestion{
			Logged:   false,
			Redirect: "/",
		}

		sendHTML = &data.SendHTML{
			Gestion: *gestion,
		}
	}
	jsonData, err := json.Marshal(sendHTML)
	if err != nil {
		fmt.Println(err)
		return
	}
	// fmt.Println(string(jsonData))
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

// page "/creategroup" (utilisateur connecté)
func CreateGroupHandler(w http.ResponseWriter, r *http.Request) {
	// fmt.Println("ENTER CreateGroupHandler")

	var sendHTML *data.SendHTML
	// lecture du cookie
	cookie, err1 := r.Cookie("user_token")
	if r.URL.Path == "/api/creategroup" && err1 != http.ErrNoCookie {
		database, err := sql.Open("sqlite3", "../database/databaseGvG.db")
		utils.CheckErr("open db in homehandler", err)
		defer database.Close()

		// récupération des informations utilisateur
		_, DiscordName, DiscordPhoto, officier := utils.UserInfo(cookie.Value, database)

		// Vérification de la validité du cookie
		if !utils.CheckToken(utils.Sessions, cookie) { // si cookie non valide
			utils.Logout(w, r, database)
			gestion := &data.Gestion{
				Logged:   false,
				Redirect: "/",
			}
			sendHTML = &data.SendHTML{
				Gestion: *gestion,
			}
		} else { // si cookies valide
			// TODO: Page création des groupes a faire ici
			userInfo := &data.UserInfo{
				DiscordUsername: DiscordName,
				DiscordPhoto:    DiscordPhoto,
			}
			gestion := &data.Gestion{
				Logged:   true,
				Officier: officier,
			}
			sendHTML = &data.SendHTML{
				Gestion:        *gestion,
				UserInfo:       *userInfo,
				ListInscripted: utils.ListInscriptedUsers(database),
				GroupGvG:       utils.GroupGvG(database),
			}
		}
	} else { // absence de cookie
		gestion := &data.Gestion{
			Logged:   false,
			Redirect: "/",
		}

		sendHTML = &data.SendHTML{
			Gestion: *gestion,
		}
	}
	jsonData, err := json.Marshal(sendHTML)
	if err != nil {
		fmt.Println(err)
		return
	}
	// fmt.Println(string(jsonData))
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func SaveGroupInDB(w http.ResponseWriter, r *http.Request) {
	// fmt.Println("ENTER SaveGroupInDB")

	// lecture du cookie
	cookie, err1 := r.Cookie("user_token")
	if r.URL.Path == "/api/saveGroupInDB" && err1 != http.ErrNoCookie {
		database, err := sql.Open("sqlite3", "../database/databaseGvG.db")
		utils.CheckErr("open db in homehandler", err)
		defer database.Close()

		// Vérification de la validité du cookie
		if !utils.CheckToken(utils.Sessions, cookie) { // si cookie non valide
			utils.Logout(w, r, database)
		} else { // si cookies valide
			utils.SaveCreateGroup(r, database)
		}
	}
}

func MAJCaserneHandler(w http.ResponseWriter, r *http.Request) {
	// fmt.Println("ENTER MAJCaserneHandler")

	var sendHTML *data.SendHTML
	// lecture du cookie
	cookie, err1 := r.Cookie("user_token")
	if r.Method == "POST" && r.URL.Path == "/api/majcaserne" && err1 != http.ErrNoCookie {
		database, err := sql.Open("sqlite3", "../database/databaseGvG.db")
		utils.CheckErr("open db in homehandler", err)
		defer database.Close()

		// récupération des informations utilisateur
		userID, DiscordName, DiscordPhoto, officier := utils.UserInfo(cookie.Value, database)

		// Vérification de la validité du cookie
		if !utils.CheckToken(utils.Sessions, cookie) { // si cookie non valide
			utils.Logout(w, r, database)
			gestion := &data.Gestion{
				Logged:   false,
				Redirect: "/",
			}
			sendHTML = &data.SendHTML{
				Gestion: *gestion,
			}
		} else { // si cookies valide
			utils.MAJCaserne(r, userID, database)
			userInfo := &data.UserInfo{
				DiscordUsername: DiscordName,
				DiscordPhoto:    DiscordPhoto,
			}
			gestion := &data.Gestion{
				Logged:   true,
				Redirect: "/caserne",
				Officier: officier,
			}
			sendHTML = &data.SendHTML{
				Gestion:  *gestion,
				UserInfo: *userInfo,
			}
		}
	} else { // absence de cookie
		gestion := &data.Gestion{
			Logged:   false,
			Redirect: "/",
		}

		sendHTML = &data.SendHTML{
			Gestion: *gestion,
		}
	}
	jsonData, err := json.Marshal(sendHTML)
	if err != nil {
		fmt.Println(err)
		return
	}
	// fmt.Println(string(jsonData))
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func CharacterCardHandler(w http.ResponseWriter, r *http.Request) {
	// fmt.Println("ENTER CharacterCardHandler")

	var sendHTML *data.SendHTML
	// lecture du cookie
	cookie, err1 := r.Cookie("user_token")
	if r.URL.Path == "/api/charactercard" && err1 != http.ErrNoCookie {
		database, err := sql.Open("sqlite3", "../database/databaseGvG.db")
		utils.CheckErr("open db in homehandler", err)
		defer database.Close()

		if !utils.CheckToken(utils.Sessions, cookie) { // si cookie non valide
			utils.Logout(w, r, database)
			gestion := &data.Gestion{
				Logged:   false,
				Redirect: "/",
			}
			sendHTML = &data.SendHTML{
				Gestion: *gestion,
			}
		} else { // si cookies valide
			userInfo, officier := utils.Charactercard(cookie.Value, database)
			gestion := &data.Gestion{
				Logged:   true,
				Officier: officier,
			}
			sendHTML = &data.SendHTML{
				Gestion:  *gestion,
				UserInfo: userInfo,
			}
		}
	} else { // absence de cookie
		gestion := &data.Gestion{
			Logged:   false,
			Redirect: "/",
		}

		sendHTML = &data.SendHTML{
			Gestion: *gestion,
		}
	}
	jsonData, err := json.Marshal(sendHTML)
	if err != nil {
		fmt.Println(err)
		return
	}
	// fmt.Println(string(jsonData))
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

// // Récupération des informations du post
// var discordUser data.DiscordUser
// err := json.NewDecoder(r.Body).Decode(&discordUser)
// utils.CheckErr("Erreur de décodage JSON CheckUser", err)

// // génére les données json pour repondre au fetch
// jsonData, err := json.Marshal(sendHTML)
// if err != nil {
// 	fmt.Println(err)
// 	return
// }
// // fmt.Println(string(jsonData))
// w.Header().Set("Content-Type", "application/json")
// w.Write(jsonData)
