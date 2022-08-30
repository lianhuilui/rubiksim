"use strict";
var s = function (sketch) {
    var slider;
    var colors;
    var availableColors = ['red', 'blue', 'green', 'yellow', 'orange', 'white'];
    function randomColor() {
        var str = availableColors[sketch.floor(sketch.random(0, availableColors.length))];
        return sketch.color(str);
    }
    function assignRandomColors() {
        colors = [
            [randomColor(), randomColor(), randomColor()],
            [randomColor(), randomColor(), randomColor()],
            [randomColor(), randomColor(), randomColor()],
        ];
    }
    sketch.setup = function () {
        sketch.createCanvas(800, 500);
        slider = sketch.createSlider(0, 500, 100);
        sketch.createP();
        assignRandomColors();
        sketch.createButton("Refresh").mousePressed(function () {
            assignRandomColors();
        });
        sketch.frameRate(15);
    };
    sketch.draw = function () {
        sketch.background('gray');
        console.log('hi');
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                sketch.stroke('black');
                sketch.fill(colors[i][j]);
                var v = slider.value();
                sketch.square(5 + i * v, 5 + j * v, sketch.floor(v * 0.9));
            }
        }
    };
};
var myp5 = new p5(s);
