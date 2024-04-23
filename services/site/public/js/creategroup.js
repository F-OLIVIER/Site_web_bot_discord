import { adressAPI, cookieName } from "./config.js";
import { communBlock, createHTMLElement, fetchlogout } from "./useful.js";

export function creategroup() {
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
            // console.log('Data received (creategroup):', data);
            containercreategroup(data);
        })
        .catch(error => {
            console.error('Data recovery error:', error);
        });
}

let groupNumber = 1;
let listUserSelect = [];
export async function containercreategroup(data) {
    if (data.Gestion.Logged && data.Gestion.Officier) {
        communBlock(data);

        let Container = document.getElementById('Container');
        let containerGroupe = await createHTMLElement('div', 'containerGroupe');

        // affichage de la liste des inscrits
        let divlistInscripted = await listInscripted(data.ListInscripted);
        containerGroupe.appendChild(divlistInscripted);
        let divcreategroup = await createHTMLElement('div', 'divcreategroup');
        divcreategroup.style.display = 'none';

        // Boutton pour afficher l'encart de création des groupes
        let buttonDisplaycreategroup = await createHTMLElement('div', 'buttonDisplaycreategroup');
        buttonDisplaycreategroup.textContent = 'Création des groupes GvG';
        containerGroupe.appendChild(buttonDisplaycreategroup);

        // div de la création des groupes GvG
        let creategroup = await createHTMLElement('div', 'creategroup');

        // légende
        const listLegend = ['🔴 Unité non maitrisé', '🟡 Unité en cour de maitrise', '🟢 Unité maitrisé'];
        let legend = await createLegend(listLegend, 'legendMaitrise');
        legend.prepend('Légende : ');

        creategroup.appendChild(legend);
        // en-tête
        creategroup.appendChild(entete());
        // div de création des groupes
        divcreategroup.appendChild(creategroup);
        containerGroupe.appendChild(divcreategroup);
        Container.appendChild(containerGroupe);

        // Création des groupes déja existant
        if (data.GroupGvG != null) {
            let groupNumberMax = 0;

            for (let i = 0; i < data.GroupGvG.length; i++) {
                if (data.GroupGvG[i].GroupNumber > groupNumberMax) {
                    groupNumberMax = data.GroupGvG[i].GroupNumber;
                }
            }

            for (let i = 0; i < groupNumberMax; i++) {
                const currentGroupe = usersInGroup(data.GroupGvG);
                await createExistGroupe(data, currentGroupe);
                groupNumber += 1;
            }
            MAJlistUserSelect();
        }

        // Boutton pour ajouter un groupe (5 joueurs)
        let buttonAddGroup = await createHTMLElement('div', 'buttonAddGroup');
        buttonAddGroup.textContent = 'Ajouter un groupe';
        divcreategroup.appendChild(buttonAddGroup);
        buttonAddGroup.addEventListener('click', function () {
            createOneGroupe(data);
            groupNumber += 1;
        });

        // Boutton pour ajouter un groupe (5 joueurs)
        let buttonSaveGroup = await createHTMLElement('div', 'buttonSaveGroup');
        buttonSaveGroup.textContent = 'Sauvegarder les groupes';
        divcreategroup.appendChild(buttonSaveGroup);
        buttonSaveGroup.addEventListener('click', function () {
            saveGroup();
            window.location.href = '/creategroup';
        });

        // Boutton pour voir les groupes de façon non modifiable
        if (data.GroupGvG != null) {
            let buttonViewGroup = await createHTMLElement('div', 'buttonViewGroup');
            buttonViewGroup.textContent = 'Prévisualisations des groupes';
            containerGroupe.appendChild(buttonViewGroup);
            buttonViewGroup.addEventListener('click', function () {
                // saveGroup();
                window.location.href = '/viewGroup';
            });
        }

        // événements du boutton d'affichage des inscrits
        document.getElementById('buttonDisplayInscripted').addEventListener('click', function () {
            if (document.getElementById('divinscripted').style.display === 'none') {
                document.getElementById('legendInscripted').style.display = 'flex';
                document.getElementById('divinscripted').style.display = 'block';
            } else {
                document.getElementById('legendInscripted').style.display = 'none';
                document.getElementById('divinscripted').style.display = 'none';
            }
        });

        // événements du boutton d'affichage des inscrits
        document.getElementById('buttonDisplaycreategroup').addEventListener('click', function () {
            if (document.getElementById('divcreategroup').style.display === 'none') {
                document.getElementById('divcreategroup').style.display = 'block';
            } else {
                document.getElementById('divcreategroup').style.display = 'none';
            }
        });

    } else {
        fetchlogout();
    }
}

// --------------------------------------------------------
// ------------- Partie "Liste des Inscrits ---------------
// --------------------------------------------------------
async function listInscripted(data) {
    let divlistInscripted = await createHTMLElement('div', 'listInscripted');

    // Boutton pour afficher la liste des inscrits
    let buttonDisplayInscripted = await createHTMLElement('div', 'buttonDisplayInscripted');
    buttonDisplayInscripted.id = 'buttonDisplayInscripted';
    buttonDisplayInscripted.textContent = 'Liste des inscrits';
    divlistInscripted.appendChild(buttonDisplayInscripted);

    // légende
    const listLegendplaced = ['✅ Joueur placé dans un groupe', '❌ Joueur NON placé dans un groupe'];
    const listLegendConnected = ["📱 Joueur qui s'est connecté au site internet", "📵 Joueur qui ne s'est jamais connecté au site internet"];
    let divlegend = await createHTMLElement('div', 'legendInscripted');
    divlegend.style.display = 'none';
    let divlistlegend = await createHTMLElement('div', 'divlistlegend');
    let titlelegend = document.createElement('div');
    titlelegend.textContent = 'Légende :';
    divlistlegend.appendChild(titlelegend);
    let Legendplaced = await createLegend(listLegendplaced, 'legendplaced');
    divlistlegend.appendChild(Legendplaced);
    let Legendconnected = await createLegend(listLegendConnected, 'Legendconnected');
    divlistlegend.appendChild(Legendconnected);
    divlegend.appendChild(divlistlegend);
    divlistInscripted.appendChild(divlegend);

    let divinscripted = await createHTMLElement('div', 'divinscripted');
    divinscripted.id = 'divinscripted';
    divinscripted.style.display = 'none';

    // en tête liste des inscrits
    let titledivuser = document.createElement('div');
    titledivuser.classList.add('inscriptedtitledivuser');
    titledivuser.classList.add('inscripted');

    let titledivplace = await createHTMLElement('div', 'divplace');
    titledivuser.appendChild(titledivplace);

    let titledivconnected = await createHTMLElement('div', 'divconnected');
    titledivuser.appendChild(titledivconnected);

    let titlename = await createHTMLElement('div', 'inscriptedname');
    titlename.textContent = 'pseudo';
    titledivuser.appendChild(titlename);

    let titleinfluence = await createHTMLElement('div', 'inscriptedinfluence');
    titleinfluence.innerHTML = 'influence joueur';
    titledivuser.appendChild(titleinfluence);

    let titleclass = await createHTMLElement('div', 'inscriptedclass');
    titleclass.innerHTML = "classe d'arme";
    titledivuser.appendChild(titleclass);
    divinscripted.appendChild(titledivuser)

    // liste des inscrits
    if (data !== null) {
        // création des div pour chaque inscrit
        for (let i = 0; i < data.length; i++) {
            const player = data[i];

            let divuser = await createHTMLElement('div', 'inscripted');

            // indique si l'utilisateur est placé dans un groupe ✅ ❌
            let divplace = await createHTMLElement('div', 'divplace');
            divplace.id = 'player_' + player.Username.replace(/\s/g, '');
            divplace.textContent = '❌';
            divuser.appendChild(divplace);

            // indique si l'utilisateur c'est connecté au site internet 📱 📵
            let divconnected = await createHTMLElement('div', 'divconnected');
            if (player.ConnectedSite === "1") {
                divconnected.textContent = '📱';
            } else {
                divconnected.textContent = '📵';
            }
            divuser.appendChild(divconnected);

            let name = await createHTMLElement('div', 'inscriptedname');
            name.textContent = player.Username;
            divuser.appendChild(name);

            let influence = await createHTMLElement('div', 'inscriptedinfluence');
            influence.innerHTML = player.Influence;
            divuser.appendChild(influence);

            let classPlayer = await createHTMLElement('div', 'inscriptedclass');
            classPlayer.innerHTML = player.GameCharacter;
            divuser.appendChild(classPlayer);
            divinscripted.appendChild(divuser)
        }
    }
    divlistInscripted.appendChild(divinscripted);
    return divlistInscripted
}

// --------------------------------------------------------
// ----------- Partie "Création des groupes" --------------
// --------------------------------------------------------
// ***************** Option "exist group" *****************

async function createExistGroupe(data, userIngroup) {
    const creategroup = document.getElementById('creategroup');
    const groupName = 'group' + groupNumber;
    let divGroup = document.createElement('div');
    divGroup.classList.add('divgroup');
    divGroup.classList.add(groupName);
    divGroup.appendChild(namegroup(data, groupNumber));

    for (let i = 0; i < 5; i++) {
        let currentUser = {
            Username: "",
            Unit1: "",
            Unit2: "",
            Unit3: "",
            Unit4: "",
        }

        if (userIngroup[i] != undefined && userIngroup[i] != null) {
            currentUser.ID = userIngroup[i].User_ID;
            currentUser.Username = userIngroup[i].Username;
            currentUser.Unit1 = userIngroup[i].Unit1;
            currentUser.Unit2 = userIngroup[i].Unit2;
            currentUser.Unit3 = userIngroup[i].Unit3;
            currentUser.Unit4 = userIngroup[i].Unit4;

            // mise a jour de la divplace pour chaque joueur deja placé dans la liste des inscrits
            document.getElementById('player_' + userIngroup[i].Username.replace(/\s/g, '')).textContent = '✅';
        }

        let divuser = await createHTMLElement('div', 'divuser');

        let inputHidden = document.createElement('input');
        inputHidden.value = groupName;
        inputHidden.hidden = true;
        divuser.appendChild(inputHidden);

        let name = document.createElement('select');
        name.className = 'username';
        let defaultoption = document.createElement("option");
        name.appendChild(defaultoption);
        if (currentUser.Username === "") {
            defaultoption.value = "";
            defaultoption.text = "Choisissez";
        } else {
            defaultoption.value = currentUser.Username;
            defaultoption.text = currentUser.Username;
            let option = document.createElement('option');
            option.value = "";
            option.text = "Suprimer le joueur";
            name.appendChild(option);
        }

        if (data.ListInscripted != null) {
            for (let j = 0; j < data.ListInscripted.length; j++) {
                const userInscripted = data.ListInscripted[j];
                if (userInscripted.Username != currentUser.Username) {
                    let option = document.createElement("option");
                    option.value = userInscripted.Username;
                    option.text = userInscripted.Username;
                    name.appendChild(option);
                }
            }
        }
        divuser.appendChild(name);

        let influenceUnit = await createHTMLElement('div', 'influenceUnit');
        divuser.appendChild(influenceUnit);
        let influenceplayer = await createHTMLElement('div', 'influenceplayer');
        divuser.appendChild(influenceplayer);
        let unit1 = await createHTMLElement('div', 'unit1');
        divuser.appendChild(unit1);
        let selectunit1;
        let unit2 = await createHTMLElement('div', 'unit2');
        divuser.appendChild(unit2);
        let selectunit2;
        let unit3 = await createHTMLElement('div', 'unit3');
        divuser.appendChild(unit3);
        let selectunit3;
        let unit4 = await createHTMLElement('div', 'unit4');
        divuser.appendChild(unit4);
        let selectunit4;

        if (currentUser.Username !== "") { // utilisateur present
            let infoUsersave = {};
            for (let j = 0; j < data.ListInscripted.length; j++) {
                let userInscripted = data.ListInscripted[j];
                if (userInscripted.ID === currentUser.ID) {
                    infoUsersave = userInscripted;
                    break;
                }
            }
            let usernameSansEspaces = infoUsersave.Username.replace(/\s/g, '');
            influenceUnit.id = 'influUnit' + usernameSansEspaces;
            influenceUnit.textContent = 0;
            influenceplayer.id = 'influPlayer' + usernameSansEspaces;
            influenceplayer.textContent = '/ ' + infoUsersave.Influence;

            // Unité 1
            selectunit1 = await createSelectUnit(1, infoUsersave.UserCaserne, currentUser, usernameSansEspaces, 1)
            unit1.replaceWith(selectunit1);
            // Unité 2
            selectunit2 = await createSelectUnit(2, infoUsersave.UserCaserne, currentUser, usernameSansEspaces, 1)
            unit2.replaceWith(selectunit2);
            // Unité 3
            selectunit3 = await createSelectUnit(3, infoUsersave.UserCaserne, currentUser, usernameSansEspaces, 1)
            unit3.replaceWith(selectunit3);
            // Unité 4
            selectunit4 = await createSelectUnit(4, infoUsersave.UserCaserne, currentUser, usernameSansEspaces, 1)
            unit4.replaceWith(selectunit4);

            createEventSelectUnit(name, influenceplayer, influenceUnit, selectunit1, selectunit2, selectunit3, selectunit4, infoUsersave, usernameSansEspaces)

        } else { // utilisateur non present
            createNewline(name, data, influenceplayer, influenceUnit, unit1, unit2, unit3, unit4);
        }

        // création des events listener
        name.addEventListener('change', function () {
            let userSelected = name.value;

            MAJlistUserSelect();

            if (selectunit1 != undefined) {
                selectunit1.style.visibility = 'hidden';
                selectunit1.value = "";
                selectunit1.innerHTML = "";
                selectunit1.innerHTML = "";
                if (selectunit2 != undefined) {
                    selectunit2.style.visibility = 'hidden';
                    selectunit2.value = "";
                    selectunit2.innerHTML = "";
                    if (selectunit3 != undefined) {
                        selectunit3.style.visibility = 'hidden';
                        selectunit3.value = "";
                        selectunit3.innerHTML = "";
                        if (selectunit4 != undefined) {
                            selectunit4.style.visibility = 'hidden';
                            selectunit4.value = "";
                            selectunit4.innerHTML = "";
                        }
                    }
                }
            }
            influenceUnit.textContent = "";
            influenceplayer.textContent = "";

            if (userSelected !== "") {
                // mise à jour des options des selects
                listUserSelect.push(userSelected);
                optionSelectUsername();

                // mise à jour des balises select avec les nouvelles unités
                updateSelectUnit(data, selectunit1, selectunit2, selectunit3, selectunit4, userSelected);


                if (selectunit1 != undefined) {
                    selectunit1.style.visibility = 'visible';
                }

                for (let j = 0; j < data.ListInscripted.length; j++) {
                    let userInscripted = data.ListInscripted[j];
                    if (userInscripted.Username === userSelected) {
                        const usernameSansEspaces = userInscripted.Username.replace(/\s/g, '');
                        influenceUnit.id = 'influUnit' + usernameSansEspaces;
                        influenceUnit.textContent = 0;
                        influenceplayer.id = 'influPlayer' + usernameSansEspaces;
                        influenceplayer.textContent = '/ ' + userInscripted.Influence;
                        break;
                    }
                }
            }
        });
        divGroup.appendChild(divuser);
    }

    creategroup.appendChild(divGroup);
    for (let i = 0; i < userIngroup.length; i++) {
        let currentUser = userIngroup[i];
        if (currentUser != undefined && currentUser != null) {
            for (let j = 0; j < data.ListInscripted.length; j++) {
                let userInscripted = data.ListInscripted[j];
                if (userInscripted.ID === currentUser.User_ID) {
                    let usernameSansEspaces = userInscripted.Username.replace(/\s/g, '');
                    changeInfluUnit(userInscripted.UserCaserne, usernameSansEspaces);
                    break;
                }
            }
        }
    }
}

// optionUser 0 = nouvelle utilisateur
// optionUser 1 = utilisateur deja present dans la sauvegarde
function createSelectUnit(numberUnit, caserne, currentUser, usernameSansEspaces, optionUser) {
    let nameUnit = "";
    // let Consulterunofficier = false;
    if (numberUnit === 1) {
        nameUnit = currentUser.Unit1
    } else if (numberUnit === 2) {
        nameUnit = currentUser.Unit2
    } else if (numberUnit === 3) {
        nameUnit = currentUser.Unit3
    } else if (numberUnit === 4) {
        nameUnit = currentUser.Unit4
    }

    let selectunit = createHTMLElement('select', 'unit' + numberUnit + usernameSansEspaces);
    selectunit.name = 'unit' + numberUnit + usernameSansEspaces;
    insertSelectUnit(selectunit, caserne, nameUnit, optionUser);

    return selectunit
}

async function insertSelectUnit(selectunit, caserne, nameUnit, optionUser) {
    let Consulterunofficier = false;
    let defaultoptionUnit = document.createElement("option");
    selectunit.appendChild(defaultoptionUnit);

    // groupe pour l'affichage des selects
    let optgroupOther = document.createElement('optgroup');
    optgroupOther.label = 'Option de gestion';
    let optgroupT5 = document.createElement('optgroup');
    optgroupT5.label = 'Unité T5';
    let optgroupT4 = document.createElement('optgroup');
    optgroupT4.label = 'Unité T4';
    let optgroupT3 = document.createElement('optgroup');
    optgroupT3.label = 'Unité T3';

    // Légende : 🔴 Unité non maitrisé, 🟡 Unité en cour de maitrise, 🟢 Unité maitrisé
    if (caserne !== null && caserne.length !== undefined) {
        for (let j = 0; j < caserne.length; j++) {
            const unit = caserne[j];
            if (nameUnit !== unit.Unit_name) {
                let option = document.createElement('option');
                option.value = unit.Unit_name;
                if (unit.Unit_maitrise === '1' && unit.UserMaitrise === '') {
                    option.text = unit.Unit_name + ' (lvl ' + unit.Unit_lvl + '🔴)';
                } else if (unit.Unit_maitrise === '1' && unit.UserMaitrise === '1') {
                    option.text = unit.Unit_name + ' (lvl ' + unit.Unit_lvl + '🟡)';
                } else if (unit.Unit_maitrise === '1' && unit.UserMaitrise === '2') {
                    option.text = unit.Unit_name + ' (lvl ' + unit.Unit_lvl + '🟢)';
                } else {
                    option.text = unit.Unit_name + ' (lvl ' + unit.Unit_lvl + ')';
                }
                // selectunit.appendChild(option);
                if (unit.Unit_tier === 'T5') {
                    optgroupT5.appendChild(option)
                } else if (unit.Unit_tier === 'T4') {
                    optgroupT4.appendChild(option)
                } else if (unit.Unit_tier === 'T3') {
                    optgroupT3.appendChild(option)
                }
            } else {
                defaultoptionUnit.value = nameUnit;
                // defaultoptionUnit.text = nameUnit + ' (lvl ' + unit.Unit_lvl + ')';
                if (unit.Unit_maitrise === '1' && unit.UserMaitrise === '') {
                    defaultoptionUnit.text = nameUnit + ' (lvl ' + unit.Unit_lvl + '🔴)';
                } else if (unit.Unit_maitrise === '1' && unit.UserMaitrise === '1') {
                    defaultoptionUnit.text = nameUnit + ' (lvl ' + unit.Unit_lvl + '🟡)';
                } else if (unit.Unit_maitrise === '1' && unit.UserMaitrise === '2') {
                    defaultoptionUnit.text = nameUnit + ' (lvl ' + unit.Unit_lvl + '🟢)';
                } else {
                    defaultoptionUnit.text = nameUnit + ' (lvl ' + unit.Unit_lvl + ')';
                }
            }
            if (nameUnit === 'Consulter un officier') {
                Consulterunofficier = true;
            }
        }
    }

    if (Consulterunofficier) {
        defaultoptionUnit.value = 'Consulter un officier';
        defaultoptionUnit.text = 'Consulter un officier';
        defaultoptionUnit.style.color = 'red';
    } else {
        let officieroptionUnit = document.createElement("option");
        officieroptionUnit.value = 'Consulter un officier';
        officieroptionUnit.text = 'Consulter un officier';
        officieroptionUnit.style.color = 'red';
        optgroupOther.appendChild(officieroptionUnit);
    }

    if (nameUnit !== "" && optionUser == 1) {
        let option = document.createElement('option');
        option.value = "";
        option.text = "Suprimer l'unité";
        optgroupOther.appendChild(option);
    } else {
        defaultoptionUnit.value = "";
        defaultoptionUnit.text = "Choisissez";
    }

    selectunit.appendChild(optgroupOther);
    selectunit.appendChild(optgroupT5);
    selectunit.appendChild(optgroupT4);
    selectunit.appendChild(optgroupT3);
}

// *************** Option "not exist group" ***************
function createOneGroupe(data) {
    const creategroup = document.getElementById('creategroup');
    const groupName = 'group' + groupNumber;
    let divGroup = document.createElement('div');
    divGroup.classList.add('divgroup');
    divGroup.classList.add(groupName);
    divGroup.appendChild(namegroup(data, groupNumber));

    for (let i = 0; i < 5; i++) {
        let divuser = document.createElement('div');
        divuser.classList.add('divuser');

        let inputHidden = document.createElement('input');
        inputHidden.value = groupName;
        inputHidden.hidden = true;
        divuser.appendChild(inputHidden);

        let name = createHTMLElement('select', 'username');
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

        let influenceUnit = createHTMLElement('div', 'influenceUnit');
        divuser.appendChild(influenceUnit);
        let influenceplayer = createHTMLElement('div', 'influenceplayer');
        divuser.appendChild(influenceplayer);
        let unit1 = createHTMLElement('div', 'unit1');
        divuser.appendChild(unit1);
        let unit2 = createHTMLElement('div', 'unit2');
        divuser.appendChild(unit2);
        let unit3 = createHTMLElement('div', 'unit3');
        divuser.appendChild(unit3);
        let unit4 = createHTMLElement('div', 'unit4');
        divuser.appendChild(unit4);

        createNewline(name, data, influenceplayer, influenceUnit, unit1, unit2, unit3, unit4);
        divGroup.appendChild(divuser)
    }
    creategroup.appendChild(divGroup)
}

// --------------------------------------------------------
// ------------------- Fonction annexe --------------------
// --------------------------------------------------------
function createLegend(listLegend, name) {
    let legend = createHTMLElement('div', name);
    for (let i = 0; i < listLegend.length; i++) {
        let currentlegend = document.createElement('div');
        currentlegend.textContent = listLegend[i];
        legend.appendChild(currentlegend);
    }
    return legend
}

function entete() {
    let titledivuser = document.createElement('div');
    titledivuser.classList.add('titledivuser');
    titledivuser.classList.add('divuser');

    let titlename = createHTMLElement('div', 'titlename');
    titlename.textContent = 'pseudo';
    titledivuser.appendChild(titlename);

    let titleinfluence = createHTMLElement('div', 'titleinfluence');
    titleinfluence.innerHTML = 'influence <br> unités / joueur';
    titledivuser.appendChild(titleinfluence);

    let divnameunit = createHTMLElement('div', 'divnameunit');

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

    return titledivuser
}

function namegroup(data, groupNumber) {
    const divnameUserGroup = createHTMLElement('div', 'divnamegroup' + groupNumber);
    divnameUserGroup.classList.add('divnamegroup');

    const nameUserGroup = createHTMLElement('div', 'namegroup' + groupNumber);
    nameUserGroup.classList.add('namegroup');
    nameUserGroup.textContent = "Nom du groupe : ";
    divnameUserGroup.appendChild(nameUserGroup);

    const inputnameUserGroup = createHTMLElement('input', 'inputnamegroup' + groupNumber);
    inputnameUserGroup.type = 'text';
    if (data.NameGroupGvG[groupNumber]) {
        inputnameUserGroup.placeholder = data.NameGroupGvG[groupNumber];
    } else {
        inputnameUserGroup.placeholder = 'Nom du groupe';
    }
    divnameUserGroup.appendChild(inputnameUserGroup);

    return divnameUserGroup
}

// --------------------------------------------------------
// ----------------- Fonction fetch back ------------------
// --------------------------------------------------------
function saveGroup() {
    const creategroup = document.getElementById('creategroup');
    const divuserElements = creategroup.querySelectorAll('.divuser');

    let dataToSend = [];
    divuserElements.forEach((divuserElement) => {
        let divuserObject = {};

        const inputElement = divuserElement.querySelector('input');
        const inputValue = inputElement ? inputElement.value : '';
        divuserObject['inputValue'] = inputValue;

        const selectElements = divuserElement.querySelectorAll('select');
        const selectValues = Array.from(selectElements).map(select => select.value);
        divuserObject['selectValues'] = selectValues;

        dataToSend.push(divuserObject);
    });

    const namegroupElements = creategroup.querySelectorAll('.divnamegroup');
    let namegroup = [];
    namegroupElements.forEach((divnamegroupElement) => {
        let currentGroup = [];

        const inputElement = divnamegroupElement.querySelector('input');
        const inputValue = inputElement ? inputElement.value : '';
        if (inputValue != '') {
            currentGroup[0] = divnamegroupElement.id.replace('divnamegroup', '');
            currentGroup[1] = inputValue;
        }

        namegroup.push(currentGroup);
    });

    if (dataToSend.length !== 0) {
        fetch(adressAPI + 'saveGroupInDB', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dataToSend: dataToSend, namegroup: namegroup }),
        })
            .catch(error => {
                console.error('Erreur lors de la récupération des données:', error);
            });
    }
}

// --------------------------------------------------------
// ------------ Fonction create eventlistener -------------
// --------------------------------------------------------
function createNewline(divName, data, influenceplayer, influenceUnit, unit1, unit2, unit3, unit4) {
    let selectunit1;
    let selectunit2;
    let selectunit3;
    let selectunit4;

    divName.addEventListener('change', async function () {
        const userSelected = divName.value;
        MAJlistUserSelect();

        if (selectunit1 != undefined) {
            selectunit1.style.visibility = 'hidden';
            selectunit1.value = "";
            selectunit1.innerHTML = "";
            if (selectunit2 != undefined) {
                selectunit2.style.visibility = 'hidden';
                selectunit2.value = "";
                selectunit2.innerHTML = "";
                if (selectunit3 != undefined) {
                    selectunit3.style.visibility = 'hidden';
                    selectunit3.value = "";
                    selectunit3.innerHTML = "";
                    if (selectunit4 != undefined) {
                        selectunit4.style.visibility = 'hidden';
                        selectunit4.value = "";
                        selectunit4.innerHTML = "";
                    }
                }
            }
        }
        influenceUnit.textContent = "";
        influenceplayer.textContent = "";
        if (divName.value !== "") {
            listUserSelect.push(userSelected);
            optionSelectUsername();

            for (let j = 0; j < data.ListInscripted.length; j++) {
                let userInscripted = data.ListInscripted[j];
                if (userInscripted.Username === userSelected) {

                    let usernameSansEspaces = userInscripted.Username.replace(/\s/g, '');
                    // affiche dans la liste des joueurs inscrit que le joueur est placé
                    document.getElementById('player_' + usernameSansEspaces).textContent = '✅';

                    // Unité 1
                    if (selectunit1 === undefined) {
                        selectunit1 = createSelectUnit(1, userInscripted.UserCaserne, userInscripted, usernameSansEspaces)
                        unit1.replaceWith(selectunit1);
                    }
                    // Unité 2
                    if (selectunit2 === undefined) {
                        selectunit2 = createSelectUnit(2, userInscripted.UserCaserne, userInscripted, usernameSansEspaces)
                        unit2.replaceWith(selectunit2);
                    }
                    // Unité 3
                    if (selectunit3 === undefined) {
                        selectunit3 = createSelectUnit(3, userInscripted.UserCaserne, userInscripted, usernameSansEspaces)
                        unit3.replaceWith(selectunit3);
                    }
                    // Unité 4
                    if (selectunit4 === undefined) {
                        selectunit4 = createSelectUnit(4, userInscripted.UserCaserne, userInscripted, usernameSansEspaces)
                        unit4.replaceWith(selectunit4);
                    }

                    if (userSelected !== "") {
                        // mise à jour des balises select avec les nouvelles unités
                        await updateSelectUnit(data, selectunit1, selectunit2, selectunit3, selectunit4, userSelected);

                        selectunit1.value = "";
                        selectunit1.style.visibility = 'visible';
                        influenceUnit.id = 'influUnit' + usernameSansEspaces;
                        influenceUnit.textContent = 0;
                        influenceplayer.id = 'influPlayer' + usernameSansEspaces;
                        influenceplayer.textContent = '/ ' + userInscripted.Influence;
                        createEventSelectUnit(divName, influenceplayer, influenceUnit, selectunit1, selectunit2, selectunit3, selectunit4, userInscripted, usernameSansEspaces)
                    } else {
                        influenceplayer.textContent = "";
                        influenceUnit.textContent = "";
                        selectunit1.value = "";
                        selectunit1.style.visibility = 'hidden';
                    }
                    selectunit2.value = "";
                    selectunit2.style.visibility = 'hidden';
                    selectunit3.value = "";
                    selectunit3.style.visibility = 'hidden';
                    selectunit4.value = "";
                    selectunit4.style.visibility = 'hidden';
                    break;
                }
            }
        }
    });
}

function createEventSelectUnit(divName, influenceplayer, influenceUnit, selectunit1, selectunit2, selectunit3, selectunit4, infoUser, usernameSansEspaces) {
    if (divName.value === "") {
        selectunit1.style.visibility = 'hidden';
        selectunit1.value = "";
        selectunit2.style.visibility = 'hidden';
        selectunit2.value = "";
        selectunit3.style.visibility = 'hidden';
        selectunit3.value = "";
        selectunit4.style.visibility = 'hidden';
        selectunit4.value = "";
        influenceUnit.textContent = 0;
        influenceplayer.textContent = '/ ' + 0;
    } else {
        selectunit1.style.visibility = 'visible';
        if (selectunit1.value === "" || selectunit1.value === "Consulter un officier") {
            selectunit2.style.visibility = 'hidden';
        }
        if (selectunit2.value === "" || selectunit2.value === "Consulter un officier") {
            selectunit3.style.visibility = 'hidden';
        }
        if (selectunit3.value === "" || selectunit3.value === "Consulter un officier") {
            selectunit4.style.visibility = 'hidden';
        }
    }

    selectunit1.addEventListener('change', function () {
        if (selectunit1.value === "") {
            selectunit2.style.visibility = 'hidden';
            selectunit2.value = "";
            selectunit3.style.visibility = 'hidden';
            selectunit3.value = "";
            selectunit4.style.visibility = 'hidden';
            selectunit4.value = "";
        } else if (selectunit1.value === "Consulter un officier") {
            selectunit2.style.visibility = 'hidden';
            selectunit2.value = "";
            selectunit3.style.visibility = 'hidden';
            selectunit3.value = "";
            selectunit4.style.visibility = 'hidden';
            selectunit4.value = "";
        } else {
            selectunit2.style.visibility = 'visible';
        }
        changeInfluUnit(infoUser.UserCaserne, usernameSansEspaces);
    });

    selectunit2.addEventListener('change', function () {
        if (selectunit2.value === "") {
            selectunit3.style.visibility = 'hidden';
            selectunit3.value = "";
            selectunit4.style.visibility = 'hidden';
            selectunit4.value = "";
        } else if (selectunit2.value === "Consulter un officier") {
            selectunit3.style.visibility = 'hidden';
            selectunit3.value = "";
            selectunit4.style.visibility = 'hidden';
            selectunit4.value = "";
        } else {
            selectunit3.style.visibility = 'visible';
        }
        changeInfluUnit(infoUser.UserCaserne, usernameSansEspaces);
    });

    selectunit3.addEventListener('change', function () {
        if (selectunit3.value === "") {
            selectunit4.style.visibility = 'hidden';
            selectunit4.value = "";
        } else if (selectunit3.value === "Consulter un officier") {
            selectunit4.style.visibility = 'hidden';
            selectunit4.value = "";
        } else {
            selectunit4.style.visibility = 'visible';
        }
        changeInfluUnit(infoUser.UserCaserne, usernameSansEspaces);
    });

    selectunit4.addEventListener('change', function () {
        changeInfluUnit(infoUser.UserCaserne, usernameSansEspaces);
    });
}

// --------------------------------------------------------
// -------- Fonction annexe, gestion eventlistener --------
// --------------------------------------------------------
function changeInfluUnit(UserCaserne, username) {
    let unitValues = [];
    for (let i = 1; i <= 4; i++) {
        let unitElement = document.getElementById('unit' + i + username);
        let unit = unitElement ? unitElement.value : null;
        unitValues.push(unit);
    }

    let newValue = 0;
    if (UserCaserne !== null && UserCaserne.length !== undefined) {
        for (let j = 0; j < UserCaserne.length; j++) {
            const unit = UserCaserne[j];
            if (unitValues.includes(unit.Unit_name)) {
                newValue += parseInt(unit.Unit_influence, 10);
            }
        }
    }
    let divInfluenceUnit = document.getElementById('influUnit' + username);
    divInfluenceUnit.textContent = newValue;
    let divInfluenceplayer = document.getElementById('influPlayer' + username);
    let influenceplayer = parseInt(divInfluenceplayer.textContent, 10);
    if (influenceplayer < newValue) {
        divInfluenceUnit.style.color = 'red';
    } else {
        divInfluenceUnit.style.color = 'white';
    }
}

function usersInGroup(listGroupGvG) {
    let usersInGroup = [];
    for (let i = 0; i < listGroupGvG.length; i++) {
        const currentUser = listGroupGvG[i];
        if (groupNumber == currentUser.GroupNumber) {
            usersInGroup.push(currentUser);
        }
    }
    return usersInGroup
}

function MAJlistUserSelect() {
    let divs = document.querySelectorAll('.username');
    listUserSelect = [];
    divs.forEach(div => {
        div.querySelectorAll('option').forEach(option => {
            if (option.selected && option.value !== "") {
                listUserSelect.push(option.value);
            }
        });
    });

    let divsplace = document.querySelectorAll('.divplace');
    divsplace.forEach(div => {
        if (div.id.includes('player_')) {
            if (listUserSelect.some(element => element.replace(/\s/g, '') === div.id.replace(/^player_/, ''))) {
                div.textContent = '✅';
            } else {
                div.textContent = '❌';
            }
        }
    });


    optionSelectUsername();
}

function optionSelectUsername() {
    let divs = document.querySelectorAll('.username');
    divs.forEach(div => {
        div.querySelectorAll('option').forEach(option => {
            if (listUserSelect.includes(option.value)) {
                option.style.display = 'none';
            } else {
                option.style.display = '';
            }
        });
    });
}

// mise à jour des balises select avec les nouvelles unités
function updateSelectUnit(data, selectunit1, selectunit2, selectunit3, selectunit4, userSelected) {
    let infoUsersave = {};
    for (let j = 0; j < data.ListInscripted.length; j++) {
        let userInscripted = data.ListInscripted[j];
        if (userInscripted.Username.replace(/\s/g, '') === userSelected) {
            infoUsersave = userInscripted;
            break;
        }
    }
    const usernameSansEspaces = infoUsersave.Username.replace(/\s/g, '');
    insertSelectUnit(selectunit1, infoUsersave.UserCaserne, "", 0);
    selectunit1.id = 'unit1' + usernameSansEspaces;
    insertSelectUnit(selectunit2, infoUsersave.UserCaserne, "", 0);
    selectunit2.id = 'unit1' + usernameSansEspaces;
    insertSelectUnit(selectunit3, infoUsersave.UserCaserne, "", 0);
    selectunit3.id = 'unit1' + usernameSansEspaces;
    insertSelectUnit(selectunit4, infoUsersave.UserCaserne, "", 0);
    selectunit4.id = 'unit1' + usernameSansEspaces;
}