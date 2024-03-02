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
