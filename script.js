let rotateAngle = 0;

function checkNameRequest () {
    document.querySelector(".autentication-screen").classList.add("loading");
    setInterval(rotateImg, 150);
    const userName = {name: document.querySelector(".username-login").value};
    const request = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", userName);
    request.then(tratarSucesso);
    request.catch(tratarError);
}

function rotateImg () {
    rotateAngle = rotateAngle + 45;
    if (rotateAngle == 360) {
        rotateAngle = 0;
    }
    document.querySelector(".autentication-screen img:nth-child(4)").setAttribute("style", `transform: rotate(${rotateAngle}deg)`);
}

function loading () {
    document.querySelector(".autentication-screen").classList.add("loading");
}
