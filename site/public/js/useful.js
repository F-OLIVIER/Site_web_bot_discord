export function msgError(data) {
    let divError = document.getElementById('error');
    if (data.MsgErr !== "") {
        divError.innerHTML = data.MsgErr;
        divError.style.display = "block";
    } else {
        divError.style.display = "none";
    }
}

export function redirect(data) {
    window.location.href = data.Redirect;
}

export function notFound() {
    
}