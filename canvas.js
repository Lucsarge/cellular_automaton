var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

// establish canvas elements width and height
// canvas.width = window.innerWidth - 20; // -20 = width margin
// canvas.height = window.innerHeight - 100; // -100 = height margin

var cellWidth = 20;
var cellHeight = 20;
var lineWidth = 1;
var rowCount = 25;
var colCount = 25;

canvas.width = (colCount * cellWidth) + ((colCount * lineWidth) - 2); // -2 is to account for the outside(top,bottom,left,right) grid lines that the canvas border consists of
canvas.height = (rowCount * cellHeight) + ((rowCount * lineWidth) - 2); // same explanation as ^

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
    // draw grid lines
    context.clearRect(0, 0, canvas.width, canvas.height);

    // style the grid lines
    context.fillStyle = "#000000";
    context.lineWidth = 1;

    // r = rows
    for (let row = 0; row < rowCount; row++) {
        context.beginPath();
        context.moveTo(row * (cellHeight + lineWidth), 0);
        context.lineTo(row * (cellHeight + lineWidth), canvas.width);
        context.closePath();
        context.stroke();
    }

    // c = columns
    for (let col = 0; col < colCount; col++) {
        context.beginPath();
        context.moveTo(0, col * (cellWidth + lineWidth));
        context.lineTo(canvas.height, col * (cellWidth + lineWidth));
        context.closePath();
        context.stroke();
    }
}

function simulate() {

}

function update() {
    simulate();
    draw();
    window.requestAnimationFrame();
}

update();
