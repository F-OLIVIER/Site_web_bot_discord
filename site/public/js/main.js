import { home } from "./home.js";
import { caserne } from "./caserne.js";
import { creategroup } from "./creategroup.js";
import { characterCard } from "./characterCard.js";

let path = window.location.pathname;
console.log("path : ", path);

export const cookieName = "user_token";

switch (path) {
    case '/':
        if (document.cookie.split(";").some((item) => item.trim().startsWith(cookieName + "="))) {
            window.location.href = '/home';
        } else {
            homeNotConnected();
        }
        break;

    case '/discord':
        // page géré de façon externe
        break;

    case '/home':
        home();
        break;

    case '/caserne':
        caserne();
        break;

    case '/creategroup':
        creategroup();
        break;

    case '/admin':
        administration();
        break;

    case '/characterCard':
        characterCard();
        break;

    default:
        window.location.href = '/';
        break;
}


function homeNotConnected() {
    let Container = document.getElementById('Container');
    let discordConnect = document.createElement('div');
    discordConnect.className = 'discordConnect';

    let link = document.createElement('a');
    link.href = "https://discord.com/api/oauth2/authorize?client_id=1203301786254057534&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A53134%2Fdiscord&scope=identify";
    link.textContent = "Se connecter avec discord";

    let imgDiscord = document.createElement('img');
    imgDiscord.src = "img/Logo_Discord.png";

    link.appendChild(imgDiscord);
    discordConnect.appendChild(link);
    Container.appendChild(discordConnect);
}