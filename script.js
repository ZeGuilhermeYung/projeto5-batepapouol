let rotateAngle = 0;
let rotateInterval;
let userName;
let userPresence;
let refreshMessages;
let currentMessages = [];


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
    userName = {name: document.querySelector(".username-login").value};
    const request = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", userName);
    request.then(successResponse);
    request.catch(errorResponse);
}

function successResponse () {
    document.querySelector(".autentication-screen.loading").classList.remove("loading");
    document.querySelector(".autentication-screen").classList.add("autenticaded");
    document.querySelector(".autentication-screen img:nth-child(4)").removeAttribute("style", `transform: rotate(${rotateAngle}deg)`);
    clearInterval(rotateInterval);  
    document.querySelector(".chat-screen.locked").classList.remove("locked");
    userPresence = setInterval(sendUserPresence, 5000);
    refreshMessages = setInterval(getMessages, 3000);
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

function sendUserPresence () {
    const presence = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", userName);
    presence.then();
    presence.catch(outOfRoom);
}
function outOfRoom (absence) {
    if (absence.response.status == 400) {
        clearInterval(userPresence);
        document.querySelector(".autentication-screen.autenticaded").classList.remove("autenticaded");
        document.querySelector(".chat-screen").classList.add("locked");
    }
}

function getMessages () {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(displayMessages);
}

function displayMessages (allMessages) {
    let lastMessage = currentMessages[currentMessages.length - 1];
    document.querySelector(".chat").innerHTML = "";
    currentMessages = allMessages.data;
    renderMessages(currentMessages);
    if ((lastMessage.from != currentMessages[currentMessages.length - 1].from) || (lastMessage.time != currentMessages[currentMessages.length - 1].time)) {
        document.querySelector(".chat .text:last-child").scrollIntoView();
    } 
}

function renderMessages (arrMessages) {
    for (let i = 0; i < arrMessages.length; i++) {
        if (arrMessages[i].type === "status") {
            document.querySelector(".chat").innerHTML += 
            `<div class="text ${arrMessages[i].type}">
                <h3><em>(${arrMessages[i].time})</em><strong>${arrMessages[i].from}  </strong>${arrMessages[i].text}</h3>
            </div>`;
        }
        if (arrMessages[i].type === "message") {
            document.querySelector(".chat").innerHTML += 
            `<div class="text ${arrMessages[i].type}">
                <h3><em>(${arrMessages[i].time})</em><strong>${arrMessages[i].from}</strong> para <strong>Todos:  </strong>${arrMessages[i].text}</h3>
            </div>`;
        }
        if ((arrMessages[i].type === "private_message") && (arrMessages[i].from === userName || arrMessages[i].to === userName)) {
            document.querySelector(".chat").innerHTML += 
            `<div class="text ${arrMessages[i].type}">
                <h3><em>(${arrMessages[i].time})</em><strong>${arrMessages[i].from}</strong> reservadamente para <strong>${arrMessages[i].to}:  </strong>${arrMessages[i].text}</h3>
            </div>`;
        }
    }
}
