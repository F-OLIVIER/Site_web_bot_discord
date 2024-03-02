import { cookieName } from "./main.js";
import { communBlock } from "./useful.js";

export function creategroup() {
    if (!document.cookie.split(";").some((item) => item.trim().startsWith(cookieName + "="))) {
        window.location.href = '/';
    }
    console.log('ENTER HOME JS')
    // Si le cookie est present, fetch des données. Le back fera une vérification de la validité du cookie
    fetch('http://localhost:53134/api/creategroup')
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
            console.log('Data received (creategroup):', data);
            containercreategroup(data);
        })
        .catch(error => {
            // Gérer les erreurs
            console.error('Data recovery error:', error);
        });
}

let group = {};
function containercreategroup(data) {
    if (data.Gestion.Logged) {
        communBlock(data);

        // création des en-tête
        let titledivuser = document.createElement('div');
        titledivuser.classList.add('titledivuser');
        titledivuser.classList.add('divuser');

        let titlename = document.createElement('div');
        titlename.textContent = 'pseudo';
        titledivuser.appendChild(titlename);

        let titleinfluenceplayer = document.createElement('div');
        titleinfluenceplayer.textContent = 'influence joueur';
        titledivuser.appendChild(titleinfluenceplayer);

        let titleinfluenceUnit = document.createElement('div');
        titleinfluenceUnit.textContent = 'influence unité';
        titledivuser.appendChild(titleinfluenceUnit);

        let titleunit1 = document.createElement('div');
        titleunit1.textContent = 'unité 1';
        titledivuser.appendChild(titleunit1);

        let titleunit2 = document.createElement('div');
        titleunit2.textContent = 'unité 2';
        titledivuser.appendChild(titleunit2);

        let titleunit3 = document.createElement('div');
        titleunit3.textContent = 'unité 3';
        titledivuser.appendChild(titleunit3);

        let titleunit4 = document.createElement('div');
        titleunit4.textContent = 'unité 4';
        titledivuser.appendChild(titleunit4);

        let Container = document.getElementById('Container');
        let creategroup = document.createElement('div');
        creategroup.className = "creategroup";
        creategroup.appendChild(titledivuser);

        let groupNumber = 1;
        let groupName = '';
        if (data.GroupGvG != null) { // si un groupe à déja été enregistrer
            for (let i = 0; i < data.GroupGvG.length; i++) {
                const user = data.GroupGvG[i];
                if (i % 5 == 0) {
                    groupName = 'group' + groupNumber;
                    group[groupName] = document.createElement('div');
                    groupNumber++
                }

                let divuser = document.createElement('div');
                divuser.className = 'divuser';

                let name = document.createElement('div')
                // name.textContent = user.
            }
        } else { // si absence de groupe enregistré
            for (let i = 0; i < 15; i++) {
                if (i % 5 == 0) {
                    groupName = 'group' + groupNumber;
                    group[groupName] = document.createElement('div');
                    groupNumber++
                }

                let divuser = document.createElement('div');
                divuser.classList.add(groupName);
                divuser.classList.add('divuser');

                let name = document.createElement('select');
                name.className = 'username'
                let defaultoption = document.createElement("option");
                defaultoption.value = "";
                defaultoption.text = "Choisissez";
                name.appendChild(defaultoption);
                if (data.ListInscripted != null) {
                    for (let j = 0; j < data.ListInscripted.length; j++) {
                        const userInscripted = data.ListInscripted[j];
                        let option = document.createElement("option");
                        option.value = userInscripted.Username;
                        option.text = userInscripted.Username;
                        name.appendChild(option);
                    }
                }
                divuser.appendChild(name);


                let influenceplayer = document.createElement('div');
                influenceplayer.className = 'influenceplayer';
                divuser.appendChild(influenceplayer);
                let influenceUnit = document.createElement('div');
                influenceUnit.className = 'influenceUnit';
                divuser.appendChild(influenceUnit);
                let unit1 = document.createElement('div');
                unit1.className = 'unit1';
                divuser.appendChild(unit1);
                let unit2 = document.createElement('div');
                unit2.className = 'unit2';
                divuser.appendChild(unit2);
                let unit3 = document.createElement('div');
                unit3.className = 'unit3';
                divuser.appendChild(unit3);
                let unit4 = document.createElement('div');
                unit4.className = 'unit4';
                divuser.appendChild(unit4);

                // gestion des options unité 1 dés qu'un utilisateur est sélectionné
                name.addEventListener('change', function () {
                    const userSelected = name.value;
                    let infoUserSelected = {};
                    for (let j = 0; j < data.ListInscripted.length; j++) {
                        let userInscripted = data.ListInscripted[j];
                        if (userInscripted.id === userSelected.id) {
                            infoUserSelected = userInscripted;
                            break;
                        }
                    }
                    console.log('infoUserSelected : ', infoUserSelected)
                    influenceplayer.id = 'influPlayer' + infoUserSelected.Username;
                    influenceplayer.textContent = infoUserSelected.Influence;
                    influenceUnit.id = 'influUnit' + infoUserSelected.Username;

                    let selectunit1 = document.createElement('select');
                    selectunit1.id = 'unit1' + infoUserSelected.Username;
                    selectunit1.name = 'unit1' + infoUserSelected.Username;
                    for (let j = 0; j < infoUserSelected.UserCaserne.length; j++) {
                        const unit = infoUserSelected.UserCaserne[j];
                        console.log('unit : ', unit)
                        let option = document.createElement("option");
                        selectunit1.value = unit.Unit_name;
                        selectunit1.text = unit.Unit_name;
                        selectunit1.appendChild(option);
                    }
                    unit1.replaceWith(selectunit1);

                    // gestion des options unité 2 dés qu'une unité 1 est sélectionné
                    selectunit1.addEventListener('change', function () {
                        const unit1Selected = selectunit1.value;
                        let selectunit2 = document.createElement('select');
                        selectunit2.id = 'unit2' + infoUserSelected.Username
                        selectunit2.name = 'unit2' + infoUserSelected.Username
                        for (let j = 0; j < infoUserSelected.UserCaserne.length; j++) {
                            const unit = infoUserSelected.UserCaserne[j];
                            if (unit1Selected != unit.Unit_name) {
                                let option = document.createElement("option");
                                selectunit2.value = unit.Unit_name;
                                selectunit2.text = unit.Unit_name;
                                selectunit2.appendChild(option);
                            }
                        }
                        unit2.replaceWith(selectunit2);

                        // gestion des options unité 3 dés qu'une unité 2 est sélectionné
                        selectunit2.addEventListener('change', function () {
                            const unit2Selected = selectunit2.value;
                            let selectunit3 = document.createElement('select');
                            selectunit3.id = 'unit3' + infoUserSelected.Username
                            selectunit3.name = 'unit3' + infoUserSelected.Username
                            for (let j = 0; j < infoUserSelected.UserCaserne.length; j++) {
                                const unit = infoUserSelected.UserCaserne[j];
                                if (unit1Selected != unit.Unit_name && unit2Selected != unit.Unit_name) {
                                    let option = document.createElement("option");
                                    selectunit3.value = unit.Unit_name;
                                    selectunit3.text = unit.Unit_name;
                                    selectunit3.appendChild(option);
                                }
                            }
                            unit3.replaceWith(selectunit3);

                            // gestion des options unité 4 dés qu'une unité 3 est sélectionné
                            selectunit3.addEventListener('change', function () {
                                const unit3Selected = selectunit3.value;
                                let selectunit4 = document.createElement('select');
                                selectunit4.id = 'unit4' + infoUserSelected.username
                                selectunit4.name = 'unit4' + infoUserSelected.username
                                for (let j = 0; j < infoUserSelected.UserCaserne.length; j++) {
                                    const unit = infoUserSelected.UserCaserne[j];
                                    if (unit1Selected != unit.Unit_name &&
                                        unit2Selected != unit.Unit_name &&
                                        unit3Selected != unit.Unit_name) {
                                        let option = document.createElement("option");
                                        selectunit4.value = unit.Unit_name;
                                        selectunit4.text = unit.Unit_name;
                                        selectunit4.appendChild(option);
                                    }
                                }
                                unit4.replaceWith(selectunit4);
                            });
                        });
                    });
                });
                creategroup.appendChild(divuser)
            }
            Container.appendChild(creategroup);
        }

    } else {
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/';
    }
}