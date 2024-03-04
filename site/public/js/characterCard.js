import { cookieName } from "./main.js";
import { communBlock } from "./useful.js";

export function characterCard() {
    if (!document.cookie.split(";").some((item) => item.trim().startsWith(cookieName + "="))) {
        window.location.href = '/';
    }
    console.log('ENTER caserne JS')
    // Si le cookie est present, fetch des données. Le back fera une vérification de la validité du cookie
    fetch('http://localhost:53134/api/charactercard')
        .then(response => {
            // Vérifier si la requête a réussi (status code 200)
            if (!response.ok) {
                throw new Error(`Erreur de réseau: ${response.status}`);
            }

            // Convertir la réponse en JSON
            return response.json();
        })
        .then(data => {
            // Traiter les données récupérées
            console.log('Data received (characterCard):', data);
            containerCharacterCard(data);
        })
        .catch(error => {
            // Gérer les erreurs
            console.error('Data recovery error:', error);
        });
}

function containerCharacterCard(data) {
    if (data.Gestion.Logged) {
        communBlock(data);

        let container = document.getElementById('Container');
        let subcontainer = document.createElement('subcontainer');
        subcontainer.className = 'subcontainerProfile';

        let personnage = document.createElement('div');
        personnage.className = 'personnage';
        let titlepersonnage = document.createElement('p');
        titlepersonnage.textContent = 'Informations du héros';
        personnage.appendChild(titlepersonnage);
        let classeplay = document.createElement('div');
        classeplay.textContent = 'Classe : ' + data.UserInfo.GameCharacter;
        personnage.appendChild(classeplay);
        let lvl = document.createElement('div');
        lvl.textContent = 'Niveau : ' + data.UserInfo.Lvl;
        personnage.appendChild(lvl);
        let influence = document.createElement('div');
        influence.innerHTML = 'Influence : ' + data.UserInfo.Influence;
        personnage.appendChild(influence);
        subcontainer.appendChild(personnage);

        let infoGvG = document.createElement('div');
        infoGvG.className = 'infoGvG';
        let titleinfoGvG = document.createElement('p');
        titleinfoGvG.textContent = 'Informations GvG';
        infoGvG.appendChild(titleinfoGvG);
        let nbGvG = document.createElement('div');
        nbGvG.textContent = 'Nombre de gvg participé : ' + data.UserInfo.NbGvGParticiped;
        infoGvG.appendChild(nbGvG);
        let lastGvG = document.createElement('div');
        lastGvG.textContent = 'Derniére gvg participé : ' + data.UserInfo.DateLastGvGParticiped;
        infoGvG.appendChild(lastGvG);
        subcontainer.appendChild(infoGvG);
        container.appendChild(subcontainer);

    } else {
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/';
    }
}