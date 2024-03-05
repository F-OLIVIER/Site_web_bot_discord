import { adressAPI } from "./home.js";
import { cookieName } from "./main.js";
import { communBlock } from "./useful.js";

export function characterCard() {
    if (!document.cookie.split(";").some((item) => item.trim().startsWith(cookieName + "="))) {
        window.location.href = '/';
    }
    console.log('ENTER caserne JS')
    // Si le cookie est present, fetch des données. Le back fera une vérification de la validité du cookie
    fetch(adressAPI + 'charactercard')
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
        let titlepersonnage = document.createElement('div');
        titlepersonnage.className = 'titlepersonnage';
        titlepersonnage.textContent = 'Informations du héros';
        personnage.appendChild(titlepersonnage);
        // class
        let classeplay = document.createElement('div');
        classeplay.textContent = 'Classe : ' + data.UserInfo.GameCharacter;
        personnage.appendChild(classeplay);
        let changeClass = document.createElement('div');
        changeClass.className = 'changeClass';
        let titlechangeClass = document.createElement('div');
        titlechangeClass.innerHTML = 'Changer de classe : ';
        changeClass.appendChild(titlechangeClass);
        let selectchangeClass = document.createElement('select');
        let defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.text = "Choisissez";
        selectchangeClass.appendChild(defaultOption);
        for (let i = 0; i < data.Gestion.ListClass.length; i++) {
            let option = document.createElement('option');
            option.value = data.Gestion.ListClass[i];
            option.text = data.Gestion.ListClass[i];
            selectchangeClass.appendChild(option);
        }
        changeClass.appendChild(selectchangeClass);
        personnage.appendChild(changeClass);

        // level
        let lvl = document.createElement('div');
        lvl.textContent = 'Niveau : ' + data.UserInfo.Lvl;
        personnage.appendChild(lvl);
        // influence
        let influence = document.createElement('div');
        influence.innerHTML = 'Influence : ' + data.UserInfo.Influence;
        personnage.appendChild(influence);
        subcontainer.appendChild(personnage);

        // Information GvG
        let infoGvG = document.createElement('div');
        infoGvG.className = 'infoGvG';
        let titleinfoGvG = document.createElement('div');
        titleinfoGvG.className = 'titleinfoGvG';
        titleinfoGvG.textContent = 'Informations GvG';
        infoGvG.appendChild(titleinfoGvG);
        let etatInscripted = document.createElement('div');
        let listButton = document.createElement('div');
        listButton.classList = 'listButton';
        if (data.UserInfo.EtatInscription === 0) {
            etatInscripted.textContent = "⁉️ Vous n'éte pas inscrit pour la prochaine GvG";
            // button present
            let buttonPresent = document.createElement('button');
            buttonPresent.id = 'inscriptedPresent';
            buttonPresent.textContent = "M'inscrire présent"
            listButton.appendChild(buttonPresent);
            // button absent
            let buttonAbsent = document.createElement('button');
            buttonAbsent.id = 'inscriptedAbsent'
            buttonAbsent.textContent = "M'inscrire absent"
            listButton.appendChild(buttonAbsent);
        } else if (data.UserInfo.EtatInscription === 1) {
            etatInscripted.textContent = "✅ Inscrit présent";
            // button absent
            let buttonAbsent = document.createElement('button');
            buttonAbsent.id = 'inscriptedAbsent';
            buttonAbsent.textContent = "M'inscrire absent"
            listButton.appendChild(buttonAbsent);
        } else if (data.UserInfo.EtatInscription === 2) {
            etatInscripted.textContent = "❌ inscrit absent";
            // button present
            let buttonPresent = document.createElement('button');
            buttonPresent.id = 'inscriptedPresent';
            buttonPresent.textContent = "M'inscrire présent"
            listButton.appendChild(buttonPresent);
        }
        infoGvG.appendChild(etatInscripted);
        infoGvG.appendChild(listButton);

        let nbGvG = document.createElement('div');
        nbGvG.textContent = 'Nombre de gvg participé : ' + data.UserInfo.NbGvGParticiped;
        infoGvG.appendChild(nbGvG);
        let lastGvG = document.createElement('div');
        lastGvG.textContent = 'Derniére gvg participé : ' + data.UserInfo.DateLastGvGParticiped;
        infoGvG.appendChild(lastGvG);
        subcontainer.appendChild(infoGvG);
        container.appendChild(subcontainer);

        document.getElementById('inscriptedPresent').addEventListener('click', () => {
            changeInscription(true);
        });

        document.getElementById('inscriptedAbsent').addEventListener('click', () => {
            changeInscription(false);
        });

    } else {
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/';
    }
}

function changeInscription(incripted) {
    let dataToSend = {}
    if (incripted) {
        dataToSend.EtatInscription = 1; // present
    } else {
        dataToSend.EtatInscription = 3; // absent
    }
    fetchData(dataToSend)
}

function fetchData(dataToSend) {
    fetch(adressAPI + 'updateCharacterCard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
    })
        .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
        });

    window.location.href = '/characterCard';
}