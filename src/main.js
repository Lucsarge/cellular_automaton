import { Application, Sprite, Texture, CanvasSource, Color } from 'pixi.js';

const Particle = {
    EMPTY: 0,
    SAND: 1,
}

class Cell {
    constructor(x, y, particle = Particle.EMPTY) {
        this.x = x;
        this.y = y;
        this.particle = particle;
    }
}

var rowCount = 100;
var colCount = 100;

var cells = [];

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
            return "rgb(0, 0, 0)";
        case Particle.SAND:
            return "rgb(179, 156, 66)";
        default:
            return "rgb(255, 0, 200)"; // used to visually signify an error
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

(async () => {
    const app = new Application();
    await app.init();
    app.renderer.resize(500, 500);
    document.body.appendChild(app.canvas);

    // Create a canvas source, set the width and height to the number of columns and rows respectively
    const source = new CanvasSource({
        width: colCount,
        height: rowCount,
    });

    // Create texture from buffer
    const texturePixels = new Uint8Array(colCount * rowCount * 4); // stores all the rgba pixel values
    const imageTexture = Texture.from({
        resource: texturePixels,
        width: colCount,
        height: rowCount,
    });
    imageTexture.source.scaleMode = 'nearest';

    // Create sprite and assign the texture
    var sprite = new Sprite(imageTexture);
    sprite.scale.set(5);
    sprite.position.set(0, 0);

    // Properties for tracking the mouse location
    let isWithinSprite = false; // updates when the pointer enters or leaves the bounds of the sprite
    let mouseX = 0, mouseY = 0;

    // Set up sprite events
    sprite.eventMode = 'static';
    sprite.on('pointermove', (event) => {
        const localPosition = event.getLocalPosition(sprite); // gets the raw x,y point of the pointer(mouse) within the sprite

        // truncate mouse position into integer grid coordinates
        mouseX = ~~(localPosition.x);
        mouseY = ~~(localPosition.y);
    });
    sprite.on('pointerover', (event) => {
        isWithinSprite = true;
    });
    sprite.on('pointerout', (event) => {
        isWithinSprite = false;
    });

    app.stage.addChild(sprite);

    initializeArray(); // initialize array of cells

    app.ticker.add((ticker) => {
        // execute simulation logic
        simulate();

        // check for user inputs within the sprite
        if (isWithinSprite) {
            if (app.renderer.events.pointer.buttons == 1) {
                if (cells[mouseX][mouseY].particle == Particle.EMPTY) {
                    cells[mouseX][mouseY] = new Cell(mouseX, mouseY, Particle.SAND);
                }
            }
        }

        // draw the cells
        let pixelIndex = 0;
        for (let y = 0; y < colCount; y++) {
            for (let x = 0; x < rowCount; x++) {
                var rgb = getParticleColor(cells[x][y].particle); // get the rgb color string
                rgb = rgb.replace(/[^\d,]/g, '').split(','); // convert the single rgb color string into 3 separate integer values

                // set the rbg values with the alpha being fixed for every pixel
                texturePixels[pixelIndex] = rgb[0];
                texturePixels[pixelIndex + 1] = rgb[1];
                texturePixels[pixelIndex + 2] = rgb[2];
                texturePixels[pixelIndex + 3] = 255; // keep alpha value full
                pixelIndex += 4; // increment this 4 to get to the start of the next pixel
            }
        }

        imageTexture.source.update(); // update the image texture after modifying the texturePixels
    });
})();
