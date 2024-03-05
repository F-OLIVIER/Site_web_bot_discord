package data

type DiscordUser struct {
	Id              string `json:"Id"`
	DiscordPhoto    string `json:"Photo"`
	DiscordUsername string `json:"Username"`
}

type UserInfo struct {
	DiscordUsername string `json:"Username"`
	DiscordPhoto    string `json:"Photo"`

	ID                    int
	EtatInscription       int
	GameCharacter_ID      int
	GameCharacter         string `json:"GameCharacter"`
	Lvl                   string `json:"Lvl"`
	Influence             string `json:"Influence"`
	NbTotalGvG            string `json:"NbTotalGvG"`
	NbGvGParticiped       string `json:"NbGvGParticiped"`
	DateLastGvGParticiped string `json:"DateLastGvGParticiped"`
	UserCaserne           []Unit
}

type Gestion struct {
	Logged      bool     `json:"Logged"`
	MsgErr      string   `json:"MsgErr"`
	Redirect    string   `json:"Redirect"`
	Officier    bool     `json:"Officier"`
	BotActivate bool     `json:"BotActivate"`
	ListClass   []string `json:"ListClass"`
}

type Unit struct {
	ID        string `json:"Unit_id"`
	Img       string `json:"Unit_img"`
	Influence string `json:"Unit_influence"`
	Lvl       string `json:"Unit_lvl"`
	LvlMax    string `json:"Unit_lvlMax"`
	Name      string `json:"Unit_name"`
	Type      string `json:"Unit_type"`
	Tier      string `json:"Unit_tier"`
}

type ChangeUnitCaserne struct {
	NewLvlUnitCaserne [][]string `json:"listNewLvlUnitCaserne"`
}

type UserGvG struct {
	User_ID     int
	Username    string `json:"Username"`
	GroupNumber int    `json:"GroupNumber"`
	Unit1       string `json:"Unit1"`
	Unit2       string `json:"Unit2"`
	Unit3       string `json:"Unit3"`
	Unit4       string `json:"Unit4"`
}

type SendHTML struct {
	UserInfo       UserInfo
	ListUnit       []Unit
	Gestion        Gestion
	ListInscripted []UserInfo
	GroupGvG       []UserGvG
}

type SaveGroup struct {
	ListGroup []UserGroup `json:"dataToSend"`
}

type UserGroup struct {
	NameGroup  string   `json:"inputValue"`
	UserToSave []string `json:"selectValues"`
}

type GestionAdministrateBot struct {
	Data AdministrateBot `json:"data"`
	Img  string          `json:"Allumage"`
}

type AdministrateBot struct {
	Allumage   string `json:"Allumage"`
	CreateUnit Unit   `json:"createUnit"`
	ChangeUnit Unit   `json:"changeUnit"`
}
