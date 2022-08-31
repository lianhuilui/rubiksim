let createBlend = (useColors: number[][]) => {
    let s = (sketch: p5) => {

        let v = 10
        let margin = 1
        let offset = 1

        let w = 300
        let h = 120

        sketch.setup = () => {
            sketch.createCanvas(w, h)
            sketch.frameRate(15)
        }

        sketch.draw = () => {
            sketch.background('black');

            for (let i = 0; i < h / v; i++) {
                for (let j = 0; j < w / v; j++) {
                    let color: string = availableColors[
                        useColors[i % useColors.length][j % useColors[i % useColors.length].length]
                    ]

                    sketch.noStroke()

                    sketch.fill(color)
                    sketch.square(
                        margin + offset + j * v,
                        margin + offset + i * v,
                        sketch.floor(v) - offset - offset)
                }
            }

        }
    }

    let myp5 = new p5(s)
}

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
]

// green blue
createBlend([
    [1, 2],
    [2, 1]
])

// yellow and green
createBlend([
    [1, 3],
    [3, 1]
])

// yellow and white
createBlend([
    [5, 3],
    [3, 5]
])

// yellow and green
createBlend([
    [2, 3],
    [3, 2]
])

// red and blue
createBlend([
    [1, 0],
    [0, 1]
])