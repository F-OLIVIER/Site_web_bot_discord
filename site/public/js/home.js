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

      let subContainer = document.createElement('div');
      subContainer.className = 'subContainer';
      let linkCharacterCard = document.createElement('a');
      linkCharacterCard.href = '/characterCard';
      linkCharacterCard.classList.add('no-style-link');
      let buttoncharacterCard = document.createElement('div');
      buttoncharacterCard.className = 'buttoncharacterCard';
      buttoncharacterCard.id = 'buttonCharacterCard';
      buttoncharacterCard.textContent = 'Accéder à ma fiche personnage';
      linkCharacterCard.appendChild(buttoncharacterCard);
      subContainer.appendChild(linkCharacterCard);

      let linkCaserne = document.createElement('a');
      linkCaserne.href = '/caserne';
      linkCaserne.classList.add('no-style-link');
      let buttonCaserne = document.createElement('div');
      buttonCaserne.id = 'buttonCaserne';
      buttonCaserne.className = 'buttonCaserne';
      buttonCaserne.textContent = 'Accéder à ma caserne';
      linkCaserne.appendChild(buttonCaserne);
      subContainer.appendChild(linkCaserne);

      let linkCreateGroup = document.createElement('a');
      linkCreateGroup.href = '/creategroup';
      linkCreateGroup.classList.add('no-style-link');
      let buttonCreateGroup = document.createElement('div');
      buttonCreateGroup.id = 'buttonCreateGroup';
      buttonCreateGroup.className = 'buttonCreateGroup';
      buttonCreateGroup.href = '/creategroup';
      buttonCreateGroup.textContent = 'Accéder à la création des groupes GvG';
      linkCreateGroup.appendChild(buttonCreateGroup);
      subContainer.appendChild(linkCreateGroup);

      Container.appendChild(subContainer);
    } else { // affichage caserne direct
      window.location.href = '/caserne';
    }

  } else {
    document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/';
  }
}