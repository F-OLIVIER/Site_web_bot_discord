import { adressAPI } from "./home.js";
import { cookieName } from "./main.js";
import { communBlock, createHTMLElement } from "./useful.js";

export function administration() {
    if (!document.cookie.split(";").some((item) => item.trim().startsWith(cookieName + "="))) {
        window.location.href = '/';
    }
    // Si le cookie est present, fetch des données. Le back fera une vérification de la validité du cookie
    fetch(adressAPI + 'CheckAppAdmin')
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
            // console.log('Data received (administration):', data);
            containerAppAdmin(data);
        })
        .catch(error => {
            // Gérer les erreurs
            console.error('Data recovery error:', error);
        });
}

function containerAppAdmin(data) {
    if (data.Gestion.Logged && data.Gestion.Officier) {
        communBlock(data)

        let subContainer = createHTMLElement('div', 'subContainerbotEtat');

        // Etat du bot
        let divBotEtat = createHTMLElement('div', 'divBotEtat');
        let botEtat = createHTMLElement('div', 'botEtat');
        let buttonBotEtat = createHTMLElement('button', 'buttonBotEtat');
        buttonBotEtat.type = 'button';
        buttonBotEtat.className = 'buttonBotEtat';
        if (data.Gestion.BotActivate) {
            botEtat.textContent = "Fonction automatique du bot discord actif";
            buttonBotEtat.value = "false";
            buttonBotEtat.textContent = 'Désactiver les fonctions automatique';
        } else {
            botEtat.textContent = "Fonction automatique du bot discord inactif";
            buttonBotEtat.value = "true";
            buttonBotEtat.textContent = 'Activer les fonctions automatique';
        }
        divBotEtat.appendChild(botEtat);
        divBotEtat.appendChild(buttonBotEtat);
        subContainer.appendChild(divBotEtat);

        // Ajouter une unité
        let divErrorAddUnit = document.createElement('div');
        divErrorAddUnit.id = 'divErrorAddUnit';
        divErrorAddUnit.className = 'divError';
        divErrorAddUnit.style.display = 'none';
        subContainer.appendChild(divErrorAddUnit);

        let divNewUnit = createHTMLElement('div', 'divNewUnit');
        let titleNewUnit = createHTMLElement('div', 'titleNewUnit');
        titleNewUnit.textContent = 'Ajouter une nouvelle unité';
        divNewUnit.appendChild(titleNewUnit);

        let formNewUnit = document.createElement('form');
        formNewUnit.id = 'formNewUnit';
        formNewUnit.className = 'newUnit';
        formNewUnit.method = 'POST';
        formNewUnit.enctype = 'multipart/form-data';
        // Unit_name
        let input_Unit_name = createHTMLElement('input', 'nameNewUnit');
        input_Unit_name.placeholder = "Nom de l'unité";
        input_Unit_name.required;
        formNewUnit.appendChild(input_Unit_name);
        // Unit_influence
        let input_Unit_influence = createHTMLElement('input', 'influNewUnit');
        input_Unit_influence.type = 'number';
        input_Unit_influence.required;
        input_Unit_influence.placeholder = "Influence de l'unité";
        formNewUnit.appendChild(input_Unit_influence);
        // Unit_lvlMax
        let input_Unit_lvlMax = createHTMLElement('input', 'lvlMaxNewUnit');
        input_Unit_lvlMax.type = 'number';
        input_Unit_lvlMax.required;
        input_Unit_lvlMax.placeholder = "Level max de l'unité";
        formNewUnit.appendChild(input_Unit_lvlMax);
        // Unit_tier
        let input_Unit_tier = createHTMLElement('select', 'tierNewUnit');
        input_Unit_tier.required;
        let title_option_Unit_tier = ["Tier de l'unité", "T3", "T4", "T5"];
        let option_Unit_tier = ["", "T3", "T4", "T5"];
        for (let i = 0; i < option_Unit_tier.length; i++) {
            let option = document.createElement('option');
            option.value = option_Unit_tier[i];
            option.text = title_option_Unit_tier[i];
            input_Unit_tier.appendChild(option);
        }
        formNewUnit.appendChild(input_Unit_tier);
        // Unit_type
        let input_Unit_type = createHTMLElement('select', 'typeNewUnit');
        input_Unit_type.required;
        let titleOption_Unit_type = ["Type d'unité", "Infanterie", "Distant", "Cavalerie"];
        let option_Unit_type = ["", "Infanterie", "Distant", "Cavalerie"];
        for (let i = 0; i < option_Unit_type.length; i++) {
            let option = document.createElement('option');
            option.value = option_Unit_type[i];
            option.text = titleOption_Unit_type[i];
            input_Unit_type.appendChild(option);
        }
        formNewUnit.appendChild(input_Unit_type);

        // Unit_img
        let input_Unit_img = createHTMLElement('input', 'imgNewUnit');
        input_Unit_img.required;
        input_Unit_img.type = 'file';
        input_Unit_img.lang = 'fr';
        input_Unit_img.accept = '.jpg, .jpeg, .png,';
        formNewUnit.appendChild(input_Unit_img);

        // button
        let buttonNewUnit = createHTMLElement('button', 'buttonNewUnit');
        buttonNewUnit.textContent = "Ajouter l'unité";
        buttonNewUnit.type = 'submit';
        formNewUnit.appendChild(buttonNewUnit);

        divNewUnit.appendChild(formNewUnit);
        subContainer.appendChild(divNewUnit);

        // Modifier une unité
        let divErrorChangeUnit = document.createElement('div');
        divErrorChangeUnit.id = 'divErrorChangeUnit';
        divErrorChangeUnit.className = 'divError';
        divErrorChangeUnit.style.display = 'none';
        subContainer.appendChild(divErrorChangeUnit);

        let divChangeUnit = createHTMLElement('div', 'divChangeUnit');
        let titleChangeUnit = document.createElement('div');
        titleChangeUnit.className = 'titleChangeUnit'
        titleChangeUnit.textContent = 'Modifier une unité';
        divChangeUnit.appendChild(titleChangeUnit);

        let formChangeUnit = createHTMLElement('form', 'formchangeUnit');
        formChangeUnit.enctype = 'multipart/form-data';
        formChangeUnit.method = 'POST';
        let selectChangeUnit = createHTMLElement('select', 'selectChangeUnit');
        let defaultChangeUnit = document.createElement('option');
        defaultChangeUnit.value = "";
        defaultChangeUnit.text = "Choisissez";
        selectChangeUnit.appendChild(defaultChangeUnit);
        for (let i = 0; i < data.ListUnit.length; i++) {
            const currentUnit = data.ListUnit[i];
            let option = document.createElement('option');
            option.value = currentUnit.Unit_name;
            option.text = currentUnit.Unit_name;
            selectChangeUnit.appendChild(option);
        }
        formChangeUnit.appendChild(selectChangeUnit);
        divChangeUnit.appendChild(formChangeUnit);
        subContainer.appendChild(divChangeUnit);

        // Ajouter une nouvelle classe
        let divNewclass = createHTMLElement('div', 'divNewclass');
        let titleNewclass = createHTMLElement('div', 'titleNewclass');
        titleNewclass.textContent = 'Ajouter une nouvelle arme';
        divNewclass.appendChild(titleNewclass);

        let formNewclass = document.createElement('form');
        formNewclass.id = 'formNewclass';
        formNewclass.className = 'formNewclass';
        formNewclass.method = 'POST';
        // class_name
        let input_class_name = createHTMLElement('input', 'nameNewclass');
        input_class_name.placeholder = "Nom de la nouvelle arme";
        input_class_name.required;
        formNewclass.appendChild(input_class_name);

        let buttonNewclass = createHTMLElement('button', 'buttonNewclass');
        buttonNewclass.textContent = "Ajouter la classe";
        buttonNewclass.type = 'submit';
        formNewclass.appendChild(buttonNewclass);

        divNewclass.appendChild(formNewclass);
        subContainer.appendChild(divNewclass);

        // Suprimer un utilisateur
        let divDeleteUser = createHTMLElement('div', 'divDeleteUser');
        let titleDeleteUser = createHTMLElement('div', 'titleDeleteUser');
        titleDeleteUser.textContent = 'Suprimer un joueur';
        divDeleteUser.appendChild(titleDeleteUser);
        let formDeleteUser = createHTMLElement('form', 'formDeleteUser');
        formDeleteUser.enctype = 'multipart/form-data';
        formDeleteUser.method = 'POST';
        let selectDeleteUser = createHTMLElement('select', 'selectDeleteUser');
        let defaultDeleteUser = document.createElement('option');
        defaultDeleteUser.value = "";
        defaultDeleteUser.text = "Choisissez";
        selectDeleteUser.appendChild(defaultDeleteUser);
        for (let i = 0; i < data.ListInscripted.length; i++) {
            const currentPlayer = data.ListInscripted[i];
            let option = document.createElement('option');
            option.text = currentPlayer.Username;
            option.value = currentPlayer.ID + '-' + currentPlayer.Username;
            selectDeleteUser.appendChild(option);
        }
        formDeleteUser.appendChild(selectDeleteUser);
        divDeleteUser.appendChild(formDeleteUser);
        subContainer.appendChild(divDeleteUser);

        let Container = document.getElementById('Container');
        Container.innerHTML = '';
        Container.appendChild(subContainer);

        addEventOnAllButton(data.ListUnit, data.UserInfo.Username);

    } else {
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/';
    }
}

let timerThrottlebutton = 0;
function addEventOnAllButton(listUnit, connectedUsername) {
    // Activation/Désactivation du bot
    document.getElementById('buttonBotEtat').addEventListener('click', (event) => {
        event.preventDefault();
        const now = new Date();
        if (now - timerThrottlebutton > 500) {
            timerThrottlebutton = now;
            adminitrateBot('buttonBotEtat');
        }
    });

    // Ajout d'une nouvelle unité
    document.getElementById('formNewUnit').addEventListener('submit', (event) => {
        event.preventDefault();
        const now = new Date();
        if (now - timerThrottlebutton > 500) {
            timerThrottlebutton = now;
            adminitrateBot('buttonNewUnit');
        }
    });

    // Modification d'une unité existante
    let selectChangeUnit = document.getElementById('selectChangeUnit');
    selectChangeUnit.addEventListener('change', () => {
        let unitSelected;
        for (let i = 0; i < listUnit.length; i++) {
            if (selectChangeUnit.value === listUnit[i].Unit_name) {
                unitSelected = listUnit[i];
                break;
            }
        }

        // suppression des anciens éléments si existant
        if (document.getElementById('changeUnitInfluence')) {
            document.getElementById('changeUnitInfluence').remove();
            document.getElementById('changeUnitLvlMax').remove();
            // document.getElementById('changeUnitTier').remove();
            document.getElementById('changeUnitimg').remove();
            document.getElementById('buttonChangeUnit').remove();
        }

        if (selectChangeUnit.value != "") {
            // Ajout des nouveaux éléments
            let formChangeUnit = document.getElementById('formchangeUnit');
            // Unit_influence
            let input_Unit_influence = createHTMLElement('input', 'changeUnitInfluence');
            input_Unit_influence.type = 'number';
            input_Unit_influence.placeholder = 'Influence actuel : ' + unitSelected.Unit_influence;
            formChangeUnit.appendChild(input_Unit_influence);
            // Unit_lvlMax
            let input_Unit_lvlMax = createHTMLElement('input', 'changeUnitLvlMax');
            input_Unit_lvlMax.type = 'number';
            input_Unit_lvlMax.placeholder = 'Level max actuel : ' + unitSelected.Unit_lvlMax;
            formChangeUnit.appendChild(input_Unit_lvlMax);

            // Unit_img
            let input_Unit_img = createHTMLElement('input', 'changeUnitimg');
            input_Unit_img.type = 'file';
            input_Unit_img.lang = 'fr';
            input_Unit_img.accept = '.jpg, .jpeg, .png,';
            formChangeUnit.appendChild(input_Unit_img);

            // button
            let buttonChangeUnit = createHTMLElement('button', 'buttonChangeUnit');
            buttonChangeUnit.type = 'submit';
            buttonChangeUnit.textContent = "Modifier l'unité";
            formChangeUnit.appendChild(buttonChangeUnit);

            let divChangeUnit = document.getElementById('divChangeUnit');
            divChangeUnit.appendChild(formChangeUnit);
        }

        document.getElementById('formchangeUnit').addEventListener('submit', (event) => {
            event.preventDefault();
            const now = new Date();
            if (now - timerThrottlebutton > 500) {
                timerThrottlebutton = now;
                adminitrateBot('buttonChangeUnit');
            }
        });
    });

    // Ajouter une nouvelle arme (new class)
    document.getElementById('buttonNewclass').addEventListener('click', (event) => {
        event.preventDefault();
        const now = new Date();
        if (now - timerThrottlebutton > 500) {
            timerThrottlebutton = now;
            adminitrateBot('buttonNewclass');
        }
    });

    // Suppression d'un joueur
    let selectDeleteUser = document.getElementById('selectDeleteUser');
    selectDeleteUser.addEventListener('change', () => {
        const parts = selectDeleteUser.value.split('-');
        const playerSelectedwithoutID = parts.slice(1).join('-');

        // suppression des anciens éléments si existant
        if (document.getElementById('divInfoDeleteUser')) {
            document.getElementById('divInfoDeleteUser').remove();
            if (document.getElementById('buttonConfirmDeleteUser')) {
                document.getElementById('buttonConfirmDeleteUser').remove();
            }
        }

        if (selectDeleteUser.value != "") {
            let formDeleteUser = document.getElementById('formDeleteUser');

            // Div d'information
            let divInfo = document.createElement('div');
            divInfo.id = 'divInfoDeleteUser'
            if (playerSelectedwithoutID === connectedUsername) {
                divInfo.textContent = 'Pour supprimer votre propre compte contactez un administrateur';
                formDeleteUser.appendChild(divInfo)
            } else {
                divInfo.textContent = 'ATTENTION : vous êtes sur le point de supprimer le joueur ' + playerSelectedwithoutID;
                formDeleteUser.appendChild(divInfo)

                // button de confirmation de la suppression
                let buttonDeleteUser = document.createElement('button');
                buttonDeleteUser.id = 'buttonConfirmDeleteUser';
                buttonDeleteUser.type = 'button';
                buttonDeleteUser.className = 'buttonConfirmDeleteUser';
                buttonDeleteUser.textContent = "Confirmer la supression";
                formDeleteUser.appendChild(buttonDeleteUser);

                document.getElementById('buttonConfirmDeleteUser').addEventListener('click', (event) => {
                    event.preventDefault();
                    const now = new Date();
                    if (now - timerThrottlebutton > 500) {
                        timerThrottlebutton = now;
                        adminitrateBot('buttonConfirmDeleteUser');
                    }
                });
            }
        }

    });
}

// option et le name du button cliquer
async function adminitrateBot(option) {
    let dataToSend = {};

    // activate or desactivate bot
    if (option === 'buttonBotEtat') {
        dataToSend.Allumage = document.getElementById('buttonBotEtat').value; // false = desactivation, true = activation
        sendData(dataToSend);
    } else if (option === 'buttonConfirmDeleteUser') { // suppression d'un utilisateur
        dataToSend.DeleteUser = document.getElementById('selectDeleteUser').value;
        sendData(dataToSend);
    } else if (option === 'buttonNewclass') {
        dataToSend.newWeapon = document.getElementById('nameNewclass').value;
        sendData(dataToSend);
    } else {
        let formData = new FormData();

        // create Unit
        if (option === 'buttonNewUnit') {
            let createUnit = {};
            createUnit.Unit_name = document.getElementById('nameNewUnit').value;
            createUnit.Unit_influence = document.getElementById('influNewUnit').value;
            createUnit.Unit_lvlMax = document.getElementById('lvlMaxNewUnit').value;
            createUnit.Unit_tier = document.getElementById('tierNewUnit').value;
            createUnit.Unit_type = document.getElementById('typeNewUnit').value;
            dataToSend.createUnit = createUnit;
            formData.append('data', JSON.stringify(dataToSend));

            let input_new_img = document.getElementById('imgNewUnit');
            if (input_new_img.files && input_new_img.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    var image = new Image();
                    image.src = e.target.result;
                    formData.append('image', input_new_img.files[0]);

                    if (createUnit.Unit_name === "" ||
                        createUnit.Unit_influence === "" ||
                        createUnit.Unit_lvlMax === "" ||
                        createUnit.Unit_tier === "" ||
                        createUnit.Unit_type === "") {
                        let divError = document.getElementById('divErrorAddUnit');
                        divError.textContent = "Merci de compléter tout les champs pour la création de la nouevelle unité";
                        divError.style.display = 'block';

                    } else {
                        sendFormData(formData);
                        window.location.href = '/AppAdmin';
                    }
                };
                // Démarrer la lecture du fichier
                reader.readAsDataURL(input_new_img.files[0]);
            } else {
                let divError = document.getElementById('divErrorAddUnit');
                divError.textContent = "Merci de compléter tout les champs et mettre l'image pour la création de la nouvelle unité";
                divError.style.display = 'block';
            }
        }

        // change Unit
        if (option === 'buttonChangeUnit') {
            let changeUnit = {};
            changeUnit.Unit_name = document.getElementById('selectChangeUnit').value;
            changeUnit.Unit_influence = document.getElementById('changeUnitInfluence').value;
            changeUnit.Unit_lvlMax = document.getElementById('changeUnitLvlMax').value;
            // changeUnit.Unit_tier = document.getElementById('changeUnitTier').value;
            dataToSend.changeUnit = changeUnit;
            formData.append('data', JSON.stringify(dataToSend));

            let input_change_img = document.getElementById('changeUnitimg');
            if (input_change_img.files && input_change_img.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    let image = new Image();
                    image.src = e.target.result;
                    formData.append('image', input_change_img.files[0]);
                    sendFormData(formData);
                    window.location.href = '/AppAdmin';
                };
                reader.readAsDataURL(input_change_img.files[0]);
            } else if (changeUnit.Unit_influence == "" && changeUnit.Unit_lvlMax == "") {
                let divErrorChangeUnit = document.getElementById('divErrorChangeUnit');
                divErrorChangeUnit.textContent = "Merci de compléter au moins un champs ou mettre une image pour mettre à jour l'unité " + changeUnit.Unit_name;
                divErrorChangeUnit.style.display = 'block';
            } else { // si send des data uniquement
                sendFormData(formData);
                window.location.href = '/AppAdmin';
            }
        }
    }
}

function sendData(dataToSend) {
    // console.log('dataToSend : ', dataToSend);
    fetch(adressAPI + 'UpdateAdmin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
    })
        .catch(error => {
            console.error('Erreur avec les données:', error);
        });

    // rechargement de page aprés modification
    window.location.href = '/AppAdmin';
}
function sendFormData(formData) {
    // console.log('formData : ', formData);
    fetch(adressAPI + 'adminitrateBot', {
        method: 'POST',
        body: formData
    })
        .catch(error => {
            console.error('Erreur lors de l\'envoi de l\'image et des données:', error);
        });
}
