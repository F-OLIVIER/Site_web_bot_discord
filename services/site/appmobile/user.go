package appmobile

import (
	data "botgvg/internal"
	utils "botgvg/middleware"
	"database/sql"
)

func UserInfoApp(uuidApp string, database *sql.DB) (user_id string, exist, officier bool) {
	if uuidApp != "" {
		stmt, errdb := database.Prepare("SELECT ID, DiscordRole FROM Users WHERE uuidApp = ?")
		utils.CheckErr("Requete DB UserInfoApp", errdb)
		var DiscordRole string
		// Vérifier si la requête renvoie une ligne
		err := stmt.QueryRow(uuidApp).Scan(&user_id, &DiscordRole)
		// Si erreurs de requête (ex: aucune ligne n'est trouvée)
		if err != nil {
			utils.CheckErr("Erreur lors du Scan de la requête UserInfoApp", err)
			return "", false, false
		}

		// Si un résultat est trouvé
		if DiscordRole == "Officier" {
			return user_id, true, true
		}
		return user_id, true, false
	}
	return "", false, false
}

func CharactercardApp(uuidApp string, login bool, database *sql.DB) (userInfo data.UserInfo) {
	userInfo.CodeApp = uuidApp
	var uuidAppUse = 0

	stmt1, errdb := database.Prepare("SELECT ID, DiscordName, DiscordRole, DiscordPhoto, GameCharacter_ID, Lvl, Influence, EtatInscription, NbGvGParticiped, NbTotalGvG, DateLastGvGParticiped, uuidAppUse FROM Users WHERE uuidApp = ?")
	if errdb != nil {
		utils.CheckErr("1- Requete SELECT DB CharactercardApp", errdb)
		return userInfo
	}

	var DiscordRole string
	stmt1.QueryRow(uuidApp).Scan(&userInfo.ID, &userInfo.DiscordUsername, &DiscordRole, &userInfo.DiscordPhoto, &userInfo.GameCharacter_ID, &userInfo.Lvl, &userInfo.Influence, &userInfo.EtatInscription, &userInfo.NbGvGParticiped, &userInfo.NbTotalGvG, &userInfo.DateLastGvGParticiped, &uuidAppUse)

	if login {
		if uuidAppUse == 0 {
			stmt2, errdb := database.Prepare("UPDATE Users SET uuidAppUse = 1 WHERE uuidApp = ?")
			utils.CheckErr("2- Requete UPDATE DB CharactercardApp", errdb)
			stmt2.Exec(uuidApp)
		} else {
			var noUserInfo data.UserInfo
			noUserInfo.CodeApp = uuidApp
			return noUserInfo
		}
	}

	if userInfo.GameCharacter_ID != 0 {
		stmt2, errdb := database.Prepare("SELECT ClasseFR FROM ListGameCharacter WHERE ID = ?")
		utils.CheckErr("3- Requete SELECT DB CharactercardApp", errdb)
		stmt2.QueryRow(userInfo.GameCharacter_ID).Scan(&userInfo.GameCharacter)
	} else {
		userInfo.GameCharacter = "Non sélectionné"
	}

	return userInfo
}

func UpdateInscription(newUserInfo data.UserInfo, database *sql.DB) bool {
	if newUserInfo.EtatInscription == 1 || newUserInfo.EtatInscription == 3 { // 1: s'incrit present, 3: s'inscrit absent
		stmt3, errdb := database.Prepare("UPDATE Users SET EtatInscription = ? WHERE uuidApp = ?")
		if errdb != nil {
			utils.CheckErr("9- Requete DB UpdateCharacterApp", errdb)
			return false
		}
		stmt3.Exec(newUserInfo.EtatInscription, newUserInfo.CodeApp)
		return true
	}
	return false
}

func UpdateCharacterApp(newUserInfo data.UserInfo, database *sql.DB) bool {
	// Récupération id de la classe jouer
	if newUserInfo.GameCharacter != "" {
		stmt1, errdb := database.Prepare("SELECT ID FROM ListGameCharacter WHERE ClasseFR = ?")
		utils.CheckErr("1- Requete DB UpdateCharacterApp", errdb)
		stmt1.QueryRow(newUserInfo.GameCharacter).Scan(&newUserInfo.GameCharacter_ID)
	}

	if newUserInfo.Influence != "" && newUserInfo.Lvl != "" && newUserInfo.GameCharacter != "" {
		// les 3 sont saisies (Class + Lvl + Influence)
		stmt2, errdb := database.Prepare("UPDATE Users SET GameCharacter_ID = ?, Lvl = ?, Influence = ? WHERE uuidApp = ?")
		utils.CheckErr("2- Requete DB UpdateCharacterApp", errdb)
		stmt2.Exec(newUserInfo.GameCharacter_ID, newUserInfo.Lvl, newUserInfo.Influence, newUserInfo.CodeApp)
	} else if newUserInfo.Influence != "" && newUserInfo.Lvl != "" {
		// Lvl + Influence
		stmt2, errdb := database.Prepare("UPDATE Users SET Lvl = ?, Influence = ? WHERE uuidApp = ?")
		utils.CheckErr("3- Requete DB UpdateCharacterApp", errdb)
		stmt2.Exec(newUserInfo.Lvl, newUserInfo.Influence, newUserInfo.CodeApp)
	} else if newUserInfo.Influence != "" && newUserInfo.GameCharacter != "" {
		// Class + Influence
		stmt2, errdb := database.Prepare("UPDATE Users SET GameCharacter_ID = ?, Influence = ? WHERE uuidApp = ?")
		utils.CheckErr("4- Requete DB UpdateCharacterApp", errdb)
		stmt2.Exec(newUserInfo.GameCharacter_ID, newUserInfo.Influence, newUserInfo.CodeApp)
	} else if newUserInfo.Lvl != "" && newUserInfo.GameCharacter != "" {
		// Class + Lvl
		stmt2, errdb := database.Prepare("UPDATE Users SET GameCharacter_ID = ?, Lvl = ? WHERE uuidApp = ?")
		utils.CheckErr("5- Requete DB UpdateCharacterApp", errdb)
		stmt2.Exec(newUserInfo.GameCharacter_ID, newUserInfo.Lvl, newUserInfo.CodeApp)
	} else if newUserInfo.GameCharacter != "" {
		// Class
		stmt2, errdb := database.Prepare("UPDATE Users SET GameCharacter_ID = ? WHERE uuidApp = ?")
		utils.CheckErr("6- Requete DB UpdateCharacterApp", errdb)
		stmt2.Exec(newUserInfo.GameCharacter_ID, newUserInfo.CodeApp)
	} else if newUserInfo.Lvl != "" {
		// Lvl
		stmt2, errdb := database.Prepare("UPDATE Users SET Lvl = ? WHERE uuidApp = ?")
		utils.CheckErr("7- Requete DB UpdateCharacterApp", errdb)
		stmt2.Exec(newUserInfo.Lvl, newUserInfo.CodeApp)
	} else if newUserInfo.Influence != "" {
		// Influence
		stmt2, errdb := database.Prepare("UPDATE Users SET Influence = ? WHERE uuidApp = ?")
		utils.CheckErr("8- Requete DB UpdateCharacterApp", errdb)
		stmt2.Exec(newUserInfo.Influence, newUserInfo.CodeApp)
	}

	return false
}
