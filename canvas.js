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


var cells = Array(rowCount).fill().map(() => Array(colCount).fill(false));

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
            if (cells[x][y]) {
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
}

function simulate() {

}

function update() {
    simulate();
    draw();
    window.requestAnimationFrame(update);
}

update();
