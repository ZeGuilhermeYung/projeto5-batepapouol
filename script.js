let turnAngle = 0;

setInterval(rotateImg, 170);

function rotateImg () {
    turnAngle = turnAngle + 45;
    document.querySelector(".autentication-screen img:nth-child(4)").setAttribute("style", "transform: rotate(" + turnAngle + "deg)");
    document.querySelector(".autentication-screen img:nth-child(4)").classList.toggle("rotate");
}
