"use strict";
(function () {
    let sketch1 = (sketch) => {
        let w = 300;
        let h = 300;
        let image;
        sketch.setup = () => {
            sketch.createCanvas(w, h);
            sketch.frameRate(1);
            image = sketch.loadImage('test.jpg');
        };
        sketch.draw = () => {
            sketch.background('black');
            sketch.image(image, 0, 0);
        };
    };
    let sketch2 = (sketch) => {
        let w = 300;
        let h = 300;
        let image;
        sketch.setup = () => {
            sketch.createCanvas(w, h);
            sketch.frameRate(1);
            image = sketch.loadImage('test2.jpg');
        };
        sketch.draw = () => {
            image.loadPixels();
            console.log('height', image.height);
            console.log('width', image.width);
            for (let y = 0; y < image.height; y++) {
                for (let x = 0; x < image.width; x++) {
                    let index = y * 4 * image.width + x * 4;
                    if (y < 10) {
                        image.pixels[index] = 0;
                        image.pixels[index + 1] = 255;
                        image.pixels[index + 2] = 255;
                        image.pixels[index + 3] = 255;
                    }
                    if (x < 10) {
                        image.pixels[index] = 255;
                        image.pixels[index + 1] = 0;
                        image.pixels[index + 2] = 255;
                        image.pixels[index + 3] = 255;
                    }
                    let red = image.pixels[index];
                    let green = image.pixels[index + 1];
                    let blue = image.pixels[index + 2];
                    let r = sketch.round(red / 255) * 255;
                    let g = sketch.round(green / 255) * 255;
                    let b = sketch.round(blue / 255) * 255;
                    // sketch.set(x, y, sketch.color(r, g, b))
                    image.pixels[index] = r;
                    image.pixels[index + 1] = g;
                    image.pixels[index + 2] = b;
                }
            }
            image.updatePixels();
            sketch.background('red');
            sketch.image(image, 0, 0);
        };
    };
    let myp5 = new p5(sketch1);
    let myp5_2 = new p5(sketch2);
    let availableColors = [
        // '#bb0000', // red
        '#BB2328',
        // '#0000bb', // blue
        '#013082',
        // '#009900', // green
        '#01B351',
        // '#efea00', // yellow
        '#F5FF42',
        // '#eea500', // orange
        '#FE8F25',
        // '#efefef', // white
        '#ECF3F6'
    ];
})();
