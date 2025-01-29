package handlers

import (
	"botgvg/appmobile"
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

var tb = utils.NewTokenBucket(5, 5)

// Home page "/"
func ServeHome(w http.ResponseWriter, r *http.Request) {
	if tb.Request(1) {
		ts, err := template.ParseFiles("./index.html")
		if err != nil {
			log.Fatal(err)
		}
		ts.Execute(w, nil)
	}
}

// Discord transition page "/discord"
func DiscordHandler(w http.ResponseWriter, r *http.Request) {
	if tb.Request(1) {
		ts, err := template.ParseFiles("./discord.html")
		if err != nil {
			log.Fatal(err)
		}
		ts.Execute(w, nil)
	}
}

// Discord transition, user connects
func DiscordApiHandler(w http.ResponseWriter, r *http.Request) {
	if tb.Request(1) {
		if r.Method == "POST" {
			var sendHTML *data.SendHTML

			switch r.URL.Path {
			case "/api/discord":
				database, err := sql.Open("sqlite3", data.ADRESS_DB)
				utils.CheckErr("open db in DiscordApiHandler discord", err)
				defer database.Close()

				if utils.CheckUser(w, r, database) { // user connects
					gestion := &data.Gestion{
						Logged:   true,
						Redirect: "/home",
					}
					sendHTML = &data.SendHTML{
						Gestion: *gestion,
					}
				} else { // Connection failed
					gestion := &data.Gestion{
						Logged:   false,
						Redirect: "/",
					}
					sendHTML = &data.SendHTML{
						Gestion: *gestion,
					}
				}

			// case "/api/discordapp":
			// 	database, err := sql.Open("sqlite3", data.ADRESS_DB)
			// 	utils.CheckErr("open db in DiscordApiHandler discord", err)
			// 	defer database.Close()

			// 	validuser, uuidApp := appmobile.CheckUserApp(w, r, database)

			// 	if validuser { // user connects
			// 		gestion := &data.Gestion{
			// 			Logged:  true,
			// 			CodeApp: uuidApp,
			// 		}
			// 		sendHTML = &data.SendHTML{
			// 			Gestion: *gestion,
			// 		}
			// 	} else { // Connection failed
			// 		gestion := &data.Gestion{
			// 			Logged:  false,
			// 			CodeApp: "",
			// 		}
			// 		sendHTML = &data.SendHTML{
			// 			Gestion: *gestion,
			// 		}
			// 	}

			default:
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
	}
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	if tb.Request(1) {
		_, err := r.Cookie("user_token")
		if err != http.ErrNoCookie {
			database, err := sql.Open("sqlite3", data.ADRESS_DB)
			utils.CheckErr("open db in homehandler", err)
			defer database.Close()
			utils.Logout(w, r, database)
		}
	}
}

func ApiWithoutReturnHandler(w http.ResponseWriter, r *http.Request) {
	if tb.Request(1) {
		// Readcookie
		cookie, err1 := r.Cookie("user_token")

		if err1 != http.ErrNoCookie && r.Method == "POST" {
			// Open database
			database, err := sql.Open("sqlite3", data.ADRESS_DB)
			utils.CheckErr("open db in homehandler", err)
			defer database.Close()

			if !utils.CheckToken(utils.Sessions, cookie) { // If cookies not valid
				utils.Logout(w, r, database)
			} else { // If cookies valid
				_, _, _, officier := utils.UserInfo(cookie.Value, database)
				if officier { // If user has the right to modify
					switch r.URL.Path {
					case "/api/adminitrateBot":
						utils.UploadInformationsBot(r, database)

					case "/api/UpdateAdmin":
						utils.UpdateAdministration(r, database)

					case "/api/updateCharacterCard":
						utils.UpdateCharacter(r, cookie.Value, database)

					case "/api/saveGroupInDB":
						utils.SaveCreateGroup(r, database)

					case "/api/newscreenhouse":
						utils.NewScreen(r, database)

					default:
						fmt.Println("Error r.URL.Path in ApiReturnHandler (handlers line 124) : ", r.URL.Path)
					}
				}
			}
		}
	}
}

func ApiHandler(w http.ResponseWriter, r *http.Request) {
	if tb.Request(1) {
		var sendHTML *data.SendHTML
		// Read cookie
		cookie, err1 := r.Cookie("user_token")

		// Open database
		database, err := sql.Open("sqlite3", data.ADRESS_DB)
		utils.CheckErr("open db in homehandler", err)
		defer database.Close()

		if err1 != http.ErrNoCookie { // If cookie
			if !utils.CheckToken(utils.Sessions, cookie) { // If cookie not valid
				utils.Logout(w, r, database)
				gestion := &data.Gestion{
					Logged:   false,
					Redirect: "/",
				}
				sendHTML = &data.SendHTML{
					Gestion: *gestion,
				}
			} else { // If cookie valid
				// User information
				userID, DiscordName, DiscordPhoto, officier := utils.UserInfo(cookie.Value, database)

				// Information to send
				userInfo := &data.UserInfo{
					DiscordUsername: DiscordName,
					DiscordPhoto:    DiscordPhoto,
				}
				gestion := &data.Gestion{
					Logged:      true,
					Officier:    officier,
					BotActivate: utils.BotActivation(database),
				}
				sendHTML = &data.SendHTML{
					UserInfo: *userInfo,
				}

				// Additional information to be sent depending on the page
				switch r.URL.Path {
				case "/api/statGvG":
					sendHTML.ListInscripted = utils.SendStatGvG(database)

				case "/api/CheckAppAdmin":
					sendHTML.ListUnit = utils.CaserneUser(userID, database)
					sendHTML.ListInscripted = utils.SendStatGvG(database)

				case "/api/charactercard":
					gestion.ListClass = utils.ListClass(database)
					sendHTML.UserInfo = utils.Charactercard(cookie.Value, database)

				case "/api/majcaserne":
					if r.Method == "POST" {
						utils.MAJCaserne(r, userID, database)
						gestion.Redirect = "/caserne"
					} else {
						return
					}

				case "/api/majspecificcaserne":
					if r.Method == "POST" {
						utils.MAJCaserne(r, "0", database)
						gestion.Redirect = "/consulcaserne"
					} else {
						return
					}

				case "/api/creategroup":
					sendHTML.ListInscripted = utils.ListInscriptedUsers(database)
					sendHTML.ListUnit = utils.CaserneUser(userID, database)
					sendHTML.GroupGvG = utils.GroupGvG(database, "GroupGvG")
					sendHTML.NameGroupGvG = utils.NameGroupGvG(database)

				case "/api/chargergrouptypeatt":
					sendHTML.ListInscripted = utils.ListInscriptedUsers(database)
					sendHTML.GroupGvG = utils.GroupGvG(database, "GroupTypeAtt")
					sendHTML.NameGroupGvG = utils.NameGroupGvG(database)

				case "/api/chargergrouptypedef":
					sendHTML.ListInscripted = utils.ListInscriptedUsers(database)
					sendHTML.GroupGvG = utils.GroupGvG(database, "GroupTypeDef")
					sendHTML.NameGroupGvG = utils.NameGroupGvG(database)

				case "/api/caserne":
					sendHTML.ListUnit = utils.CaserneUser(userID, database)

				case "/api/consulcaserne":
					if officier {
						sendHTML.ListUnit = utils.CaserneUser(userID, database)
						sendHTML.ListInscripted = utils.AllCaserne(database)
					}

				case "/api/screenhouse":
					sendHTML.Screen = utils.Screen(database)

				case "/api/home":
					// Nothing to add

				default:
					fmt.Println("Error r.URL.Path in ApiHandler (handlers line 228) : ", r.URL.Path)
				}

				sendHTML.Gestion = *gestion
			}
		} else { // No cookie
			utils.Logout(w, r, database)
			gestion := &data.Gestion{
				Logged:   false,
				Redirect: "/",
			}
			sendHTML = &data.SendHTML{
				Gestion: *gestion,
			}
		}
		// Sending reply
		jsonData, err := json.Marshal(sendHTML)
		if err != nil {
			fmt.Println(err)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	}
}

// ---------------------------------------------------------------------------
// .█████  ██████  ██████      ███    ███  ██████  ██████  ██ ██      ███████
// ██   ██ ██   ██ ██   ██     ████  ████ ██    ██ ██   ██ ██ ██      ██
// ███████ ██████  ██████      ██ ████ ██ ██    ██ ██████  ██ ██      █████
// ██   ██ ██      ██          ██  ██  ██ ██    ██ ██   ██ ██ ██      ██
// ██   ██ ██      ██          ██      ██  ██████  ██████  ██ ███████ ███████
// ---------------------------------------------------------------------------

func AppMobileHandler(w http.ResponseWriter, r *http.Request) {
	// en-têtes CORS
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		// Répondre aux requêtes OPTIONS (pré-vol)
		w.WriteHeader(http.StatusOK)
		return
	}

	if tb.Request(1) {
		// Open database
		database, errdb := sql.Open("sqlite3", data.ADRESS_DB)
		utils.CheckErr("open db in homehandler", errdb)
		defer database.Close()

		// Récupération des informations du post
		var userInfo data.UserInfo
		errjson := json.NewDecoder(r.Body).Decode(&userInfo)
		utils.CheckErr("Erreur de décodage JSON CheckUserApp", errjson)

		// fmt.Println("\nr.URL.Path :", r.URL.Path)
		// fmt.Println("userInfo reçu :\n", userInfo)

		var sendHTML *data.SendHTML

		userID, exit, officier := appmobile.UserInfoApp(userInfo.CodeApp, database)
		if exit {
			gestion := &data.Gestion{
				Logged:      true,
				Officier:    officier,
				BotActivate: utils.BotActivation(database),
			}

			switch r.URL.Path {
			case "/app/login":
				gestion.ListClass = utils.ListClass(database)
				sendHTML = &data.SendHTML{
					Gestion:  *gestion,
					UserInfo: appmobile.CharactercardApp(userInfo.CodeApp, true, database),
				}

			case "/app/user":
				gestion.ListClass = utils.ListClass(database)
				sendHTML = &data.SendHTML{
					Gestion:  *gestion,
					UserInfo: appmobile.CharactercardApp(userInfo.CodeApp, false, database),
				}

			case "/app/caserne":
				sendHTML = &data.SendHTML{
					Gestion:  *gestion,
					ListUnit: utils.CaserneUser(userID, database),
				}

			case "/app/updatecharactercard":
				// Mise a jour personnage
				gestion.Valid = appmobile.UpdateCharacterApp(userInfo, database)

				// retour nouvelle information
				sendHTML = &data.SendHTML{
					Gestion:  *gestion,
					UserInfo: appmobile.CharactercardApp(userInfo.CodeApp, false, database),
				}

			case "/app/updateinscription":
				gestion.Valid = appmobile.UpdateInscription(userInfo, database)

				sendHTML = &data.SendHTML{
					Gestion: *gestion,
				}

			default:
				fmt.Println("Error r.URL.Path in AppMobileHandler (handlers line 299) : ", r.URL.Path)
			}

		} else {
			gestion := &data.Gestion{
				Logged: false,
			}
			sendHTML = &data.SendHTML{
				Gestion: *gestion,
			}
		}

		// Sending reply
		jsonData, err := json.Marshal(sendHTML)
		if err != nil {
			fmt.Println(err)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	}
}

// Maj de la caserne
func AppMajCaserneHandler(w http.ResponseWriter, r *http.Request) {
	// en-têtes CORS
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		// Répondre aux requêtes OPTIONS (pré-vol)
		w.WriteHeader(http.StatusOK)
		return
	}

	if tb.Request(1) {
		// Open database
		database, errdb := sql.Open("sqlite3", data.ADRESS_DB)
		utils.CheckErr("open db in homehandler", errdb)
		defer database.Close()

		if r.Method == "POST" && r.URL.Path == "/app/updatecaserne" {

			var newCaserne data.ChangeUnitCaserne
			err := json.NewDecoder(r.Body).Decode(&newCaserne)
			utils.CheckErr("Erreur de décodage JSON MAJCaserne", err)
			// fmt.Println("newCaserne reçu : ", newCaserne)

			// Mise à jour caserne
			appmobile.UpdateAppCaserne(newCaserne, database)
		}
	}
}
