"use strict";
let s = (sketch) => {
    let slider;
    let colors;
    let availableColors = ['red', 'blue', 'green', 'yellow', 'orange', 'white'];
    function randomColor() {
        let str = availableColors[sketch.floor(sketch.random(0, availableColors.length))];
        return sketch.color(str);
    }
    function assignRandomColors() {
        colors = [
            [randomColor(), randomColor(), randomColor()],
            [randomColor(), randomColor(), randomColor()],
            [randomColor(), randomColor(), randomColor()],
        ];
    }
    sketch.setup = () => {
        sketch.createCanvas(800, 500);
        slider = sketch.createSlider(0, 500, 100);
        sketch.createP();
        assignRandomColors();
        sketch.createButton("Refresh").mousePressed(() => {
            assignRandomColors();
        });
        sketch.frameRate(15);
    };
    sketch.draw = () => {
        sketch.background('gray');
        console.log('hi');
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                sketch.stroke('black');
                sketch.fill(colors[i][j]);
                let v = slider.value();
                sketch.square(5 + i * v, 5 + j * v, sketch.floor(v * 0.9));
            }
        }
    };
};
let myp5 = new p5(s);
