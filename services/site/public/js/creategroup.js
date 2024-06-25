import { adressAPI } from "./config.js";
import { communBlock, createHTMLElement, fetchServer, fetchlogout, removeHTMLTags } from "./useful.js";

export async function creategroup() {
    containercreategroup(await fetchServer('creategroup'));
}

let groupNumber = 1;
let listUserSelect = [];
let timerThrottlebutton = 0;
let eventListenersMap = new Map();
export async function containercreategroup(data) {
    if (data.Gestion.Logged && data.Gestion.Officier) {
        communBlock(data);

        let Container = document.getElementById('Container');
        let containerGroupe = await createHTMLElement('div', 'containerGroupe');

        // affichage de la liste des inscrits
        let divlistInscripted = await listInscripted(data.ListInscripted);
        containerGroupe.appendChild(divlistInscripted);

        // afficher l'encart de selection d'une unit et savoir qui là
        let divwhohaveunit = await whohaveunit(data);
        containerGroupe.appendChild(divwhohaveunit);

        let divcreategroup = await createHTMLElement('div', 'divcreategroup');
        divcreategroup.style.display = 'none';

        // Boutton pour afficher l'encart de création des groupes
        let buttonDisplaycreategroup = await createHTMLElement('div', 'buttonDisplaycreategroup');
        buttonDisplaycreategroup.textContent = '》Création des groupes GvG'; //︾
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
        buttonAddGroup.textContent = '➕ Ajouter un groupe';
        divcreategroup.appendChild(buttonAddGroup);
        buttonAddGroup.addEventListener('click', function () {
            const now = new Date();
            if (now - timerThrottlebutton > 1000) {
                timerThrottlebutton = now;
                createOneGroupe(data);
                groupNumber += 1;
            }
        });

        // Boutton pour sauvegarder les groupes
        let buttonSaveGroup = await createHTMLElement('div', 'buttonSaveGroup');
        buttonSaveGroup.textContent = '💾 Sauvegarder les groupes';
        divcreategroup.appendChild(buttonSaveGroup);
        buttonSaveGroup.addEventListener('click', function () {
            const now = new Date();
            if (now - timerThrottlebutton > 1000) {
                timerThrottlebutton = now;
                saveGroup('current');
                window.location.href = '/creategroup';
            }
        });

        // Boutton pour les groupes
        let buttonGroupType = await createHTMLElement('div', 'buttonGroupType');
        buttonGroupType.textContent = '》Groupes type';
        divcreategroup.appendChild(buttonGroupType);
        buttonGroupType.addEventListener('click', function () {
            const now = new Date();
            if (now - timerThrottlebutton > 500) {
                timerThrottlebutton = now;
                if (document.getElementById('divGroupType').style.display === 'none') {
                    buttonGroupType.textContent = "︾ Groupe type"; // ︾
                    document.getElementById('divGroupType').style.display = 'flex';
                } else {
                    buttonGroupType.textContent = "》Groupe type"; // ︾
                    document.getElementById('divGroupType').style.display = 'none';
                }
            }
        });
        // Contenu pour les groupes
        divcreategroup.appendChild(await groupType());

        // événements du boutton d'affichage des inscrits
        document.getElementById('buttonDisplayInscripted').addEventListener('click', function () {
            const now = new Date();
            if (now - timerThrottlebutton > 500) {
                timerThrottlebutton = now;
                if (document.getElementById('divinscripted').style.display === 'none') {
                    document.getElementById('buttonDisplayInscripted').textContent = '︾ Liste des inscrits';
                    document.getElementById('legendInscripted').style.display = 'flex';
                    document.getElementById('divinscripted').style.display = 'block';
                } else {
                    document.getElementById('buttonDisplayInscripted').textContent = '》Liste des inscrits';
                    document.getElementById('legendInscripted').style.display = 'none';
                    document.getElementById('divinscripted').style.display = 'none';
                }
            }
        });

        // événements du boutton pour afficher "qui à l'unité ?"
        document.getElementById('buttonDisplaywhohaveunit').addEventListener('click', function () {
            const now = new Date();
            if (now - timerThrottlebutton > 500) {
                timerThrottlebutton = now;
                if (document.getElementById('whohaveunit').style.display === 'none') {
                    document.getElementById('buttonDisplaywhohaveunit').textContent = "︾ Qui à l'unité ?";
                    document.getElementById('whohaveunit').style.display = 'block';
                } else {
                    document.getElementById('buttonDisplaywhohaveunit').textContent = "》Qui à l'unité ?";
                    document.getElementById('whohaveunit').style.display = 'none';
                }
            }
        });

        // événements du boutton pour afficher la création des groupes
        document.getElementById('buttonDisplaycreategroup').addEventListener('click', function () {
            const now = new Date();
            if (now - timerThrottlebutton > 500) {
                timerThrottlebutton = now;
                if (document.getElementById('divcreategroup').style.display === 'none') {
                    document.getElementById('buttonDisplaycreategroup').textContent = '︾ Création des groupes GvG';
                    document.getElementById('divcreategroup').style.display = 'block';
                } else {
                    document.getElementById('buttonDisplaycreategroup').textContent = '》Création des groupes GvG';
                    document.getElementById('divcreategroup').style.display = 'none';
                }
            }
        });

        // création de la liste des évents des groupes type
        const listEventsaveGroupType = [['buttonSaveGroupTypeAtt', 'SaveGroupTypeAtt'], ['buttonSaveGroupTypeDef', 'SaveGroupTypeDef']];
        listEventsaveGroupType.forEach(nameButton => {
            document.getElementById(nameButton[0]).addEventListener('click', function () {
                const now = new Date();
                if (now - timerThrottlebutton > 1000) {
                    timerThrottlebutton = now;
                    saveGroup(nameButton[1]);
                }
            });
        });
        const listEventChargerGroupType = [['buttonChargerGroupTypeAtt', 'chargergrouptypeatt'], ['buttonChargerGroupTypeDef', 'chargergrouptypedef']];
        listEventChargerGroupType.forEach(nameButton => {
            document.getElementById(nameButton[0]).addEventListener('click', async function () {
                const now = new Date();
                if (now - timerThrottlebutton > 1000) {
                    timerThrottlebutton = now;
                    window.location.href = '/' + nameButton[1];
                }
            });
        });

        // Boutton pour voir les groupes de façon non modifiable
        if (data.GroupGvG != null) {
            let buttonViewGroup = await createHTMLElement('div', 'buttonViewGroup');
            buttonViewGroup.textContent = 'Prévisualisations des groupes';
            containerGroupe.appendChild(buttonViewGroup);
            buttonViewGroup.addEventListener('click', function () {
                const now = new Date();
                if (now - timerThrottlebutton > 500) {
                    timerThrottlebutton = now;
                    // saveGroup('current');
                    window.location.href = '/viewGroup';
                }
            });
        }

    } else {
        fetchlogout();
    }
}

// --------------------------------------------------------
// ------------- Partie "Liste des Inscrits" --------------
// --------------------------------------------------------
async function listInscripted(data) {
    let divlistInscripted = await createHTMLElement('div', 'listInscripted');

    // Boutton pour afficher la liste des inscrits
    let buttonDisplayInscripted = await createHTMLElement('div', 'buttonDisplayInscripted');
    buttonDisplayInscripted.id = 'buttonDisplayInscripted';
    buttonDisplayInscripted.textContent = '》Liste des inscrits';
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
// -------------- Partie "Qui a l'unité ?" ----------------
// --------------------------------------------------------
async function whohaveunit(data) {
    let divwhohaveunit = await createHTMLElement('div', 'divwhohaveunit');

    // Boutton pour afficher la liste des inscrits
    let buttonDisplaywhohaveunit = await createHTMLElement('div', 'buttonDisplaywhohaveunit');
    buttonDisplaywhohaveunit.id = 'buttonDisplaywhohaveunit';
    buttonDisplaywhohaveunit.textContent = "》Qui à l'unité ?";
    divwhohaveunit.appendChild(buttonDisplaywhohaveunit);

    let whohaveunit = await createHTMLElement('div', 'whohaveunit');
    let selectwhohaveunit = createHTMLElement('select', 'selectwhohaveunit');
    let defaultwhohaveunit = document.createElement('option');
    defaultwhohaveunit.value = "";
    defaultwhohaveunit.text = "Choisissez";
    selectwhohaveunit.appendChild(defaultwhohaveunit);
    for (let i = 0; i < data.ListUnit.length; i++) {
        const currentUnit = data.ListUnit[i];
        let option = document.createElement('option');
        option.value = currentUnit.Unit_name;
        option.text = currentUnit.Unit_name;
        selectwhohaveunit.appendChild(option);
    }
    whohaveunit.appendChild(selectwhohaveunit);

    let listplayerwhohaveunit = await createHTMLElement('div', 'listplayerwhohaveunit');
    listplayerwhohaveunit.textContent = "Choississez une unité pour connaitre la liste des joueurs qui ont cet unité";
    whohaveunit.appendChild(listplayerwhohaveunit);

    divwhohaveunit.appendChild(whohaveunit);
    whohaveunit.style.display = 'none';

    // évenement de selection de l'unité
    selectwhohaveunit.addEventListener('change', () => {
        const now = new Date();
        if (now - timerThrottlebutton > 500) {
            timerThrottlebutton = now;

            if (selectwhohaveunit.value != "") {
                let unitSelected;
                for (let i = 0; i < data.ListUnit.length; i++) {
                    if (selectwhohaveunit.value === data.ListUnit[i].Unit_name) {
                        unitSelected = data.ListUnit[i];
                        break;
                    }
                }

                let listplayer = [];
                for (let i = 0; i < data.ListInscripted.length; i++) {
                    const currentuser = data.ListInscripted[i];
                    if (currentuser.UserCaserne !== null) {
                        currentuser.UserCaserne.some((unit) => {
                            if (unit.Unit_id === unitSelected.Unit_id && unit.Unit_lvl !== "0") {
                                listplayer.push(currentuser.Username);
                            }
                        });
                    }
                }

                if (listplayer.length === 0) {
                    listplayerwhohaveunit.textContent = "Aucun joueurs n'a cet unité";
                } else {
                    listplayerwhohaveunit.textContent = listplayer.join(' - ');
                }
            } else {
                listplayerwhohaveunit.textContent = "Choississez une unité pour connaitre la liste des joueurs qui ont cet unité";
            }
        }
    });

    return divwhohaveunit
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

            // mise à jour de la divplace pour chaque joueur deja placé dans la liste des inscrits
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
        await divuser.appendChild(influenceUnit);
        let intermediairy = await createHTMLElement('div', 'intermediairy');
        await divuser.appendChild(intermediairy);
        let influenceplayer = await createHTMLElement('div', 'influenceplayer');
        await divuser.appendChild(influenceplayer);
        let unit1 = await createHTMLElement('div', 'unit1');
        await divuser.appendChild(unit1);
        let unit2 = await createHTMLElement('div', 'unit2');
        await divuser.appendChild(unit2);
        let unit3 = await createHTMLElement('div', 'unit3');
        await divuser.appendChild(unit3);
        let unit4 = await createHTMLElement('div', 'unit4');
        await divuser.appendChild(unit4);
        let selectunit1;
        let selectunit2;
        let selectunit3;
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

            const usernameSansEspaces = infoUsersave.Username.replace(/\s/g, '');
            influenceUnit.id = 'influUnit' + usernameSansEspaces;
            influenceUnit.textContent = 0;
            intermediairy.textContent = '/';
            influenceplayer.id = 'influPlayer' + usernameSansEspaces;
            influenceplayer.textContent = infoUsersave.Influence;

            // Unité 1
            selectunit1 = await createSelectUnit(1, infoUsersave.UserCaserne, currentUser, usernameSansEspaces, 1);
            await unit1.replaceWith(selectunit1);
            // Unité 2
            selectunit2 = await createSelectUnit(2, infoUsersave.UserCaserne, currentUser, usernameSansEspaces, 1);
            await unit2.replaceWith(selectunit2);
            // Unité 3
            selectunit3 = await createSelectUnit(3, infoUsersave.UserCaserne, currentUser, usernameSansEspaces, 1);
            await unit3.replaceWith(selectunit3);
            // Unité 4
            selectunit4 = await createSelectUnit(4, infoUsersave.UserCaserne, currentUser, usernameSansEspaces, 1);
            await unit4.replaceWith(selectunit4);

            await createEventSelectUnit(name, influenceplayer, intermediairy, influenceUnit, selectunit1, selectunit2, selectunit3, selectunit4, infoUsersave, usernameSansEspaces);

            // création des events listener
            name.addEventListener('change', function () {
                // delete des eventuels ancien event listener
                let userSelected = name.value;

                MAJlistUserSelect();

                if (selectunit1 != undefined) {
                    selectunit1.style.visibility = 'hidden';
                    selectunit1.value = "";
                    selectunit1.innerHTML = "";
                    selectunit1.id = 'unit1';
                    if (selectunit2 != undefined) {
                        selectunit2.style.visibility = 'hidden';
                        selectunit2.value = "";
                        selectunit2.innerHTML = "";
                        selectunit2.id = 'unit2';
                        if (selectunit3 != undefined) {
                            selectunit3.style.visibility = 'hidden';
                            selectunit3.value = "";
                            selectunit3.innerHTML = "";
                            selectunit3.id = 'unit3';
                            if (selectunit4 != undefined) {
                                selectunit4.style.visibility = 'hidden';
                                selectunit4.value = "";
                                selectunit4.innerHTML = "";
                                selectunit4.id = 'unit4';
                            }
                        }
                    }
                }
                influenceUnit.id = 'influUnit';
                influenceUnit.textContent = "";
                intermediairy.textContent = "";
                influenceplayer.id = 'influPlayer';
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
                        const userInscripted = data.ListInscripted[j];
                        if (userInscripted.Username === userSelected) {
                            const usernameSansEspaces = userInscripted.Username.replace(/\s/g, '');
                            influenceUnit.id = 'influUnit' + usernameSansEspaces;
                            influenceUnit.textContent = 0;
                            intermediairy.textContent = '/';
                            influenceplayer.id = 'influPlayer' + usernameSansEspaces;
                            influenceplayer.textContent = userInscripted.Influence;
                            createEventSelectUnit(name, influenceplayer, intermediairy, influenceUnit, selectunit1, selectunit2, selectunit3, selectunit4, userInscripted, usernameSansEspaces)
                            break;
                        }
                    }
                }
            });
        } else { // utilisateur non present
            createNewline(name, data, influenceplayer, intermediairy, influenceUnit, unit1, unit2, unit3, unit4);
        }
        divGroup.appendChild(divuser);
    }

    creategroup.appendChild(divGroup);
    for (let i = 0; i < userIngroup.length; i++) {
        let currentUser = userIngroup[i];
        if (currentUser != undefined && currentUser != null) {
            for (let j = 0; j < data.ListInscripted.length; j++) {
                let userInscripted = data.ListInscripted[j];
                if (userInscripted.ID === currentUser.User_ID) {
                    const usernameSansEspaces = userInscripted.Username.replace(/\s/g, '');
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
    if (numberUnit === 1) {
        nameUnit = currentUser.Unit1
    } else if (numberUnit === 2) {
        nameUnit = currentUser.Unit2
    } else if (numberUnit === 3) {
        nameUnit = currentUser.Unit3
    } else if (numberUnit === 4) {
        nameUnit = currentUser.Unit4
    }

    const selectunit = createHTMLElement('select', 'unit' + numberUnit + usernameSansEspaces);
    selectunit.name = 'unit' + numberUnit + usernameSansEspaces;
    if (nameUnit !== undefined) {
        insertSelectUnit(selectunit, caserne, nameUnit, optionUser);
    }

    return selectunit
}

function insertSelectUnit(selectunit, caserne, nameUnit, optionUser) {
    let Consulterunofficier = false;
    const defaultoptionUnit = document.createElement("option");
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

            let textoption = "";
            if (unit.Unit_maitrise === '1' && unit.UserMaitrise === '0') {
                textoption = '🔴 ' + unit.Unit_name + ' (lvl ' + unit.Unit_lvl + ')';
            } else if (unit.Unit_maitrise === '1' && unit.UserMaitrise === '1') {
                textoption = '🟡 ' + unit.Unit_name + ' (lvl ' + unit.Unit_lvl + ')';
            } else if (unit.Unit_maitrise === '1' && unit.UserMaitrise === '2') {
                textoption = '🟢 ' + unit.Unit_name + ' (lvl ' + unit.Unit_lvl + ')';
            } else {
                textoption = unit.Unit_name + ' (lvl ' + unit.Unit_lvl + ')';
            }

            if (unit.Unit_name === nameUnit && unit.Unit_lvl !== "0") {
                defaultoptionUnit.value = nameUnit;
                defaultoptionUnit.text = textoption;
            }

            if (unit.Unit_name !== nameUnit && unit.Unit_lvl !== "0") {
                const option = document.createElement('option');
                option.value = unit.Unit_name;
                option.text = textoption;
                if (unit.Unit_tier === 'T5') {
                    optgroupT5.appendChild(option)
                } else if (unit.Unit_tier === 'T4') {
                    optgroupT4.appendChild(option)
                } else if (unit.Unit_tier === 'T3') {
                    optgroupT3.appendChild(option)
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
        let intermediairy = createHTMLElement('div', 'intermediairy');
        divuser.appendChild(intermediairy);
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

        createNewline(name, data, influenceplayer, intermediairy, influenceUnit, unit1, unit2, unit3, unit4);
        divGroup.appendChild(divuser)
    }
    creategroup.appendChild(divGroup)
    optionSelectUsername();
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
function saveGroup(optiontype) {
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
            currentGroup[1] = removeHTMLTags(inputValue);
        }

        namegroup.push(currentGroup);
    });

    if (dataToSend.length !== 0) {
        fetch(adressAPI + 'saveGroupInDB', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dataToSend: dataToSend, namegroup: namegroup, optiontype: optiontype }),
        })
            .catch(error => {
                console.error('Erreur lors de la récupération des données:', error);
            });
    }
}

// --------------------------------------------------------
// ------------ Fonction create eventlistener -------------
// --------------------------------------------------------
function createNewline(divName, data, influenceplayer, intermediairy, influenceUnit, unit1, unit2, unit3, unit4) {
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
            selectunit1.id = 'unit1';
            if (selectunit2 != undefined) {
                selectunit2.style.visibility = 'hidden';
                selectunit2.value = "";
                selectunit2.innerHTML = "";
                selectunit2.id = 'unit2';
                if (selectunit3 != undefined) {
                    selectunit3.style.visibility = 'hidden';
                    selectunit3.value = "";
                    selectunit3.innerHTML = "";
                    selectunit3.id = 'unit3';
                    if (selectunit4 != undefined) {
                        selectunit4.style.visibility = 'hidden';
                        selectunit4.value = "";
                        selectunit4.innerHTML = "";
                        selectunit4.id = 'unit4';
                    }
                }
            }
        }
        influenceUnit.id = 'influUnit';
        influenceUnit.textContent = "";
        intermediairy.textContent = "";
        influenceUnit.id = 'influPlayer';
        influenceplayer.textContent = "";

        if (divName.value !== "") {
            listUserSelect.push(userSelected);
            optionSelectUsername();

            for (let j = 0; j < data.ListInscripted.length; j++) {
                let userInscripted = data.ListInscripted[j];
                if (userInscripted.Username === userSelected) {

                    const usernameSansEspaces = userInscripted.Username.replace(/\s/g, '');
                    // affiche dans la liste des joueurs inscrit que le joueur est placé
                    document.getElementById('player_' + usernameSansEspaces).textContent = '✅';

                    // Unité 1
                    if (selectunit1 === undefined) {
                        selectunit1 = await createSelectUnit(1, userInscripted.UserCaserne, userInscripted, usernameSansEspaces)
                        unit1.replaceWith(selectunit1);
                    }
                    // Unité 2
                    if (selectunit2 === undefined) {
                        selectunit2 = await createSelectUnit(2, userInscripted.UserCaserne, userInscripted, usernameSansEspaces)
                        unit2.replaceWith(selectunit2);
                    }
                    // Unité 3
                    if (selectunit3 === undefined) {
                        selectunit3 = await createSelectUnit(3, userInscripted.UserCaserne, userInscripted, usernameSansEspaces)
                        unit3.replaceWith(selectunit3);
                    }
                    // Unité 4
                    if (selectunit4 === undefined) {
                        selectunit4 = await createSelectUnit(4, userInscripted.UserCaserne, userInscripted, usernameSansEspaces)
                        unit4.replaceWith(selectunit4);
                    }

                    if (userSelected !== "") {
                        // mise à jour des balises select avec les nouvelles unités
                        updateSelectUnit(data, selectunit1, selectunit2, selectunit3, selectunit4, userSelected);
                        selectunit1.value = "";
                        selectunit1.style.visibility = 'visible';
                        influenceUnit.id = 'influUnit' + usernameSansEspaces;
                        influenceUnit.textContent = 0;
                        intermediairy.textContent = '/';
                        influenceplayer.id = 'influPlayer' + usernameSansEspaces;
                        influenceplayer.textContent = userInscripted.Influence;
                        createEventSelectUnit(divName, influenceplayer, intermediairy, influenceUnit, selectunit1, selectunit2, selectunit3, selectunit4, userInscripted, usernameSansEspaces)
                    } else {
                        influenceplayer.textContent = "";
                        intermediairy.textContent = "";
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

async function createEventSelectUnit(divName, influenceplayer, intermediairy, influenceUnit, selectunit1, selectunit2, selectunit3, selectunit4, infoUser, usernameSansEspaces) {
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
        intermediairy.textContent = '/';
        influenceplayer.textContent = 0;
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
        selectunit1.id = 'unit1' + usernameSansEspaces;
        selectunit2.id = 'unit2' + usernameSansEspaces;
        selectunit3.id = 'unit3' + usernameSansEspaces;
        selectunit4.id = 'unit4' + usernameSansEspaces;
        influenceUnit.id = 'influUnit' + usernameSansEspaces;
        influenceplayer.id = 'influPlayer' + usernameSansEspaces;
    }

    const selectunit1EventListener = function () {
        if (selectunit1.value === "" || selectunit1.value === "Consulter un officier") {
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
    };

    const selectunit2EventListener = function () {
        if (selectunit2.value === "" || selectunit2.value === "Consulter un officier") {
            selectunit3.style.visibility = 'hidden';
            selectunit3.value = "";
            selectunit4.style.visibility = 'hidden';
            selectunit4.value = "";
        } else {
            selectunit3.style.visibility = 'visible';
        }
        changeInfluUnit(infoUser.UserCaserne, usernameSansEspaces);
    };

    const selectunit3EventListener = function () {
        if (selectunit3.value === "" || selectunit3.value === "Consulter un officier") {
            selectunit4.style.visibility = 'hidden';
            selectunit4.value = "";
        } else {
            selectunit4.style.visibility = 'visible';
        }
        changeInfluUnit(infoUser.UserCaserne, usernameSansEspaces);
    };

    const selectunit4EventListener = function () {
        changeInfluUnit(infoUser.UserCaserne, usernameSansEspaces);
    };

    // ajout des nouveaux dans la map
    eventListenersMap.set(usernameSansEspaces, [
        selectunit1EventListener,
        selectunit2EventListener,
        selectunit3EventListener,
        selectunit4EventListener,
    ]);
    // activation des eventlisteners
    await selectunit1.addEventListener('change', selectunit1EventListener);
    await selectunit2.addEventListener('change', selectunit2EventListener);
    await selectunit3.addEventListener('change', selectunit3EventListener);
    await selectunit4.addEventListener('change', selectunit4EventListener);
}

async function deleteEventListeners() {
    // Parcourir tous les event listeners dans eventListenersMap
    for (let [usernameSansEspaces, eventListeners] of eventListenersMap) {
        // Sélectionner tous les éléments avec la classe "divuser"
        document.querySelectorAll('.divuser').forEach(parentDiv => {
            // Parcourir tous les descendants de chaque élément avec la classe "divuser"
            parentDiv.querySelectorAll('*').forEach(element => {
                // Vérifier si l'élément contient 'unit1', 'unit2', 'unit3', ou 'unit4' dans son ID
                if (element.id.startsWith('unit1') || element.id.startsWith('unit2') ||
                    element.id.startsWith('unit3') || element.id.startsWith('unit4')) {
                    // Extraire le numéro d'unité (1, 2, 3, 4)
                    const unitNumber = element.id.charAt(4);
                    // Construire le nom d'utilisateur attendu (unit + numéro + usernameSansEspaces)
                    const expectedId = 'unit' + unitNumber + usernameSansEspaces;

                    // Vérifier si l'ID de l'élément est dans listUserSelect
                    if (!listUserSelect.includes(element.id.substring(5)) && element.id === expectedId) {
                        // Supprimer l'event listener si l'ID de l'élément correspond
                        element.removeEventListener('change', eventListeners[0]);
                        element.removeEventListener('change', eventListeners[1]);
                        element.removeEventListener('change', eventListeners[2]);
                        element.removeEventListener('change', eventListeners[3]);
                        eventListenersMap.delete(usernameSansEspaces);
                    }

                }
            });
        });
    }
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

    // setTimeout(() => {
    let divInfluenceUnit = document.getElementById('influUnit' + username);
    divInfluenceUnit.textContent = newValue;
    const divInfluenceplayer = document.getElementById('influPlayer' + username);
    const influenceplayer = parseInt(divInfluenceplayer.textContent, 10);
    if (influenceplayer < newValue) {
        divInfluenceUnit.style.color = 'red';
    } else {
        divInfluenceUnit.style.color = 'white';
    }

    optionSelectUnit(username, UserCaserne, influenceplayer, newValue);
    // }, 200);
}

function optionSelectUnit(username, UserCaserne, influenceplayer, influenceAllUnitSelected) {
    const units = [
        document.getElementById('unit1' + username),
        document.getElementById('unit2' + username),
        document.getElementById('unit3' + username),
        document.getElementById('unit4' + username)
    ];

    units.forEach((unit, index) => {
        if (unit) {
            const listUnitSelected = units
                .filter((_, i) => i !== index && units[i].value !== "")
                .map(unit => unit.value);

            unit.querySelectorAll('option').forEach(option => {
                if (option.value !== "" && listUnitSelected.includes(option.value)) {
                    option.style.display = 'none';
                } else {
                    let exceedingInfluence = false;
                    if (UserCaserne !== null &&
                        UserCaserne.length !== undefined &&
                        (influenceUnit(UserCaserne, option.value) + influenceAllUnitSelected - influenceUnit(UserCaserne, unit.value)) > influenceplayer) {
                        // Masqué l'unité si :
                        // (influence unnités à tester + influences des unités déjà sélectionné - l'influence de l'unité du select en cour de modification) > influence du joueur
                        option.style.display = 'none';
                        exceedingInfluence = true
                    }
                    if (!exceedingInfluence) {
                        option.style.display = '';
                    }
                }
            });
        }
    });
}

function influenceUnit(UserCaserne, unitName = "") {
    if (unitName === "") {
        return 0
    }
    for (let j = 0; j < UserCaserne.length; j++) {
        if (UserCaserne[j].Unit_name === unitName) {
            return parseInt(UserCaserne[j].Unit_influence, 10);
        }
    }
    return 0
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

    // si absent de la selection, supression de la map d'eventlistener
    deleteEventListeners();

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
        if (userInscripted.Username.replace(/\s/g, '') === userSelected.replace(/\s/g, '')) {
            infoUsersave = userInscripted;
            break;
        }
    }

    const usernameSansEspaces = infoUsersave.Username.replace(/\s/g, '');
    insertSelectUnit(selectunit1, infoUsersave.UserCaserne, "", 0);
    selectunit1.id = 'unit1' + usernameSansEspaces;
    insertSelectUnit(selectunit2, infoUsersave.UserCaserne, "", 0);
    selectunit2.id = 'unit2' + usernameSansEspaces;
    insertSelectUnit(selectunit3, infoUsersave.UserCaserne, "", 0);
    selectunit3.id = 'unit3' + usernameSansEspaces;
    insertSelectUnit(selectunit4, infoUsersave.UserCaserne, "", 0);
    selectunit4.id = 'unit4' + usernameSansEspaces;

}

function groupType() {
    let groupType = createHTMLElement('div', 'divGroupType');
    groupType.style.display = 'none';

    // Avertissement
    let information = document.createElement('p');
    information.innerHTML = `Sauvegarder va écraser le groupe type correspondant.</br>
    Lors du chargement d'un groupe type, les joueurs non inscrits ne seront pas affichés et les lignes resteront vides.`;
    groupType.appendChild(information);

    // Sauvegarde
    let divSave = createHTMLElement('div', 'divSave');
    let titlesaveGroupType = document.createElement('h2');
    titlesaveGroupType.textContent = 'Sauvegarder le groupe type en tant que';
    divSave.appendChild(titlesaveGroupType);
    let saveGroupType = createHTMLElement('div', 'saveGroupType');
    let buttonSaveGroupTypeAtt = createHTMLElement('div', 'buttonSaveGroupTypeAtt');
    buttonSaveGroupTypeAtt.textContent = 'Attaque';
    saveGroupType.appendChild(buttonSaveGroupTypeAtt);

    let buttonSaveGroupTypeDef = createHTMLElement('div', 'buttonSaveGroupTypeDef');
    buttonSaveGroupTypeDef.textContent = 'Défense';
    saveGroupType.appendChild(buttonSaveGroupTypeDef);
    divSave.appendChild(saveGroupType);
    groupType.appendChild(divSave);

    // Chargement
    let divCharger = createHTMLElement('div', 'divCharger');
    let titlechargerGroupType = document.createElement('h2');
    titlechargerGroupType.textContent = 'Charger le groupe type';
    divCharger.appendChild(titlechargerGroupType);
    let chargerGroupType = createHTMLElement('div', 'chargerGroupType');
    let buttonChargerGroupTypeAtt = createHTMLElement('div', 'buttonChargerGroupTypeAtt');
    buttonChargerGroupTypeAtt.textContent = 'Attaque';
    chargerGroupType.appendChild(buttonChargerGroupTypeAtt);

    let buttonChargerGroupTypeDef = createHTMLElement('div', 'buttonChargerGroupTypeDef');
    buttonChargerGroupTypeDef.textContent = 'Défense';
    chargerGroupType.appendChild(buttonChargerGroupTypeDef);
    divCharger.appendChild(chargerGroupType);
    groupType.appendChild(divCharger);

    return groupType
}
