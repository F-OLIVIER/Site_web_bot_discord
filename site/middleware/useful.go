package utils

import (
	"fmt"
)

// Vérificateur d'erreurs
func CheckErr(str string, err error) {
	if err != nil {
		fmt.Printf("\n__________________________________________\nERROR : %v\n%v\n", str, err)
	}
}

// Génére une chaine de caractére aéatoire de 12 caractéres alphanumérique
// func RandomFileName() string {
// 	base := "azertyuiopmlkjhgfdsqwxcvbn-0123456789-AZERTYUIOPMLKJHGFDSQWXCVBN"
// 	var randomName string
// 	for i := 0; i < 12; i++ {
// 		num := rand.Intn(len(base))
// 		randomName += string(base[num])
// 	}
// 	return randomName + "_"
// }
