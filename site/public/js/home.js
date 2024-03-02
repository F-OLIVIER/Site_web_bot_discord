import { cookieName } from "./main.js";
import { communBlock } from "./useful.js";

export function home() {
    if (!document.cookie.split(";").some((item) => item.trim().startsWith(cookieName + "="))) {
        window.location.href = '/';
    }
    console.log('ENTER HOME JS')
  // Si le cookie est present, fetch des données. Le back fera une vérification de la validité du cookie
  fetch('http://localhost:53134/api/home')
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
      console.log('Data received (home):', data);
      containerhome(data);
    })
    .catch(error => {
      // Gérer les erreurs
      console.error('Data recovery error:', error);
    });
}


function containerhome(data) {
  if (data.Gestion.Logged) {
    communBlock(data)

    if (data.Gestion.Officier) { // si officier, affichage bouton caserne et bouton création des groupes
        let Container = document.getElementById('Container');
        Container.innerHTML = '';

        let linkCaserne = document.createElement('a');
        linkCaserne.href = '/caserne';
        let buttonCaserne = document.createElement('button');
        buttonCaserne.id = 'buttonCaserne';
        buttonCaserne.textContent = 'Accéder à ma caserne';
        linkCaserne.appendChild(buttonCaserne);
        Container.appendChild(linkCaserne);

        // let linkCharacterCard = document.createElement('a');
        // linkCharacterCard.href = '/characterCard';
        // let buttoncharacterCard = document.createElement('button');
        // buttoncharacterCard.id = 'buttonCharacterCard';
        // buttoncharacterCard.textContent = 'Fiche personnage';
        // linkCharacterCard.appendChild(buttoncharacterCard);
        // Container.appendChild(linkCharacterCard);

        let linkCreateGroup = document.createElement('a');
        linkCreateGroup.href = '/creategroup';
        let buttonCreateGroup = document.createElement('button');
        buttonCreateGroup.id = 'buttonCreateGroup';
        buttonCreateGroup.href = '/creategroup';
        buttonCreateGroup.textContent = 'Accéder à la création des groupes GvG';
        linkCreateGroup.appendChild(buttonCreateGroup);
        Container.appendChild(linkCreateGroup);

    } else { // affichage caserne direct
        window.location.href = '/caserne';
    }

  } else {
    document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/';
  }
}