let rotateAngle = 0;
let rotateInterval;

function rotateImg () {
    rotateAngle = rotateAngle + 45;
    if (rotateAngle == 360) {
        rotateAngle = 0;
    }
    document.querySelector(".autentication-screen img:nth-child(4)").setAttribute("style", `transform: rotate(${rotateAngle}deg)`);
}

function checkNameRequest () {
    document.querySelector(".autentication-screen").classList.add("loading");
    rotateInterval = setInterval(rotateImg, 150);
    const userName = {name: document.querySelector(".username-login").value};
    const request = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", userName);
    request.then(successResponse);
    request.catch(errorResponse);
}

function successResponse (){
   document.querySelector(".autentication-screen").classList.add("autenticaded");
   document.querySelector(".autentication-screen img:nth-child(4)").removeAttribute("style", `transform: rotate(${rotateAngle}deg)`);
   clearInterval(rotateInterval);  
   document.querySelector(".chat-screen.locked").classList.remove("locked");
}

function errorResponse (error) {
    if (error.response.status == 400) {
        document.querySelector(".autentication-screen.loading").classList.add("alreadyUsed");
        setTimeout(() => {
            document.querySelector(".autentication-screen.loading.alreadyUsed").classList.remove("alreadyUsed");
            document.querySelector(".autentication-screen.loading").classList.remove("loading");
            document.querySelector(".autentication-screen img:nth-child(4)").removeAttribute("style", `transform: rotate(${rotateAngle}deg)`);
            clearInterval(rotateInterval);
            }, 2000)
    }
}
