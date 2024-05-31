import { adressAPI } from "./config.js";
import { communBlock, createHTMLElement, fetchServer, fetchlogout } from "./useful.js";

export async function caserne() {
    containercaserne(await fetchServer('caserne'));
}

let timerThrottlebutton = 0;
function containercaserne(data) {
    if (data.Gestion.Logged) {
        communBlock(data)

        let Container = document.getElementById('Container');
        let caserne = createHTMLElement('div', 'caserne');

        let divInfanterie = createHTMLElement('div', 'divInfanterie');
        let TitleDivInfanterie = document.createElement('div');
        TitleDivInfanterie.id = 'titleInfanterie';
        TitleDivInfanterie.classList.add("titlelistUnit");
        TitleDivInfanterie.textContent = "》Infanterie";
        let listUnitInfanterie = document.createElement('div');
        listUnitInfanterie.classList.add("listUnit");
        listUnitInfanterie.style.display = 'none';

        let divDistant = createHTMLElement('div', 'divDistant');
        let TitleDivDistant = document.createElement('div');
        TitleDivDistant.id = 'titleDistant';
        TitleDivDistant.classList.add("titlelistUnit");
        TitleDivDistant.textContent = "》Distant";
        let listUnitDistant = document.createElement('div');
        listUnitDistant.classList.add("listUnit");
        listUnitDistant.style.display = 'none';

        let divCav = createHTMLElement('div', 'divCav');
        let TitleDivCav = document.createElement('div');
        TitleDivCav.id = 'titleCav';
        TitleDivCav.classList.add("titlelistUnit");
        TitleDivCav.textContent = "》Cavalerie";
        let listUnitCav = document.createElement('div');
        listUnitCav.classList.add("listUnit");
        listUnitCav.style.display = 'none';

        // ajout des unité dans un certain ordre
        addUnit(data, listUnitInfanterie, listUnitDistant, listUnitCav, "T5");
        addUnit(data, listUnitInfanterie, listUnitDistant, listUnitCav, "T4");
        addUnit(data, listUnitInfanterie, listUnitDistant, listUnitCav, "T3");

        divInfanterie.appendChild(TitleDivInfanterie);
        divInfanterie.appendChild(listUnitInfanterie)
        caserne.appendChild(divInfanterie);
        TitleDivInfanterie.addEventListener('click', function () {
            const now = new Date();
            if (now - timerThrottlebutton > 500) {
                timerThrottlebutton = now;
                if (listUnitInfanterie.style.display === 'none') {
                    TitleDivInfanterie.textContent = "︾ Infanterie";
                    listUnitInfanterie.style.display = 'flex';
                } else {
                    TitleDivInfanterie.textContent = "》Infanterie";
                    listUnitInfanterie.style.display = 'none';
                }
            }
        });

        divDistant.appendChild(TitleDivDistant);
        divDistant.appendChild(listUnitDistant);
        caserne.appendChild(divDistant);
        TitleDivDistant.addEventListener('click', function () {
            const now = new Date();
            if (now - timerThrottlebutton > 500) {
                timerThrottlebutton = now;
                if (listUnitDistant.style.display === 'none') {
                    TitleDivDistant.textContent = "︾ Distant";
                    listUnitDistant.style.display = 'flex';
                } else {
                    TitleDivDistant.textContent = "》Distant";
                    listUnitDistant.style.display = 'none';
                }
            }
        });

        divCav.appendChild(TitleDivCav);
        divCav.appendChild(listUnitCav)
        caserne.appendChild(divCav);
        TitleDivCav.addEventListener('click', function () {
            const now = new Date();
            if (now - timerThrottlebutton > 500) {
                timerThrottlebutton = now;
                if (listUnitCav.style.display === 'none') {
                    TitleDivCav.textContent = "︾ Cavalerie";
                    listUnitCav.style.display = 'flex';
                } else {
                    TitleDivCav.textContent = "》Cavalerie";
                    listUnitCav.style.display = 'none';
                }
            }
        });

        let buttonMAJ = document.createElement('button');
        buttonMAJ.textContent = 'Mettre à jour ma caserne';
        buttonMAJ.id = 'MAJCaserne';
        buttonMAJ.className = 'MAJCaserne';
        caserne.appendChild(buttonMAJ);
        Container.appendChild(caserne);

        MAJCaserne(data.ListUnit.length);

    } else {
        fetchlogout();
    }
}

function MAJCaserne(nbunit) {
    var boutonMAJCaserne = document.getElementById("MAJCaserne");
    boutonMAJCaserne.addEventListener("click", function () {
        const now = new Date();
        if (now - timerThrottlebutton > 500) {
            timerThrottlebutton = now;
            sendDataMAJCaserne(nbunit);
        }
    });
}

function addUnit(data, listUnitInfanterie, listUnitDistant, listUnitCav, tier) {
    for (let i = 0; i < data.ListUnit.length; i++) {
        const Currentunit = data.ListUnit[i];
        if (Currentunit.Unit_tier === tier) {
            let unit = document.createElement('div');
            unit.className = "unit";
            let img = document.createElement('img');
            img.src = Currentunit.Unit_img;
            img.alt = Currentunit.Unit_name;
            unit.appendChild(img);
            let name = document.createElement('div');
            name.textContent = Currentunit.Unit_name;
            unit.appendChild(name);
            let info = document.createElement('div');
            info.textContent = 'Influence : ' + Currentunit.Unit_influence + ' (' + Currentunit.Unit_tier + ')';
            unit.appendChild(info);
            let selecctlvl = document.createElement('select');
            selecctlvl.className = 'selecctLevelCaserne';
            selecctlvl.name = "Unit" + Currentunit.Unit_id;
            selecctlvl.id = "lvl-unit" + Currentunit.Unit_id;
            let defaultoption = document.createElement("option");
            defaultoption.value = "";
            if (Currentunit.Unit_lvl == Currentunit.Unit_lvlMax) {
                defaultoption.text = 'level ' + Currentunit.Unit_lvl;
                selecctlvl.style.backgroundColor = 'green';
            } else if (Currentunit.Unit_lvl != '0') {
                defaultoption.text = 'level ' + Currentunit.Unit_lvl;
                selecctlvl.style.backgroundColor = 'orange';
            } else {
                defaultoption.text = 'Unité non débloqué';
                selecctlvl.style.backgroundColor = 'red';
            }
            selecctlvl.style.borderRadius = '15px';
            selecctlvl.style.fontSize = '16px';
            selecctlvl.appendChild(defaultoption);
            if (Currentunit.Unit_lvl !== "") {
                let optionAbsent = document.createElement("option");
                optionAbsent.value = -1;
                optionAbsent.text = 'Unité non débloqué';
                optionAbsent.style.backgroundColor = 'red';
                selecctlvl.appendChild(optionAbsent);
            }
            for (let j = 1; j <= Currentunit.Unit_lvlMax; j++) {
                let option = document.createElement("option");
                option.value = j;
                option.text = 'level ' + j;
                if (j < Currentunit.Unit_lvlMax) {
                    option.style.backgroundColor = 'orange';
                } else {
                    option.style.backgroundColor = 'green';
                }

                selecctlvl.appendChild(option);
            }
            unit.appendChild(selecctlvl);

            // Ajout de la maitrise
            if (Currentunit.Unit_maitrise === '1') { // presence d'une maitrise sur l'unité
                const listoption = [["0", "Maîtrise non démarré", 'red'], ["1", "Maitrise en cours", 'orange'], ["2", "Maitrise compléte", 'green']];
                let selecctMaitrise = document.createElement('select');
                selecctMaitrise.className = 'selecctMaitriseCaserne';
                selecctMaitrise.name = "Unit" + Currentunit.Unit_id;
                selecctMaitrise.id = "maitrise-unit" + Currentunit.Unit_id;
                selecctMaitrise.style.borderRadius = '15px';
                selecctMaitrise.style.fontSize = '16px';
                let defaultoption = document.createElement("option");
                selecctMaitrise.appendChild(defaultoption);
                for (let i = 0; i < listoption.length; i++) {
                    const element = listoption[i];
                    if (Currentunit.UserMaitrise == element[0]) { // ne maitrise pas
                        defaultoption.text = element[1];
                        defaultoption.value = element[0];
                        defaultoption.style.backgroundColor = element[2];
                        selecctMaitrise.style.backgroundColor = element[2];
                    } else {
                        if (i === 0 && Currentunit.UserMaitrise == "") {
                            defaultoption.text = listoption[0][1];
                            defaultoption.value = listoption[0][0];
                            selecctMaitrise.style.backgroundColor = element[2];
                        } else {
                            let option = document.createElement('option');
                            option.text = element[1];
                            option.value = element[0];
                            option.style.backgroundColor = element[2];
                            selecctMaitrise.appendChild(option);
                        }
                    }
                }
                unit.appendChild(selecctMaitrise);
            }

            if (Currentunit.Unit_type === 'Infanterie') {
                listUnitInfanterie.appendChild(unit)
            } else if (Currentunit.Unit_type === 'Distant') {
                listUnitDistant.appendChild(unit)
            } else if (Currentunit.Unit_type === 'Cavalerie') {
                listUnitCav.appendChild(unit)
            }
        }
    }
}


function sendDataMAJCaserne(nbunit) {
    // récupération de toutes les valeurs
    let listNewLvlUnitCaserne = [];
    for (let i = 0; i < nbunit; i++) {
        var selectElement = document.getElementById('lvl-unit' + (i + 1));
        let majUnit = [];
        majUnit.push('Unit' + (i + 1));
        majUnit.push(selectElement.value);

        if (document.getElementById('maitrise-unit' + (i + 1))) {
            var selectMaitrise = document.getElementById('maitrise-unit' + (i + 1));
            majUnit.push(selectMaitrise.value);
        } else {
            majUnit.push("");
        }
        listNewLvlUnitCaserne.push(majUnit);
    }

    const dataToSend = { listNewLvlUnitCaserne };
    // console.log('dataToSend', dataToSend)

    fetch(adressAPI + 'majcaserne', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur de réseau: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (typeof data === 'object') {
                console.log('Data received (Register):', data);
                location.reload();
            } else {
                throw new Error('Réponse invalide du serveur (non-JSON)');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
        });
}