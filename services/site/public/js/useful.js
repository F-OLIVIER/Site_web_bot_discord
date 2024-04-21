import { adressAPI } from "./config.js";

export function communBlock(data) {
    let userConected = document.getElementById('user');
    let divimguserConected = document.createElement('div');
    let imguserConected = document.createElement('img');
    imguserConected.src = data.UserInfo.Photo;
    divimguserConected.className = 'userImg';
    divimguserConected.appendChild(imguserConected)
    userConected.appendChild(divimguserConected);

    let disconnect = document.getElementById('disconnect');
    let Username = document.createElement('div');
    Username.className = 'UsernameBandeau';
    Username.textContent = 'Connecté en tant que ' + data.UserInfo.Username;
    disconnect.appendChild(Username);

    let button = createHTMLElement('button', 'DisconnectButton');
    button.type = 'submit';
    button.textContent = 'Se déconnecter';
    disconnect.appendChild(button)

    DisconnectedButton();
}

export function msgError(data) {
    let divError = document.getElementById('error');
    if (data.MsgErr !== "") {
        divError.innerHTML = data.MsgErr;
        divError.style.display = "block";
    } else {
        divError.style.display = "none";
    }
}

export function notFound() {
    let divError = document.getElementById('error');
    divError.textContent = "Erreur 404 : Page not Found";
    divError.style.color = 'red';
    divError.style.display = "block";
}

let timerThrottlebutton = 0;
function DisconnectedButton() {
    var DisconnectedButton = document.getElementById("DisconnectButton");

    // Fonction gestionnaire d'événements
    function DisconnectedButtonClick() {
        const now = new Date();
        if (now - timerThrottlebutton > 500) {
            timerThrottlebutton = now;
            fetchlogout();
        }
    }
    DisconnectedButton.addEventListener('click', DisconnectedButtonClick);
}

export function createHTMLElement(type, name) {
    const div = document.createElement(type);
    div.id = name;
    div.className = name;
    return div
}

export function fetchlogout() {
    fetch(adressAPI + 'logout')
        .catch(error => {
            console.error('Data recovery error:', error);
        });
    window.location.href = '/';
}
