import { adressAPI } from "./home.js";
import { cookieName } from "./main.js";
import { communBlock } from "./useful.js";

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

        let subContainerStat = document.createElement('div');
        subContainerStat.className = 'subContainerStat';

        let filter = document.createElement('div');
        filter.className = 'statfilter';
        filter.textContent = 'filtre de trie ici';
        subContainerStat.appendChild(filter);

        // création des en-tête
        let titledivstat = document.createElement('div');
        titledivstat.classList.add('divTitleStat');
        titledivstat.classList.add('divstat');

        let titleconnected = document.createElement('div');
        titleconnected.textContent = '';
        titleconnected.className = 'statconnected';
        titledivstat.appendChild(titleconnected);

        let titlename = document.createElement('div');
        titlename.textContent = 'Pseudo joueur';
        titlename.className = 'statname';
        titledivstat.appendChild(titlename);

        let titleclass = document.createElement('div');
        titleclass.textContent = 'classe joué';
        titleclass.className = 'statclass';
        titledivstat.appendChild(titleclass);

        let titleinfluenceplayer = document.createElement('div');
        titleinfluenceplayer.textContent = 'influence joueur';
        titleinfluenceplayer.className = 'statinfluence'
        titledivstat.appendChild(titleinfluenceplayer);

        let titlelvlplayer = document.createElement('div');
        titlelvlplayer.textContent = 'Level joueur';
        titlelvlplayer.className = 'statlvl';
        titledivstat.appendChild(titlelvlplayer);

        let titlenbGvGparticiped = document.createElement('div');
        titlenbGvGparticiped.textContent = 'GvG participé/total';
        titlenbGvGparticiped.className = 'statnbgvg';
        titledivstat.appendChild(titlenbGvGparticiped);

        let titlelastGvGparticiped = document.createElement('div');
        titlelastGvGparticiped.textContent = 'Derniére GvG participé le';
        titlelastGvGparticiped.className = 'statlastgvg'
        titledivstat.appendChild(titlelastGvGparticiped);

        subContainerStat.appendChild(titledivstat);

        for (let i = 0; i < data.ListInscripted.length; i++) {
            const currentUser = data.ListInscripted[i];

            let divstat = document.createElement('div');
            divstat.classList.add('divstat');

            let connected = document.createElement('div');
            if (currentUser.ID == 1) {
                connected.textContent = '✅';
            } else {
                connected.textContent = '❌';
            }
            connected.className = 'statconnected';
            divstat.appendChild(connected);

            let name = document.createElement('div');
            name.textContent = currentUser.Username;
            name.className = 'statname';
            divstat.appendChild(name);

            let classPlayer = document.createElement('div');
            classPlayer.textContent = currentUser.GameCharacter;
            classPlayer.className = 'statclass';
            divstat.appendChild(classPlayer);

            let influenceplayer = document.createElement('div');
            influenceplayer.textContent = currentUser.Influence;
            influenceplayer.className = 'statinfluence'
            divstat.appendChild(influenceplayer);

            let lvlplayer = document.createElement('div');
            lvlplayer.textContent = currentUser.Lvl;
            lvlplayer.className = 'statlvl';
            divstat.appendChild(lvlplayer);

            let nbGvGparticiped = document.createElement('div');
            nbGvGparticiped.textContent = currentUser.NbGvGParticiped + ' / ' + currentUser.NbTotalGvG;
            nbGvGparticiped.className = 'statnbgvg';
            divstat.appendChild(nbGvGparticiped);

            let lastGvGparticiped = document.createElement('div');
            lastGvGparticiped.textContent = currentUser.DateLastGvGParticiped;
            lastGvGparticiped.className = 'statlastgvg'
            divstat.appendChild(lastGvGparticiped);

            subContainerStat.appendChild(divstat);
        }


        document.getElementById('Container').appendChild(subContainerStat);

    } else {
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/';
    }
}