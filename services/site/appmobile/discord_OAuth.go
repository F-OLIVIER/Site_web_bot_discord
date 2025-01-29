package appmobile

import (
	data "botgvg/internal"
	utils "botgvg/middleware"
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/gofrs/uuid"
)

// Mise a jour de la db : ALTER TABLE Users ADD COLUMN uuidApp VARCHAR(50) DEFAULT "";
func CheckUserApp(w http.ResponseWriter, r *http.Request, database *sql.DB) (bool, string) {
	// Récupération des informations du post
	var discordUser data.DiscordUser
	err := json.NewDecoder(r.Body).Decode(&discordUser)
	utils.CheckErr("Erreur de décodage JSON CheckUserApp", err)
	if discordUser.Id != "" {
		var ID string
		stmt, err := database.Prepare("SELECT ID FROM Users WHERE DiscordID = ?")
		utils.CheckErr("db Prepare CheckUserApp : ", err)
		err1 := stmt.QueryRow(discordUser.Id).Scan(&ID)

		if err1 == nil {
			userUUIDApp := uuid.Must(uuid.NewV4())
			uuidApp := userUUIDApp.String()

			newuser_uuidApp, errdb := database.Prepare("UPDATE Users SET uuidApp = ? WHERE DiscordID = ?")
			utils.CheckErr("Requete DB insert uuidApp in CheckUserApp", errdb)
			newuser_uuidApp.Exec(uuidApp, discordUser.Id)

			return true, uuidApp
		}
	}
	return false, ""
}
