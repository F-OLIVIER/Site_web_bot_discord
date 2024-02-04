package data

type DiscordUser struct {
	Id              string `json:"Id"`
	DiscordPhoto    string `json:"Photo"`
	DiscordUsername string `json:"Username"`
}

type SendHTML struct {
	DiscordUsername string `json:"Username"`
	MsgErr          string `json:"MsgErr"`
	Logged          bool   `json:"Logged"`
	Redirect        string `json:"Redirect"`
}
