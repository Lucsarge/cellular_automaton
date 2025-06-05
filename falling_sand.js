var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

var canvasBorder = document.getElementById("canvasBorder");
let borderWidth = parseInt(canvasBorder.style.borderWidth);

var cellWidth = 5;
var cellHeight = 5;
var rowCount = 100;
var colCount = 100;

canvas.width = (colCount * cellWidth);
canvas.height = (rowCount * cellHeight);

const Particle = {
    EMPTY: 0,
    SAND: 1,
}

class Cell {
    constructor(x, y, particle = Particle.SAND) {
        this.x = x;
        this.y = y;
        this.particle = particle;
    }
}

var cells = [];

let mouseX = 0;
let mouseY = 0;

function initializeArray() {
    for (let x = 0; x < colCount; x++) {
        cells[x] = [];
        for (let y = 0; y < rowCount; y++) {
            cells[x][y] = new Cell(x, y, Particle.EMPTY);
        }
    }
}

function getParticleColor(particle) {
    switch (particle) {
        case Particle.EMPTY:
            return "black";
        case Particle.SAND:
            return "#b39c42";
        default:
            return "pink"; // used to visually signify an error
    }
}

function existsAndIsEmpty(x, y) {
    if (x >= 0
        && x < rowCount
        && cells[x][y].particle == Particle.EMPTY) {
        return true;
    }
}

function simulate() {
    // number of cells that need to be updated
    let changeCount = 0;
    var modifiedCells = new Array(rowCount * colCount);

    // iterate over all cells in the grid
    for (let y = 0; y < colCount; y++) {
        for (let x = 0; x < rowCount; x++) {
            if (cells[x][y].particle == Particle.SAND) {
                if (y + 1 != colCount) {
                    if (cells[x][y + 1].particle == Particle.EMPTY) {
                        modifiedCells[changeCount] = new Cell(x, y, Particle.EMPTY);
                        changeCount++;

                        modifiedCells[changeCount] = new Cell(x, y + 1, Particle.SAND);
                        changeCount++;
                    }
                    else if (existsAndIsEmpty(x - 1, y + 1)) {
                        modifiedCells[changeCount] = new Cell(x, y, Particle.EMPTY);
                        changeCount++;

                        modifiedCells[changeCount] = new Cell(x - 1, y + 1, Particle.SAND);
                        changeCount++;
                    }
                    else if (existsAndIsEmpty(x + 1, y + 1)) {
                        modifiedCells[changeCount] = new Cell(x, y, Particle.EMPTY);
                        changeCount++;

                        modifiedCells[changeCount] = new Cell(x + 1, y + 1, Particle.SAND);
                        changeCount++;
                    }
                }
            }
        }
    }

    // update the modified cells after iterating over the whole grid
    if (changeCount > 0) {
        for (let i = 0; i < changeCount; i++) {
            cells[modifiedCells[i].x][modifiedCells[i].y].particle = modifiedCells[i].particle;
        }
    }
}

function draw() {
    // clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // draw the cells
    for (let y = 0; y < colCount; y++) {
        for (let x = 0; x < rowCount; x++) {
            context.fillStyle = getParticleColor(cells[x][y].particle);
            context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        }
    }

    // draw mouse position
    context.fillStyle = "green";
    context.beginPath();
    context.arc(mouseX, mouseY, 5, 0.0, 2.0 * Math.PI);
    context.closePath();
    context.fill();

    // draw the current cell that is being highlighted
    context.fillStyle = "rgba(255, 255, 255, 0.5)";
    context.fillRect(currentGridX * cellWidth, currentGridY * cellHeight, cellWidth, cellHeight);
}

let currentGridX = 0;
let currentGridY = 0;

function handleMouseMove(e) {
    mouseX = e.clientX - borderWidth;
    mouseY = e.clientY - borderWidth;

    let x = mouseX - borderWidth;
    let y = mouseY - borderWidth;

    x = ~~(x / cellWidth);
    y = ~~(y / cellHeight);

    currentGridX = x;
    currentGridY = y;
}

let mouseIsDown = false;

function handleMouseDown(e) {
    mouseIsDown = true;
}

function handleMouseUp(e) {
    mouseIsDown = false;
}

// for debug purposes, allows for single stepping of the program
// function Toggle() {
//     simulate();
//     draw();
// }

function placeParticle() {
    let x = mouseX - borderWidth;
    let y = mouseY - borderWidth;

    x = ~~(x / cellWidth);
    y = ~~(y / cellHeight);

    if (cells[x][y].particle == Particle.EMPTY) {
        cells[x][y].particle = Particle.SAND;
    }
}

canvas.onmousemove = handleMouseMove;
canvas.onmousedown = handleMouseDown;
canvas.onmouseup = handleMouseUp;

initializeArray();

function update() {
    simulate();
    if (mouseIsDown) { placeParticle(); }
    draw();
    window.requestAnimationFrame(update);
}

update();
