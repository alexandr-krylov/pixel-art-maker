const canvasWidth = 80;
const canvasHeight = 40;
let currentColor = "red";
let isDrawing = false;
const canvas = document.getElementById("canvas");
const color  =  document.querySelector("input[type=color]");
const saveButton = document.getElementById("save-button");
const loadButton = document.getElementById("load-button");
const drawButton = document.getElementById("pencil-button");
const fillingButton = document.getElementById("filling-button");
const storage = window.localStorage;
saveButton.addEventListener("click", saveCanvas);
loadButton.addEventListener("click", loadCanvas);
drawButton.addEventListener("click", switchToDrawing);
fillingButton.addEventListener("click", switchToFilling);
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
    palette.style.backgroundColor = palette.getAttribute("data-value");
});
showCurrentCollor();

const palette = document.getElementById("palette");
palette.addEventListener("click", setColor);

function drawPixel(evt) {
    if (evt.target.classList.contains("pixel")) {
        evt.target.style.backgroundColor = currentColor;
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
    evt.target.style.backgroundColor = currentColor;
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

function floodFill(element, replaceableColor, fillingColor) {
    if (element.style.backgroundColor !== replaceableColor) return;
    element.style.backgroundColor = fillingColor;
    let nextElement = getNorthElement(element);
    if (nextElement !== null) {
        floodFill(nextElement, replaceableColor, fillingColor);
    }
    nextElement = getEastElement(element);
    if (nextElement !== null) {
        floodFill(nextElement, replaceableColor, fillingColor);
    }
    nextElement = getSouthElement(element);
    if (nextElement !== null) {
        floodFill(nextElement, replaceableColor, fillingColor);
    }
    nextElement = getWestElement(element);
    if (nextElement !== null) {
        floodFill(nextElement, replaceableColor, fillingColor);
    }
}

function getNorthElement(element) {
    let parent = element.parentElement, northRow = null;
    while (parent.previousSibling) {
        if (parent.previousSibling.classList && parent.previousSibling.classList.contains("row")) {
            northRow = parent.previousSibling;
            break;
        }
        parent = parent.previousSibling;
    }
    if (!northRow) return null;
    let westCount = 0;
    while (element.previousSibling) {
        if (element.previousSibling.classList && element.previousSibling.classList.contains("pixel")) westCount ++;
        element = element.previousSibling;
    }
    let northPixelCandidate = northRow.firstChild;
    let northPixel = null;
    while (northPixelCandidate) {
        if (northPixelCandidate.classList.contains("pixel")) {
            if (westCount == 0) {
                northPixel = northPixelCandidate;
                break;
            }
            westCount --;
        }
        northPixelCandidate = northPixelCandidate.nextSibling;
    }
    return northPixel;
}

function getEastElement(element) {
    while (element.nextSibling) {
        if (element.nextSibling.classList.contains("pixel")) return  element.nextSibling;
        element = element.nextSibling;
    }
    return null;
}

function getSouthElement(element) {
    let parent = element.parentElement, southRow = null;
    while (parent.nextSibling) {
        if (parent.nextSibling.classList && parent.nextSibling.classList.contains("row")) {
            southRow = parent.nextSibling;
            break;
        }
        parent = parent.nextSibling;
    }
    if (!southRow) return null;
    let westCount = 0;
    while (element.previousSibling) {
        if (element.previousSibling.classList && element.previousSibling.classList.contains("pixel")) westCount ++;
        element = element.previousSibling;
    }
    let southPixelCandidate = southRow.firstChild;
    let southPixel = null;
    while (southPixelCandidate) {
        if (southPixelCandidate.classList.contains("pixel")) {
            if (westCount == 0) {
                southPixel = southPixelCandidate;
                break;
            }
            westCount --;
        }
        southPixelCandidate = southPixelCandidate.nextSibling;
    }
    return southPixel;
}

function getWestElement(element) {
    while (element.previousSibling) {
        if  (element.previousSibling.classList.contains("pixel"))  return element.previousSibling;
        element = element.previousSibling;
    }
    return null;
}

function switchToFilling() {
    canvas.removeEventListener("click", drawPixel);
    canvas.removeEventListener("mousedown", startDraw);
    canvas.removeEventListener("mouseup", stopDraw);
    canvas.addEventListener("click", filling);
    canvas.style.cursor = "url('icons/paint_32_32.png') 30 27, default";
}

function switchToDrawing() {
    canvas.removeEventListener("click", filling);
    canvas.addEventListener("click",  drawPixel);
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mouseup", stopDraw);
    canvas.style.cursor = "default";
}

function filling(evt) {
    if (evt.target.classList.contains("pixel")) {
        if (evt.target.style.backgroundColor == currentColor) return;
        floodFill(evt.target, evt.target.style.backgroundColor, currentColor);
    }
}
