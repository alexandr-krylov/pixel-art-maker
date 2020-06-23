const canvasWidth = 80;
const canvasHeight = 40;
let currentColor = "red";
const canvas = document.getElementById("canvas");
canvas.addEventListener("click", drawPixel);
canvas.style.width = canvasWidth * 10 + "px";
canvas.style.height = canvasHeight * 10 + "px";
for (let i = 0; i < canvasHeight; i++){
    let row = document.createElement("div");
    row.classList.add("row");
    for (let  j = 0; j < canvasWidth; j++){
        let pixel = document.createElement("div");
        pixel.classList.add("pixel");
        row.appendChild(pixel);
    }
    canvas.appendChild(row);
}

const palettes = document.querySelectorAll(".palette");
palettes.forEach(function (palette) {
    palette.style.background = palette.getAttribute("data-value");
});
showCurrentCollor();

const palette = document.getElementById("palette");
palette.addEventListener("click", setColor);

function drawPixel(evt) {
    if (evt.target.classList.contains("pixel")) {
        evt.target.style.background = currentColor;
        evt.stopPropagation();
    }
}

function setColor(evt) {
    if (evt.target.classList.contains("palette")) {
        currentColor = evt.target.getAttribute("data-value");
        evt.stopPropagation();
        showCurrentCollor();
    }
}

function showCurrentCollor() {
    const element = document.getElementById("current-color");
    element.style.background = currentColor;
}
