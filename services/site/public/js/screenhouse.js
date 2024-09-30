import { adressAPI } from "./config.js";
import { communBlock, createHTMLElement, fetchServer, removeHTMLTags } from "./useful.js";

export async function screenhouse() {
    containerscreenhouse(await fetchServer('screenhouse'));
}

function containerscreenhouse(data) {
    if (data.Gestion.Logged) {
        communBlock(data);

        const subContainer = createHTMLElement('div', 'subContainerscreenhouse');

        // possibilité d'ajout d'un nouveau screen
        if (data.Gestion.Officier) {
            let formnewscreen = createHTMLElement('form', 'formnewscreen');

            // Titre
            let titlenewscreen = document.createElement('h2');
            titlenewscreen.textContent = "Ajouter un nouveau screen"
            formnewscreen.appendChild(titlenewscreen);

            // description nouvelle image
            let descriptionnewscreen = createHTMLElement('textarea', "descriptionnewscreen");
            descriptionnewscreen.placeholder = "Description optionnel de l'image (date, etc.)"
            descriptionnewscreen.rows = '6';
            formnewscreen.appendChild(descriptionnewscreen);

            // compteur de caractères
            let charcountnewscreen = createHTMLElement('div', 'charcountnewscreen');
            charcountnewscreen.textContent = "0 / 500 caractères";
            formnewscreen.appendChild(charcountnewscreen);

            // Mettre à jour le compteur en temps réel
            descriptionnewscreen.addEventListener('input', function () {
                let currentLength = descriptionnewscreen.value.length;
                charcountnewscreen.textContent = `${currentLength} / 500 caractères`;
            });

            // upload de l'image
            let uploadimgnewscreen = createHTMLElement('input', "uploadimgnewscreen");
            uploadimgnewscreen.required;
            uploadimgnewscreen.type = 'file';
            uploadimgnewscreen.lang = 'fr';
            uploadimgnewscreen.accept = '.jpg, .jpeg, .png,';
            formnewscreen.appendChild(uploadimgnewscreen);


            // button
            let buttonNewScreen = createHTMLElement('button', 'buttonNewScreen');
            buttonNewScreen.textContent = "Ajouter le screen";
            buttonNewScreen.type = 'submit';
            formnewscreen.appendChild(buttonNewScreen);

            subContainer.appendChild(formnewscreen);
        }

        // affichage des screens déja présent
        if (data.Screen) {
            for (let i = 0; i < data.Screen.length; i++) {
                const current_screen = data.Screen[i];

                let divimg = document.createElement('div');
                divimg.className = "divimg img-container";

                let img = document.createElement('img');
                img.src = current_screen.Img;
                img.className = 'img-normal';
                divimg.appendChild(img);

                let description = document.createElement('p');
                description.textContent = current_screen.Description;
                divimg.appendChild(description);

                subContainer.appendChild(divimg);

                // Gestionnaire d'événements pour le zoom
                img.addEventListener('click', function () {
                    if (img.classList.contains('img-normal')) {
                        // Calculer le facteur de mise à l'échelle
                        // (taille fenetre * marge de 10%) / taille de l'image
                        const scaleWidth = (window.innerWidth * 0.9) / img.naturalWidth;
                        const scaleHeight = (window.innerHeight * 0.9) / img.naturalHeight;

                        // Choisir la plus petite des deux échelles pour que l'image ne dépasse pas la fenetre
                        const scale = Math.min(scaleWidth, scaleHeight);

                        // Appliquer le zoom dynamique avec le scale calculé
                        img.classList.remove('img-normal');
                        img.classList.add('img-zoomed');
                        img.style.transform = `translate(-50%, -50%) scale(${scale})`;
                    } else {
                        // Ajouter une courte temporisation pour la transition
                        setTimeout(() => {
                            img.classList.remove('img-zoomed');
                            img.classList.add('img-normal');
                            img.style.transform = '';
                        }, 300); // Doit correspondre à la durée de la transition CSS
                    }
                });
            }
        }


        let Container = document.getElementById('Container');
        Container.innerHTML = '';
        Container.appendChild(subContainer);

        if (data.Gestion.Officier) {
            eventSendNewScreen();
        }
    }
}

let timerThrottlebutton = 0;

function eventSendNewScreen() {

    document.getElementById('buttonNewScreen').addEventListener('click', async (event) => {
        event.preventDefault();
        const now = new Date();
        if (now - timerThrottlebutton > 500) {
            timerThrottlebutton = now;

            let formData = new FormData();
            let dataToSend = {};

            // récupération de la description
            dataToSend.Description = removeHTMLTags(document.getElementById('descriptionnewscreen').value);
            formData.append('data', JSON.stringify(dataToSend));

            let input_img = document.getElementById('uploadimgnewscreen');
            if (input_img.files && input_img.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    // Lecture complète de l'image
                    var image = new Image();
                    image.src = e.target.result;

                    // Ajout du fichier image au FormData
                    formData.append('image', input_img.files[0]);

                    // envoie des données au serveur
                    sendData(formData);
                };
                // Démarrer la lecture du fichier
                reader.readAsDataURL(input_img.files[0]);
            }
        }
    });

}

async function sendData(formData) {
    await fetch(adressAPI + 'newscreenhouse', {
        method: 'POST',
        body: formData
    })
        .catch(error => {
            console.error('Erreur lors de l\'envoi de l\'image et des données:', error);
        });

    window.location.href = "/screenhouse";
}