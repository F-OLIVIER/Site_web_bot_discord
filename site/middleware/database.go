package utils

import (
	data "botgvg/internal"
	"database/sql"
	"strconv"

	_ "github.com/mattn/go-sqlite3"
)

// Fonction qui récupérer les informations utilisateur à partir de son uuid
// user_id, DiscordName, DiscordPhoto, officier := UserInfo(uuid, database)
func UserInfo(uuid string, database *sql.DB) (user_id, DiscordName, DiscordPhoto string, officier bool) {
	if uuid != "" {
		usedcookie, errdb := database.Prepare("SELECT ID, DiscordName, DiscordRole, DiscordPhoto FROM Users WHERE uuid = ?")
		CheckErr("Requete DB UserInfo", errdb)
		var DiscordRole string
		usedcookie.QueryRow(uuid).Scan(&user_id, &DiscordName, &DiscordRole, &DiscordPhoto)
		if DiscordRole == "Officier" {
			return user_id, DiscordName, DiscordPhoto, true
		}
	}
	return user_id, DiscordName, DiscordPhoto, false
}

func Charactercard(uuid string, database *sql.DB) (user_id, DiscordName, DiscordPhoto string, officier bool) {
	if uuid != "" {
		usedcookie, errdb := database.Prepare("SELECT ID, DiscordName, DiscordRole, DiscordPhoto, GameCharacter_ID, Lvl, Influence,  FROM Users WHERE uuid = ?")
		CheckErr("Requete DB UserInfo", errdb)
		var DiscordRole string
		usedcookie.QueryRow(uuid).Scan(&user_id, &DiscordName, &DiscordRole, &DiscordPhoto)
		if DiscordRole == "Officier" {
			return user_id, DiscordName, DiscordPhoto, true
		}
	}
	return user_id, DiscordName, DiscordPhoto, false
}

// func CreateGroup(database *sql.DB) {
// 	ListUnit := ListAllUnit(database)
// 	ListInscriptedusers := ListInscriptedUsers(database)
// }

func ListInscriptedUsers(database *sql.DB) (UsersIncripted []data.UserInfo) {
	listUnit, err := database.Prepare(`SELECT ID, GameCharacter_ID, DiscordName, Lvl, Influence, NbGvGParticiped, DateLastGvGParticiped
										FROM Users
										WHERE Users.EtatInscription = '1';
										`)
	CheckErr("1- Requete DB fonction ListInscriptedusers", err)
	rows, err := listUnit.Query()
	CheckErr("2- Requete DB fonction ListInscriptedusers", err)
	for rows.Next() {
		var user data.UserInfo
		err = rows.Scan(&user.ID, &user.GameCharacter_ID, &user.DiscordUsername, &user.Lvl, &user.Influence, &user.NbGvGParticiped, &user.DateLastGvGParticiped)
		CheckErr("3- Requete DB fonction ListInscriptedusers", err)

		if user.GameCharacter_ID != 0 {
			class, errdb := database.Prepare("SELECT ClasseFR FROM ListGameCharacter WHERE ID = ?")
			CheckErr("Requete DB UserInfo", errdb)
			class.QueryRow(user.GameCharacter_ID).Scan(&user.GameCharacter)
		}

		listUnitUser := CaserneUser(strconv.Itoa(user.ID), database)
		var newListunitUser []data.Unit
		for i := 0; i < len(listUnitUser); i++ {
			if listUnitUser[i].Lvl != "" {
				newListunitUser = append(newListunitUser, listUnitUser[i])
			}
		}
		user.UserCaserne = newListunitUser
		UsersIncripted = append(UsersIncripted, user)
	}

	// fmt.Println("UsersIncripted : \n", UsersIncripted)
	return UsersIncripted
}

func GroupGvG(database *sql.DB) (listUserAlreadyRegistered []data.UserGvG) {
	listUnit, err := database.Prepare(`SELECT User_ID, Unit1, Unit2, Unit3, Unit4 FROM GroupGvG`)
	CheckErr("1- Requete DB fonction GroupGvG", err)
	rows, err := listUnit.Query()
	CheckErr("2- Requete DB fonction GroupGvG", err)
	for rows.Next() {
		var user data.UserGvG
		err = rows.Scan(&user.User_ID, &user.Unit1, &user.Unit2, &user.Unit3, &user.Unit4)
		CheckErr("3- Requete DB fonction GroupGvG", err)
		listUserAlreadyRegistered = append(listUserAlreadyRegistered, user)
	}
	// fmt.Println("\nlistUserAlreadyRegistered : \n", listUserAlreadyRegistered)

	return listUserAlreadyRegistered
}
