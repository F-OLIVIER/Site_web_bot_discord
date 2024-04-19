import { home } from "./home.js";
import { caserne } from "./caserne.js";
import { creategroup } from "./creategroup.js";
import { characterCard } from "./characterCard.js";
import { administration } from "./administration.js";
import { viewgroup } from "./viewGroup.js";
import { stat } from "./stat.js";
import { createHTMLElement } from "./useful.js";
import { LINK_DISCORD, cookieName } from "./config.js";

let path = window.location.pathname;
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

    case '/viewGroup':
        viewgroup();
        break;

    case '/characterCard':
        characterCard();
        break;

    case '/AppAdmin':
        administration();
        break;

    case '/stat':
        stat();
        break;

    default:
        window.location.href = '/';
        break;
}

function homeNotConnected() {
    let Container = document.getElementById('Container');

    let link = createHTMLElement('a', 'linkDiscord');
    link.href = LINK_DISCORD;

    let discordConnect = createHTMLElement('div', 'discordConnect');
    let divlink = createHTMLElement('div', 'divlink');

    divlink.textContent = "Cliquer pour vous connecter avec discord";
    discordConnect.appendChild(divlink)

    let divimg = document.createElement('div');
    let imgDiscord = document.createElement('img');
    imgDiscord.src = "img/Logo_Discord.png";
    divimg.appendChild(imgDiscord);
    discordConnect.appendChild(divimg);

    link.appendChild(discordConnect);
    Container.appendChild(link);
}