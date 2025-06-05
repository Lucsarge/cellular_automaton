var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

var canvasBorder = document.getElementById("canvasBorder");
let borderWidth = parseInt(canvasBorder.style.borderWidth);

var cellWidth = 20;
var cellHeight = 20;
var lineThickness = 2;
var rowCount = 25;
var colCount = 25;

var fullCellWidth = cellWidth + (lineThickness * 2);
var fullCellHeight = cellHeight + (lineThickness * 2);

canvas.width = (colCount * fullCellWidth);
canvas.height = (rowCount * fullCellHeight);

class Cell {
    constructor(x, y, isAlive = false) {
        this.x = x;
        this.y = y;
        this.isAlive = isAlive;
    }
}

// var cells = Array(rowCount).fill().map(() => Array(colCount).fill(new Cell(0,0,false)));
var cells = [];

let mouseX = 0;
let mouseY = 0;

var simMinWidth = 20.0;
var canvasScale = Math.min(canvas.width, canvas.height) / simMinWidth;
var simMinWidth = canvas.width / canvasScale;
var simMinHeight = canvas.height / canvasScale;

function getCanvasX(pos) {
    return pos.x * canvasScale;
}

function getCanvasY(pos) {
    return (canvas.height - pos.y) * canvasScale;
}

function initializeArray() {
    for (let x = 0; x < colCount; x++){
        cells[x] = [];
        for (let y = 0; y < rowCount; y++){
            cells[x][y] = new Cell(x, y, false);
        }
    }
}

function draw() {
    // clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // style the grid cells
    context.fillStyle = "black";
    context.strokeStyle = "black";
    context.lineWidth = lineThickness;

    // draw the cells
    for (let y = 0; y < colCount; y++) {
        for (let x = 0; x < rowCount; x++) {
            context.beginPath();
            context.rect(x * fullCellWidth, y * fullCellHeight, fullCellWidth, fullCellHeight);
            context.stroke();
        }
    }

    // draw cells
    for (let y = 0; y < colCount; y++) {
        for (let x = 0; x < rowCount; x++) {
            if (cells[x][y].isAlive) {
                // determine the location of the cell in pixels on the canvas
                let pixelX = (x * fullCellWidth) + lineThickness;
                let pixelY = (y * fullCellHeight) + lineThickness;

                // fill in the cell
                context.strokeStyle = "red";
                context.fillStyle = "red";
                context.beginPath();
                context.rect(pixelX, pixelY, cellWidth, cellHeight);
                context.stroke();
                context.fill();
            }
        }
    }

    // draw mouse position
    context.fillStyle = "green";
    context.beginPath();
    context.arc(mouseX, mouseY, 5, 0.0, 2.0 * Math.PI);
    context.closePath();
    context.fill();
}

function getNeighborCells(x, y) {
    // neighboring cells are constructed
    // top left, top middle, top right
    // left, right
    // bottom left, bottom middle, bottom right
    let neighborCells = [
        // top cells
        new Cell(x - 1, y - 1),
        new Cell(x, y - 1),
        new Cell(x + 1, y - 1),

        // left, right cells
        new Cell(x - 1, y),
        new Cell(x + 1, y),

        // bottom cells
        new Cell(x - 1, y + 1),
        new Cell(x, y + 1),
        new Cell(x + 1, y + 1),
    ];

    // if the first cell in the top row is too high then they all will be
    if (neighborCells[0].y > 0) {
        // top left cell
        if (neighborCells[0].x > 0) {
            neighborCells[0] = cells[neighborCells[0].x][neighborCells[0].y];
        }

        // top middle cell
        neighborCells[1] = cells[neighborCells[1].x][neighborCells[1].y];

        // top right cell
        if (neighborCells[2].x < colCount) {
            neighborCells[2] = cells[neighborCells[2].x][neighborCells[2].y];
        }
    }

    // left cell
    if (neighborCells[3].x > 0) {
        neighborCells[3] = cells[neighborCells[3].x][neighborCells[3].y];
    }

    // right cell
    if (neighborCells[4].x < colCount) {
        neighborCells[4] = cells[neighborCells[4].x][neighborCells[4].y];
    }

    // if the first cell in the bottom row is too low then they all will be
    if (neighborCells[5].y < rowCount) {
        // bottom left cell
        if (neighborCells[5].x > 0) {
            neighborCells[5] = cells[neighborCells[5].x][neighborCells[5].y];
        }

        // bottom middle cell
        neighborCells[6] = cells[neighborCells[6].x][neighborCells[6].y];

        // bottom right cell
        if (neighborCells[7].x < colCount) {
            neighborCells[7] = cells[neighborCells[7].x][neighborCells[7].y];
        }
    }

    return neighborCells;
}

function simulate() {
    // number of cells that need to be updated
    let changeCount = 0;
    let modifiedCells = new Array(rowCount * colCount);

    // iterate over all cells
    for (let y = 0; y < colCount; y++) {
        for (let x = 0; x < rowCount; x++) {
            let neighborCells = getNeighborCells(x, y);
            let liveNeighbors = 0;
            for (let i = 0; i < 8; i++) {
                if (neighborCells[i].isAlive) {
                    liveNeighbors++;
                }
            }

            // live cell
            if (cells[x][y].isAlive) {
                if (liveNeighbors < 2 || liveNeighbors > 3) {
                    modifiedCells[changeCount] = new Cell(x, y, false);
                    changeCount++;
                }
            }
            // dead cell
            else {
                if (liveNeighbors == 3) {
                    modifiedCells[changeCount] = new Cell(x, y, true);
                    changeCount++;
                }
            }
        }
    }

    if (changeCount > 0) {
        for (let i = 0; i < changeCount; i++) {
            cells[modifiedCells[i].x][modifiedCells[i].y].isAlive = modifiedCells[i].isAlive;
        }
    }

    draw();
}

// -1 is accounting for the thickness of the border
function handleMouseMove(e) {
    mouseX = e.clientX - borderWidth;
    mouseY = e.clientY - borderWidth;
}

function handleMouseUp(e) {
    let x = e.clientX - borderWidth;
    let y = e.clientY - borderWidth;

    x = ~~(x / fullCellWidth);
    y = ~~(y / fullCellHeight);

    cells[x][y].isAlive = !(cells[x][y].isAlive);
}

var simIntervalID;
let simulating = false;
function Toggle() {
    simulating = !simulating;

    if (simulating) {
        simIntervalID = window.setInterval(function () { simulate(); }, 250);
    }
    else {
        clearInterval(simIntervalID);
    }
}

function update() {
    draw();
    window.requestAnimationFrame(update);
}

canvas.onmousemove = handleMouseMove;
canvas.onmouseup = handleMouseUp;

initializeArray();

update();
