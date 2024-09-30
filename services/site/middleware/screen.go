package utils

import (
	data "botgvg/internal"
	"database/sql"
	"encoding/json"
	"net/http"
)

func Screen(database *sql.DB) (listScreen []data.Screen) {
	stmt, err := database.Prepare(`SELECT Screen, DescriptionScreen FROM HouseScreen;`)
	CheckErr("1- Requete DB fonction Screen", err)
	rows, err := stmt.Query()
	CheckErr("2- Requete DB fonction Screen", err)
	for rows.Next() {
		var current_screen data.Screen
		err = rows.Scan(&current_screen.Img, &current_screen.Description)
		CheckErr("3- Requete DB fonction Screen", err)
		listScreen = append(listScreen, current_screen)
	}

	return listScreen
}

func NewScreen(r *http.Request, database *sql.DB) {
	jsonData := r.PostFormValue("data")
	// Parsez les données JSON
	var formData data.Screen
	err := json.Unmarshal([]byte(jsonData), &formData)
	CheckErr("NewScreen: Erreur lors de la lecture des données JSON", err)
	// fmt.Println("formData : ", formData)

	file, header, err := r.FormFile("image")
	if err == nil {
		defer file.Close()

		random := RandomFileName()
		valid := UploadPicture(file, header, "./public/images/screen/"+random+header.Filename)
		if valid {
			if formData.Description == "" { // presence d'une description
				stmt, err := database.Prepare(`INSERT INTO HouseScreen(Screen, DescriptionScreen) VALUES(?, ?);`)
				CheckErr("2- INSERT NewScreen NO Description", err)
				stmt.Exec("./img/screen/"+random+header.Filename, "")
			} else { // absence de description
				stmt, err := database.Prepare(`INSERT INTO HouseScreen(Screen, DescriptionScreen) VALUES(?, ?);`)
				CheckErr("1- INSERT NewScreen Description", err)
				stmt.Exec("./img/screen/"+random+header.Filename, formData.Description)
			}
		}
	}
}
