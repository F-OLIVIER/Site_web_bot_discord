import { adressAPI } from "./home.js";
import { cookieName } from "./main.js";
import { communBlock, createHTMLElement } from "./useful.js";

export function viewgroup() {
    if (!document.cookie.split(";").some((item) => item.trim().startsWith(cookieName + "="))) {
        window.location.href = '/';
    }
    fetch(adressAPI + 'creategroup')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur de réseau: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // console.log('Data received (viewGroup):', data);
            containerviewGroup(data);
        })
        .catch(error => {
            console.error('Data recovery error:', error);
        });
}

function containerviewGroup(data) {
    if (data.Gestion.Logged && data.Gestion.Officier) {
        communBlock(data);
        let container = document.getElementById('Container');
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        let divForImg = document.createElement('div');
        divForImg.className = 'divForImg';

        // création des en-tête
        let titledivuser = document.createElement('div');
        titledivuser.classList.add('titledivuser');
        titledivuser.classList.add('divuser');

        let titlename = createHTMLElement('div', 'viewtitlename');
        titlename.textContent = 'Joueur';
        titledivuser.appendChild(titlename);

        let titleclass = createHTMLElement('div', 'titleclass');
        titleclass.textContent = 'classe joué';
        titledivuser.appendChild(titleclass);

        let divnameunit = document.createElement('div');
        divnameunit.className = 'divnameunit';

        let titleunit1 = document.createElement('div');
        titleunit1.textContent = 'unité 1';
        divnameunit.appendChild(titleunit1);

        let titleunit2 = document.createElement('div');
        titleunit2.textContent = 'unité 2';
        divnameunit.appendChild(titleunit2);

        let titleunit3 = document.createElement('div');
        titleunit3.textContent = 'unité 3';
        divnameunit.appendChild(titleunit3);

        let titleunit4 = document.createElement('div');
        titleunit4.textContent = 'unité 4';
        divnameunit.appendChild(titleunit4);
        titledivuser.appendChild(divnameunit);

        let containerGroupe = createHTMLElement('div', 'containerGroupe');
        let viewgroup = createHTMLElement('div', 'viewgroup');
        viewgroup.appendChild(titledivuser);

        // compte le nombre de groupe existant
        let groupNumberMax = 0;
        for (let i = 0; i < data.GroupGvG.length; i++) {
            if (data.GroupGvG[i].GroupNumber > groupNumberMax) {
                groupNumberMax = data.GroupGvG[i].GroupNumber;
            }
        }

        let groupNumber = 1;
        for (let k = 0; k < groupNumberMax; k++) {
            // récupération des utilisateurs present dans le groupe
            for (let i = 0; i < groupNumberMax; i++) {
                const currentGroupe = usersInGroup(data, groupNumber);
                const groupName = 'viewgroup' + groupNumber;

                let divGroup = document.createElement('div');
                divGroup.classList.add('divViewGroup');
                divGroup.classList.add(groupName);

                for (let j = 0; j < currentGroupe.length; j++) {
                    const currentPlayer = currentGroupe[j];

                    let divuser = document.createElement('div');
                    divuser.classList.add(groupName);
                    divuser.classList.add('divuserviewgroup');

                    // pseudo player
                    let name = createHTMLElement('div', 'viewusername');
                    name.textContent = currentPlayer.Username;
                    divuser.appendChild(name);

                    // classe player
                    let classplayer = createHTMLElement('div', 'classplayer');
                    classplayer.textContent = currentPlayer.class;
                    divuser.appendChild(classplayer);

                    // Unité du joueur
                    let divlistUnit = createHTMLElement('div', 'viewdivlistUnit');
                    let unit1 = createHTMLElement('div', 'unit1');
                    unit1.textContent = currentPlayer.Unit1;
                    divlistUnit.appendChild(unit1);
                    let unit2 = createHTMLElement('div', 'unit2');
                    unit2.textContent = currentPlayer.Unit2;
                    divlistUnit.appendChild(unit2);
                    let unit3 = createHTMLElement('div', 'unit3');
                    unit3.textContent = currentPlayer.Unit3;
                    divlistUnit.appendChild(unit3);
                    let unit4 = createHTMLElement('div', 'unit4');
                    unit4.textContent = currentPlayer.Unit4;
                    divlistUnit.appendChild(unit4);
                    divuser.appendChild(divlistUnit);
                    divGroup.appendChild(divuser);
                }
                viewgroup.appendChild(divGroup);
            }
            groupNumber += 1;
        }

        containerGroupe.appendChild(viewgroup);

        // bouton pour télécharger l'image des groupes
        let script = document.createElement('script');
        script.src = "https://html2canvas.hertzen.com/dist/html2canvas.js";
        container.appendChild(script);
        let buttonDownloadGroup = createHTMLElement('div', 'buttonDownloadGroup');
        buttonDownloadGroup.textContent = "Télécharger l'image des groupes";
        containerGroupe.appendChild(buttonDownloadGroup);
        buttonDownloadGroup.addEventListener('click', function () {
            html2canvas(viewgroup, { allowTaint: true }).then(function (canvas) {
                var link = document.createElement("a");
                document.body.appendChild(link);
                const now = new Date(Date.now());
                console.log("now : ", now.getMonth());
                const date = String(now.getDate()).padStart(2, '0') + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + now.getFullYear();
                link.download = date + "_groupeGvG.jpg";
                link.href = canvas.toDataURL();
                link.target = '_blank';
                link.click();
            });
        });

        // bouton pour revenir à l'édition des groupes
        let buttonEditGroup = createHTMLElement('div', 'buttonEditGroup');
        buttonEditGroup.textContent = "Revenir à l'édition des groupes";
        containerGroupe.appendChild(buttonEditGroup);
        buttonEditGroup.addEventListener('click', function () {
            window.location.href = '/creategroup';
        });

        container.appendChild(containerGroupe);

    } else {
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/';
    }
}

function usersInGroup(data, groupNumber) {
    let usersInGroup = [];
    for (let i = 0; i < data.GroupGvG.length; i++) {
        let currentUser = data.GroupGvG[i];
        if (groupNumber == currentUser.GroupNumber) {
            for (let j = 0; j < data.ListInscripted.length; j++) {
                const userInscripted = data.ListInscripted[j];
                if (userInscripted.ID === currentUser.User_ID) {
                    currentUser.influence = userInscripted.Influence;
                    currentUser.class = userInscripted.GameCharacter;
                    currentUser.influUnit = influenceUnit(currentUser, userInscripted.UserCaserne)
                }
            }
            usersInGroup.push(currentUser);
        }
    }

    for (let i = usersInGroup.length; i < 5; i++) {
        const noUser = {
            "Username": "",
            "GroupNumber": groupNumber,
            "Unit1": "",
            "Unit2": "",
            "Unit3": "",
            "Unit4": "",
            "influence": "",
            "influUnit": "",
            "class": ""
        }
        usersInGroup.push(noUser);
    }
    return usersInGroup
}

function influenceUnit(currentUser, caserne) {
    let unitValues = 0;
    for (let i = 0; i < caserne.length; i++) {
        let nameCurrentUnit = caserne[i].Unit_name
        if (nameCurrentUnit === currentUser.Unit1 ||
            nameCurrentUnit === currentUser.Unit2 ||
            nameCurrentUnit === currentUser.Unit3 ||
            nameCurrentUnit === currentUser.Unit4) {
            unitValues += parseInt(caserne[i].Unit_influence, 10);
        }
    }

    return unitValues;
}