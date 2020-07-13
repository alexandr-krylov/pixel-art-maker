const canvasWidth = 80;
const canvasHeight = 40;
let currentColor = "red";
let isDrawing = false;
const canvas = document.getElementById("canvas");
const color  =  document.querySelector("input[type=color]");
const saveButton = document.getElementById("save-button");
const loadButton = document.getElementById("load-button");
const storage = window.localStorage;
saveButton.addEventListener("click", saveCanvas);
loadButton.addEventListener("click", loadCanvas);

color.setAttribute("data-value", color.value);
color.addEventListener("change", customColorChange);
canvas.addEventListener("click", drawPixel);
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", stopDraw);
document.body.addEventListener("mousedown", () => {isDrawing = true});
document.body.addEventListener("mouseup", () => {isDrawing = false});
canvas.style.width = canvasWidth * 10 + "px";
canvas.style.height = canvasHeight * 10 + "px";
for (let i = 0; i < canvasHeight; i++){
    let row = document.createElement("div");
    row.classList.add("row");
    for (let  j = 0; j < canvasWidth; j++){
        let pixel = document.createElement("div");
        pixel.classList.add("pixel");
        row.appendChild(pixel);
        pixel.addEventListener("mouseenter", draw);
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

function startDraw(evt) {
    isDrawing = true;
    draw(evt)
}

function stopDraw() {
    isDrawing = false;
}

function draw(evt) {
    if (isDrawing) {
        drawPixel(evt);
    }
}

function customColorChange(evt) {
    currentColor = evt.target.value;
    evt.target.setAttribute("data-value", currentColor);
    evt.target.style.background = currentColor;
    evt.stopPropagation();
    showCurrentCollor();
}

function saveCanvas() {
    let canvasForSave = [];
    let rows = canvas.children;
    let canvasForSaveRow = 0, canvasForSavePixel = 0;
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].classList.contains("row")) {
            let pixels = rows[i].children;
            canvasForSave[canvasForSaveRow] = [];
            for (let j = 0; j < pixels.length; j++) {
                if (pixels[j].classList.contains("pixel")) {
                    canvasForSave[canvasForSaveRow][canvasForSavePixel] = pixels[j].style.backgroundColor;
                    canvasForSavePixel++;
                }
            }
            canvasForSavePixel = 0;
            canvasForSaveRow++
        }
    }
    storage.setItem("canvas",  JSON.stringify(canvasForSave));
}

function loadCanvas() {
    let canvasForSave = JSON.parse(storage.getItem("canvas"));
    let rows = canvas.children;
    let canvasForSaveRow = 0, canvasForSavePixel = 0;
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].classList.contains("row")) {
            let pixels = rows[i].children;
            for (let j = 0; j < pixels.length; j++) {
                if (pixels[j].classList.contains("pixel")) {
                     pixels[j].style.backgroundColor = canvasForSave[canvasForSaveRow][canvasForSavePixel];
                    canvasForSavePixel++;
                }
            }
            canvasForSavePixel = 0;
            canvasForSaveRow++
        }
    }
}
