let rotateAngle = 0;
let rotateInterval;
let userName;
let userPresence;
let refreshMessages;
let lastMessage = [];
let refreshParticipants;
let currentMessages = [];


function rotateImg () {
    rotateAngle = rotateAngle + 45;
    if (rotateAngle == 360) {
        rotateAngle = 0;
    }
    document.querySelector(".autentication-screen img:nth-child(4)").setAttribute("style", `transform: rotate(${rotateAngle}deg)`);
}
document.querySelector(".username-login").addEventListener("keypress", function(e) {
    if(e.key === "Enter") {
        e.preventDefault();
        document.querySelector(".submit-user").click();
    }
  });

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
    document.querySelector(".header h4").innerHTML = `Bem-vindo(a),<br>${userName.name}!`
    userPresence = setInterval(sendUserPresence, 5000);
    refreshMessages = setInterval(getMessages, 3000);
    refreshParticipants = setInterval(getParticipants, 10000);
}

function errorResponse (error) {
    if (error.response.status == 400) {
        document.querySelector(".autentication-screen.loading").classList.add("alreadyUsed");
        setTimeout(() => {
            document.querySelector(".autentication-screen.loading.alreadyUsed").classList.remove("alreadyUsed");
            document.querySelector(".autentication-screen.loading").classList.remove("loading");
            document.querySelector(".autentication-screen img:nth-child(4)").removeAttribute("style", `transform: rotate(${rotateAngle}deg)`);
            clearInterval(rotateInterval);
            }, 3000)
    }
}

function sendUserPresence () {
    const presence = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", userName);
    presence.then();
    presence.catch();
}

function getMessages () {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(displayMessages);
}

function displayMessages (allMessages) {
    if (currentMessages.length != 0) {
        lastMessage = currentMessages[currentMessages.length - 1];
    }
    document.querySelector(".chat").innerHTML = "";
    currentMessages = allMessages.data;
    renderMessages(currentMessages);
    if (lastMessage.length != 0) {
        if ((lastMessage.from != currentMessages[currentMessages.length - 1].from) || 
        (lastMessage.time != currentMessages[currentMessages.length - 1].time)) {
            document.querySelector(".chat .text:last-child").scrollIntoView();
        }
    } else {
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
        if ((arrMessages[i].type === "private_message") && (arrMessages[i].from === userName.name || arrMessages[i].to === userName.name)) {
            document.querySelector(".chat").innerHTML += 
            `<div class="text ${arrMessages[i].type}">
                <h3><em>(${arrMessages[i].time})</em><strong>${arrMessages[i].from}</strong> reservadamente para <strong>${arrMessages[i].to}:  </strong>${arrMessages[i].text}</h3>
            </div>`;
        }
    }
}

function getParticipants () {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promise.then(displayParticipants);
}

function displayParticipants (allParticipants) {
    if (document.querySelector(".participant.selected") != undefined) {
        privateSelected = document.querySelector(".participant.selected h2").innerHTML;
        document.querySelector(".online-users").innerHTML = `
        <div class="all-participants" name="Todos" onclick="selectUser(this);">
            <ion-icon name="people"></ion-icon><h2>Todos</h2>
            <ion-icon class="mark-user" name="checkmark"></ion-icon>
        </div>
        <div class="participant selected" name="${privateSelected}" onclick="selectUser(this);">
            <ion-icon name="person-circle"></ion-icon><h2>${privateSelected}</h2>
            <ion-icon class="mark-user" name="checkmark"></ion-icon>
        </div>`;
        for (let i = 0; i < allParticipants.data.length; i++) {
            if ((allParticipants.data[i].name != userName.name) && (privateSelected != allParticipants.data[i].name)) {    
                document.querySelector(".online-users").innerHTML += `
                <div class="participant" name="${allParticipants.data[i].name}" onclick="selectUser(this);">
                    <ion-icon name="person-circle"></ion-icon><h2>${allParticipants.data[i].name}</h2>
                    <ion-icon class="mark-user" name="checkmark"></ion-icon>
                </div>`;
            }  
        }
    } else {
        document.querySelector(".online-users").innerHTML = `
        <div class="all-participants selected" name="Todos" onclick="selectUser(this);">
            <ion-icon name="people"></ion-icon><h2>Todos</h2>
            <ion-icon class="mark-user" name="checkmark"></ion-icon>
        </div>`;
        for (let i = 0; i < allParticipants.data.length; i++) {
            if (allParticipants.data[i].name != userName.name) {    
                document.querySelector(".online-users").innerHTML += `
                <div class="participant" name="${allParticipants.data[i].name}" onclick="selectUser(this);">
                    <ion-icon name="person-circle"></ion-icon><h2>${allParticipants.data[i].name}</h2>
                    <ion-icon class="mark-user" name="checkmark"></ion-icon>
                </div>`;
            }  
        }
    } 
}

function openSideMenu () {
    document.querySelector(".options-privacy-messages.locked").classList.remove("locked");
    document.querySelector("body").classList.add("not-scrolling");
}
function closeSideMenu () {
    document.querySelector(".options-privacy-messages").classList.add("locked");
    document.querySelector("body").classList.remove("not-scrolling");
}

function selectUser (userClicked) {
    if (document.querySelector(".all-participants.selected") !== null) {
        document.querySelector(".all-participants.selected").classList.remove("selected");
    }
    if (document.querySelector(".participant.selected") !== null) {
        document.querySelector(".participant.selected").classList.remove("selected");
    }
    userClicked.classList.add("selected");
    if (document.querySelector(".all-participants.selected") !== null) {
        document.querySelector(".footer h4").innerHTML = "";
    } else {
        privateUser = document.querySelector(".participant.selected h2").innerHTML;
        document.querySelector(".footer h4").innerHTML = `Enviando para ${privateUser} (reservadamente)`;
    }
    if (document.querySelector(".all-participants.selected") !== null && document.querySelector(".private.selected") !== null) {
        document.querySelector(".private.selected").classList.remove("selected");
        document.querySelector(".public").classList.add("selected");
    }
    if (document.querySelector(".participant.selected") !== null && document.querySelector(".public.selected") !== null) {
        document.querySelector(".public.selected").classList.remove("selected");
        document.querySelector(".private").classList.add("selected");
    }
    
}

function selectPrivacy (privacyClicked) {
    document.querySelector(".visibility.selected").classList.remove("selected");
    privacyClicked.classList.add("selected");
}

function sendMessage () {
    let messageToSend;
    if (document.querySelector(".write-message").value != "") {
        if ((document.querySelector(".participant.selected") != undefined) && (document.querySelector(".visibility.private.selected") != undefined)) {
            messageToSend = {
                from: userName.name,
                to: document.querySelector(".participant.selected h2").innerHTML,
                text: document.querySelector(".write-message").value,
                type: "private_message"
            }
        } else {
            messageToSend = {
                from: userName.name,
                to: document.querySelector(".all-participants h2").innerHTML,
                text: document.querySelector(".write-message").value,
                type: "message"
            }   
        }
        const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", messageToSend);
        document.querySelector(".write-message").value = "";
        promise.then(getMessages);
        promise.catch(outOfRoom);
    }
}
function outOfRoom (absence) {
    if (absence.response.status == 400) {
        rotateInterval = setInterval(rotateImg, 150);
        document.querySelector(".autentication-screen").classList.remove("autenticaded");
        document.querySelector(".autentication-screen").classList.add("loading");
        document.querySelector(".chat-screen").classList.add("locked");
        document.querySelector(".autentication-screen.loading h2").innerHTML = `Você foi desconectado.<br>Retornando a tela de login`;
        setTimeout(() => {
            window.location.reload()
        }, 3000)
    }
}
document.querySelector(".write-message").addEventListener("keypress", function(e) {
    if(e.key === "Enter") {
        e.preventDefault();
        document.querySelector(".send-message-button").click();
    }
});

function logOut () {
    rotateInterval = setInterval(rotateImg, 150);
    document.querySelector(".options-privacy-messages").classList.add("locked");
    document.querySelector(".autentication-screen").classList.remove("autenticaded");
    document.querySelector(".autentication-screen").classList.add("loading");
    document.querySelector(".chat-screen").classList.add("locked");
    document.querySelector(".autentication-screen.loading h2").innerHTML = `Saindo...`;
    setTimeout(() => {
        window.location.reload()
    }, 3000)
}