import { adressAPI, cookieName } from "./config.js";
import { communBlock, createHTMLElement } from "./useful.js";

export function stat() {
    if (!document.cookie.split(";").some((item) => item.trim().startsWith(cookieName + "="))) {
        window.location.href = '/';
    }
    fetch(adressAPI + 'statGvG')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur de réseau: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // console.log('Data received (stat):', data);
            containerviewGroup(data);
        })
        .catch(error => {
            console.error('Data recovery error:', error);
        });
}

function containerviewGroup(data) {
    if (data.Gestion.Logged && data.Gestion.Officier) {
        communBlock(data);

        let subContainerStat = createHTMLElement('div', 'subContainerStat');

        let ListFilter = [['sortuserbyname', 'statname'], ['sortuserbyinflu', 'statinfluence'], ['sortuserbylevel', 'statlvl'], ['sortuserbylastGvG', 'statlastgvg']];
        let filter = createHTMLElement('div', 'statfilter');
        // Titre
        let titlefilter = document.createElement('div');
        titlefilter.className = 'titlefilter';
        titlefilter.textContent = 'Filtrer par :';
        filter.appendChild(titlefilter);
        let buttonFilter = document.createElement('div');
        buttonFilter.className = 'buttonFilter';
        let divline1 = document.createElement('div');
        divline1.className = 'linefilter';
        let divline2 = document.createElement('div');
        divline2.className = 'linefilter';

        // filtre par name
        let sortuserbyname = document.createElement('button');
        sortuserbyname.id = 'sortuserbyname';
        sortuserbyname.textContent = "nom";
        divline1.appendChild(sortuserbyname);
        // filtre par influence
        let sortuserbyinflu = document.createElement('button');
        sortuserbyinflu.id = 'sortuserbyinflu';
        sortuserbyinflu.textContent = "influence";
        divline1.appendChild(sortuserbyinflu);
        // filtre par level
        let sortuserbylevel = document.createElement('button');
        sortuserbylevel.id = 'sortuserbylevel';
        sortuserbylevel.textContent = "Level";
        divline1.appendChild(sortuserbylevel);
        // filtre par Derniére GvG
        let sortuserbylastGvG = document.createElement('button');
        sortuserbylastGvG.id = 'sortuserbylastGvG';
        sortuserbylastGvG.textContent = "derniére GvG";
        divline2.appendChild(sortuserbylastGvG);

        buttonFilter.appendChild(divline1);
        buttonFilter.appendChild(divline2);
        filter.appendChild(buttonFilter);
        subContainerStat.appendChild(filter);

        const listLegendConnected = ["📱 Joueur qui s'est connecté au site internet", "📵 Joueur qui ne s'est jamais connecté au site internet"];
        let legend = createHTMLElement('div', 'legendstat');
        legend.textContent = "Légende : ";
        for (let i = 0; i < listLegendConnected.length; i++) {
            let currentlegend = document.createElement('div');
            currentlegend.textContent = listLegendConnected[i];
            legend.appendChild(currentlegend);
        }
        subContainerStat.appendChild(legend);

        // création des en-tête
        let titledivstat = document.createElement('div');
        titledivstat.classList.add('divTitleStat');
        titledivstat.classList.add('divstat');

        let titleconnected = createHTMLElement('div', 'statconnected');
        titleconnected.textContent = '';
        titledivstat.appendChild(titleconnected);

        let titlename = createHTMLElement('div', 'statname');
        titlename.textContent = 'Pseudo joueur';
        titledivstat.appendChild(titlename);

        let titleclass = createHTMLElement('div', 'statclass');
        titleclass.textContent = 'classe joué';
        titledivstat.appendChild(titleclass);

        let titleinfluenceplayer = createHTMLElement('div', 'statinfluence');
        titleinfluenceplayer.textContent = 'influence joueur';
        titledivstat.appendChild(titleinfluenceplayer);

        let titlelvlplayer = createHTMLElement('div', 'statlvl');
        titlelvlplayer.textContent = 'Level joueur';
        titledivstat.appendChild(titlelvlplayer);

        let titlenbGvGparticiped = createHTMLElement('div', 'statnbgvg');
        titlenbGvGparticiped.textContent = 'GvG participé/total';
        titledivstat.appendChild(titlenbGvGparticiped);

        let titlelastGvGparticiped = createHTMLElement('div', 'statlastgvg');
        titlelastGvGparticiped.textContent = 'Derniére GvG participé le';
        titledivstat.appendChild(titlelastGvGparticiped);

        subContainerStat.appendChild(titledivstat);
        let subContainerStatForSort = createHTMLElement('div', 'subContainerStatForSort');
        subContainerStat.appendChild(subContainerStatForSort);
        DisplayUsers(data.ListInscripted, subContainerStatForSort);

        document.getElementById('Container').appendChild(subContainerStat);

        createFilterEventlistener(ListFilter);
    } else {
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/';
    }
}

function DisplayUsers(data, div) {
    for (let i = 0; i < data.length; i++) {
        const currentUser = data[i];

        let divstat = createHTMLElement('div', 'divstat');
        let connected = createHTMLElement('div', 'connected');
        if (currentUser.ID == 1) {
            connected.textContent = '📱';
        } else {
            connected.textContent = '📵';
        }
        divstat.appendChild(connected);

        let name = createHTMLElement('div', 'statname');
        name.textContent = currentUser.Username;
        divstat.appendChild(name);

        let classPlayer = createHTMLElement('div', 'statclass');
        classPlayer.textContent = currentUser.GameCharacter;
        divstat.appendChild(classPlayer);

        let influenceplayer = createHTMLElement('div', 'statinfluence');
        influenceplayer.textContent = currentUser.Influence;
        divstat.appendChild(influenceplayer);

        let lvlplayer = createHTMLElement('div', 'statlvl');
        lvlplayer.textContent = currentUser.Lvl;
        divstat.appendChild(lvlplayer);

        let nbGvGparticiped = createHTMLElement('div', 'statnbgvg');
        nbGvGparticiped.textContent = currentUser.NbGvGParticiped + ' / ' + currentUser.NbTotalGvG;
        divstat.appendChild(nbGvGparticiped);

        let lastGvGparticiped = createHTMLElement('div', 'statlastgvg');
        lastGvGparticiped.textContent = currentUser.DateLastGvGParticiped;
        divstat.appendChild(lastGvGparticiped);

        div.appendChild(divstat);
    }
}

function createFilterEventlistener(ListFilter) {
    ListFilter.forEach(sortButton => {
        const button = document.getElementById(sortButton[0])
        button.addEventListener("click", function () {
            sortBy(sortButton[1]);
        });
    });
}

// Fonction de trie qui fonctionne pour tous
function sortBy(option = '') {
    var statsContainer = document.getElementById('subContainerStatForSort');
    var stats = statsContainer.children;
    // Convertir la collection d'éléments en un tableau pour pouvoir utiliser sort()
    var statsArray = Array.from(stats);

    // Trier les éléments pour le critère spécifié
    statsArray.sort(function (a, b) {
        var valueA = a.querySelector('.' + option).textContent.toUpperCase();
        var valueB = b.querySelector('.' + option).textContent.toUpperCase();
        return (valueA < valueB) ? -1 : (valueA > valueB) ? 1 : 0;
    });

    // Effacer l'ancien contenu
    while (statsContainer.firstChild) {
        statsContainer.removeChild(statsContainer.firstChild);
    }
    // Afficher le nouveau contenu
    statsArray.forEach(function (stat) {
        statsContainer.appendChild(stat);
    });
}