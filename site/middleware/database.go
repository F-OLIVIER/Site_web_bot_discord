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

func Charactercard(uuid string, database *sql.DB) (userInfo data.UserInfo, officier bool) {
	stmt1, errdb := database.Prepare("SELECT ID, DiscordName, DiscordRole, DiscordPhoto, GameCharacter_ID, Lvl, Influence, NbGvGParticiped, NbTotalGvG, DateLastGvGParticiped FROM Users WHERE uuid = ?")
	CheckErr("1- Requete DB UserInfo", errdb)
	var DiscordRole string
	stmt1.QueryRow(uuid).Scan(&userInfo.ID, &userInfo.DiscordUsername, &DiscordRole, &userInfo.DiscordPhoto, &userInfo.GameCharacter_ID, &userInfo.Lvl, &userInfo.Influence, &userInfo.NbGvGParticiped, &userInfo.NbTotalGvG, &userInfo.DateLastGvGParticiped)

	if userInfo.GameCharacter_ID != 0 {
		stmt2, errdb := database.Prepare("SELECT ClasseFR FROM ListGameCharacter WHERE ID = ?")
		CheckErr("2- Requete DB UserInfo", errdb)
		stmt2.QueryRow(userInfo.GameCharacter_ID).Scan(&userInfo.GameCharacter)
	} else {
		userInfo.GameCharacter = "Non sélectionné"
	}

	if DiscordRole == "Officier" {
		return userInfo, true
	}
	return userInfo, false
}

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
	listUnit, err := database.Prepare(`SELECT User_ID, GroupNumber, Unit1, Unit2, Unit3, Unit4 FROM GroupGvG`)
	CheckErr("1- Requete DB fonction GroupGvG", err)
	rows, err := listUnit.Query()
	CheckErr("2- Requete DB fonction GroupGvG", err)
	for rows.Next() {
		var user data.UserGvG
		err = rows.Scan(&user.User_ID, &user.GroupNumber, &user.Unit1, &user.Unit2, &user.Unit3, &user.Unit4)
		CheckErr("3- Requete DB fonction GroupGvG", err)

		stmt, errdb := database.Prepare("SELECT DiscordName FROM Users WHERE ID = ?")
		CheckErr("4- Requete DB fonction GroupGvG", errdb)
		stmt.QueryRow(user.User_ID).Scan(&user.Username)

		listUserAlreadyRegistered = append(listUserAlreadyRegistered, user)
	}
	// fmt.Println("\nlistUserAlreadyRegistered : \n", listUserAlreadyRegistered)

	return listUserAlreadyRegistered
}

func BotActivation(database *sql.DB) bool {
	usedcookie, errdb := database.Prepare("SELECT Allumage FROM GestionBot WHERE ID = ?")
	CheckErr("Requete DB UserInfo", errdb)
	var Allumage int
	usedcookie.QueryRow(1).Scan(&Allumage)

	if Allumage == 0 {
		return true
	} else {
		return false
	}
}
