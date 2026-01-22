import { Application, Sprite, Texture, CanvasSource, Color } from 'pixi.js';

(async () => {
    // const pixels = new Uint8Array(width * height * 4);
    const app = new Application();
    await app.init();
    app.renderer.resize(800, 800);
    document.body.appendChild(app.canvas);

    // Create a canvas source
    const source = new CanvasSource({
        width: 100,
        height: 100,
    });

    // Access 2D context
    const ctx = source.context2D;

    const width = source.width;
    const height = source.height;
    // Draw pixels
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4; // starting index = y * width + x (row we are currently on times the width plus an offset of the col we are one), times 4 because the data is comprised of RGBA values

            const isWhite = (Math.floor(x / 1) + Math.floor(y / 1)) % 2 === 0;

            // set the RGBA values with A always being fully 255 meaning opaque
            data[index] = isWhite ? 255 : 0;
            data[index + 1] = isWhite ? 255 : 0;
            data[index + 2] = isWhite ? 255 : 0;
            data[index + 3] = 255;
        }
    }
    ctx.putImageData(imageData, 0, 0);

    // Create texture from source
    const texture = new Texture({ source });
    texture.source.scaleMode = 'nearest'; // ensure there is no pixel blurring effect

    // Sprite
    const sprite = new Sprite(texture);
    sprite.scale.set(8);
    sprite.position.set(0, 0);
    app.stage.addChild(sprite);

    // Notify Pixi texture updated
    source.update();

})();