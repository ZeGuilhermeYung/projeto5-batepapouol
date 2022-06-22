let rotateAngle = 0;

setInterval(rotateImg, 150);

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
