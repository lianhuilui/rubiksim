let sketch1 = (sketch) => {
    let w = 100;
    let h = 100;

    let canvas;

    sketch.setup = () => {
        canvas = sketch.createCanvas(w, h);

        sketch.pixelDensity(1);
        sketch.frameRate(25)

        // canvas.style('image-rendering', 'pixelated')
    };

    let rate = 0;

    sketch.draw = () => {

        sketch.background(0)
        sketch.loadPixels()

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                let i = ((y * w) + x) * 4

                if (y < 20) {

                    if (y % 2) {
                        if (x % 2) {
                            sketch.pixels[i + 1] = 255
                        } else {
                            sketch.pixels[i] = 255
                        }
                    } else {
                        if (x % 2) {
                            sketch.pixels[i + 2] = 255
                        } else {
                            sketch.pixels[i + 1] = 255
                        }
                    }
                } else if (y < 40) {
                    if (x % 3 == 0) {
                        sketch.pixels[i] = 255
                    } else if ((x + 1) % 3 == 0) {
                        sketch.pixels[i + 1] = 255
                    } else if ((x + 2) % 3 == 0) {
                        sketch.pixels[i + 2] = 255
                    }
                } else {
                    if (x % 3 == 0) {
                        sketch.pixels[i] = 255
                        sketch.pixels[i+2] = 255
                    } else if ((x + 1) % 3 == 0) {
                        sketch.pixels[i] = 255
                        sketch.pixels[i + 1] = 255
                    } else if ((x + 2) % 3 == 0) {
                        sketch.pixels[i + 1] = 255
                        sketch.pixels[i + 2] = 255
                    }
                }

                sketch.pixels[i + 3] = 255
            }
        }

        sketch.updatePixels()
        return;

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {

                let i = ((y * w) + x) * 4

                console.log('x, y, i', x, y, i)
                if (y == 0 || x == 0) {
                    sketch.pixels[i] = 255;
                    // sketch.pixels[i+1] = 255;
                    // sketch.pixels[i+2] = 255;
                    sketch.pixels[i + 3] = 255;
                } else {
                    sketch.pixels[i + 2] = 255;
                    // sketch.pixels[i+1] = 255;
                    // sketch.pixels[i+2] = 255;
                    sketch.pixels[i + 3] = 255;
                    // if (x % 2) {
                    //     sketch.pixels[i] = 0;
                    //     sketch.pixels[i + 1] = 255;
                    //     sketch.pixels[i + 2] = 0;
                    // } else {
                    //     sketch.pixels[i] = 0;
                    //     sketch.pixels[i + 1] = 0;
                    //     sketch.pixels[i + 2] = 255;
                    // }
                }
            }
        }

        sketch.updatePixels()
    };
};

let myp5 = new p5(sketch1);