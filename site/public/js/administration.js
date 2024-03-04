import { cookieName } from "./main.js";
import { communBlock } from "./useful.js";

export function administration() {
    if (!document.cookie.split(";").some((item) => item.trim().startsWith(cookieName + "="))) {
        window.location.href = '/';
    }
    console.log('ENTER administration JS')
    // Si le cookie est present, fetch des données. Le back fera une vérification de la validité du cookie
    fetch('http://localhost:53134/api/CheckAppAdmin')
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
            console.log('Data received (administration):', data);
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
        console.log("autorisation d'accées accordé");

        let subContainer = document.createElement('div');
        subContainer.className = 'subContainerbotEtat';

        // Etat du bot
        let divBotEtat = document.createElement('div');
        divBotEtat.className = 'divBotEtat';
        let botEtat = document.createElement('div');
        botEtat.className = 'botEtat';
        let buttonBotEtat = document.createElement('button');
        buttonBotEtat.id = 'buttonBotEtat';
        buttonBotEtat.className = 'buttonBotEtat';
        if (data.Gestion.BotActivate) {
            botEtat.textContent = "Bot discord actif";
            buttonBotEtat.value = "false";
            buttonBotEtat.textContent = 'Désactiver le bot';
        } else {
            botEtat.textContent = "Bot discord inactif";
            buttonBotEtat.value = "true";
            buttonBotEtat.textContent = 'Activer le bot';
        }
        divBotEtat.appendChild(botEtat);
        divBotEtat.appendChild(buttonBotEtat);
        subContainer.appendChild(divBotEtat);

        // Ajouter une unité
        let divNewUnit = document.createElement('div');
        divNewUnit.className = 'divNewUnit';
        let titleNewUnit = document.createElement('div');
        titleNewUnit.className = 'titleNewUnit'
        titleNewUnit.textContent = 'Ajouter une nouvelle unité';
        divNewUnit.appendChild(titleNewUnit);

        let formNewUnit = document.createElement('form');
        formNewUnit.className = 'newUnit';
        // Unit_name
        let input_Unit_name = document.createElement('input');
        input_Unit_name.placeholder = "Nom de l'unité";
        formNewUnit.appendChild(input_Unit_name);
        // Unit_influence
        let input_Unit_influence = document.createElement('input');
        input_Unit_influence.type = 'number';
        input_Unit_influence.placeholder = "Influence de l'unité";
        formNewUnit.appendChild(input_Unit_influence);
        // Unit_lvlMax
        let input_Unit_lvlMax = document.createElement('input');
        input_Unit_lvlMax.type = 'number';
        input_Unit_lvlMax.placeholder = "Level max de l'unité";
        formNewUnit.appendChild(input_Unit_lvlMax);
        // Unit_tier
        let input_Unit_tier = document.createElement('select');
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
        let input_Unit_type = document.createElement('select');
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
        let input_Unit_img = document.createElement('input');
        input_Unit_img.type = 'file';
        formNewUnit.appendChild(input_Unit_img);

        // button
        let buttonNewUnit = document.createElement('button');
        buttonNewUnit.id = 'buttonNewUnit';
        buttonNewUnit.className = 'buttonNewUnit';
        buttonNewUnit.textContent = "Ajouter l'unité";
        formNewUnit.appendChild(buttonNewUnit);

        divNewUnit.appendChild(formNewUnit);
        subContainer.appendChild(divNewUnit);

        // Modifier une unité
        let divChangeUnit = document.createElement('div');
        divChangeUnit.id = 'divChangeUnit';
        divChangeUnit.className = 'divChangeUnit';
        let titleChangeUnit = document.createElement('div');
        titleChangeUnit.className = 'titleChangeUnit'
        titleChangeUnit.textContent = 'Modifier une unité';
        divChangeUnit.appendChild(titleChangeUnit);
        let formChangeUnit = document.createElement('form');
        formChangeUnit.id = 'formchangeUnit';
        formChangeUnit.className = 'formchangeUnit';
        let selectChangeUnit = document.createElement('select');
        selectChangeUnit.id = 'selectChangeUnit';
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

        let Container = document.getElementById('Container');
        Container.innerHTML = '';
        Container.appendChild(subContainer);

        addEventOnAllButton(data.ListUnit);

    } else {
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/';
    }
}

function addEventOnAllButton(listUnit) {
    // Activation/Désactivation du bot
    document.getElementById('buttonBotEtat').addEventListener('click', activateOrNotBot);

    // Ajout d'une nouvelle unité
    document.getElementById('buttonNewUnit').addEventListener('click', createUnit);

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
            document.getElementById('changeUnitTier').remove();
            document.getElementById('changeUnitimg').remove();
            document.getElementById('buttonChangeUnit').remove();
        }

        if (selectChangeUnit.value != "") {
            // Ajout des nouveaux éléments
            let formChangeUnit = document.getElementById('formchangeUnit');
            // Unit_influence
            let input_Unit_influence = document.createElement('input');
            input_Unit_influence.id = 'changeUnitInfluence';
            input_Unit_influence.type = 'number';
            input_Unit_influence.placeholder = 'Influence actuel : ' + unitSelected.Unit_influence;
            formChangeUnit.appendChild(input_Unit_influence);
            // Unit_lvlMax
            let input_Unit_lvlMax = document.createElement('input');
            input_Unit_lvlMax.id = 'changeUnitLvlMax';
            input_Unit_lvlMax.type = 'number';
            input_Unit_lvlMax.placeholder = 'Level max actuel : ' + unitSelected.Unit_lvlMax;
            formChangeUnit.appendChild(input_Unit_lvlMax);
            // Unit_tier
            let input_Unit_tier = document.createElement('select');
            input_Unit_tier.id = 'changeUnitTier';
            let option_Unit_tier = [unitSelected.Unit_tier, "T3", "T4", "T5"];
            console.log('unitSelected.Unit_tier : ', unitSelected.Unit_tier)
            let defaultOption_Unit_tier = document.createElement('option');
            defaultOption_Unit_tier.value = unitSelected.Unit_tier;
            defaultOption_Unit_tier.text = unitSelected.Unit_tier;
            input_Unit_tier.appendChild(defaultOption_Unit_tier);
            for (let i = 0; i < option_Unit_tier.length; i++) {
                if (option_Unit_tier[i] !== unitSelected.Unit_tier) {
                    let option = document.createElement('option');
                    option.value = option_Unit_tier[i];
                    option.text = option_Unit_tier[i];
                    input_Unit_tier.appendChild(option);
                }
            }
            formChangeUnit.appendChild(input_Unit_tier);

            // Unit_img
            let input_Unit_img = document.createElement('input');
            input_Unit_img.id = 'changeUnitimg';
            input_Unit_img.type = 'file';
            formChangeUnit.appendChild(input_Unit_img);

            // button
            let buttonChangeUnit = document.createElement('button');
            buttonChangeUnit.id = 'buttonChangeUnit';
            buttonChangeUnit.className = 'buttonChangeUnit';
            buttonChangeUnit.textContent = "Modifier l'unité";
            formChangeUnit.appendChild(buttonChangeUnit);

            let divChangeUnit = document.getElementById('divChangeUnit');
            divChangeUnit.appendChild(formChangeUnit);
        }

        document.getElementById('buttonChangeUnit').addEventListener('click', changeUnit);
    });
}

function activateOrNotBot() {
    let allumage = document.getElementById('buttonBotEtat').value;
    console.log('allumage : ', allumage); // false = desactivation, true = activation

}

function createUnit() {
    
}

function changeUnit() {
    
}