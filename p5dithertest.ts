(function () {
    let sketch1 = (sketch: p5) => {

        let w = 200
        let h = 200

        let image: p5.Image;

        sketch.setup = () => {
            let canvas = sketch.createCanvas(w, h)

            sketch.frameRate(1)

            image = sketch.loadImage('gray.png')
        }

        sketch.draw = () => {
            sketch.background('black');
            sketch.image(image, 0, 0)
        }
    }

    let sketch2 = (sketch: p5) => {

        let w = 200
        let h = 200

        let image: p5.Image;

        let alreadyran = false

        const xytoindex = (x: number, y: number, w: number) => y * 4 * w + x * 4
        const togray = (values: number[]) => sketch.round((values[0] + values[1] + values[2]) / 3)

        sketch.setup = () => {
            sketch.createCanvas(w, h)

            sketch.setAttributes('antialias', false)

            sketch.frameRate(24)

            image = sketch.loadImage('gray.png')
        }

        sketch.draw = () => {
            image.loadPixels()

            if (alreadyran) return

            alreadyran = true

            let levels = 1

            // console.log('updating upto', upto)
            // upto++
            // console.log('now it is upto', upto)

            const quantize = (x: number) => sketch.round(x / 255 * levels) * 255 / levels

            for (let y = 0; y < image.height; y++) {
                for (let x = 0; x < image.width; x++) {

                    let index = xytoindex(x, y, image.width)



                    let red = image.pixels[index]
                    let green = image.pixels[index + 1]
                    let blue = image.pixels[index + 2]

                    // let gray = (red + green + blue) / 3
                    let old_pixel = togray(image.get(x, y))

                    // pseudo code for dithering
                    // old pixel = pixel at (x,y)
                    // new pixel  = find closest color of old pixel
                    // quant error = old pixel - new pixel
                    // pixel at (x + 1, y    ) = pixel (x + 1, y    ) + quant error * 7 / 16
                    // pixel at (x - 1, y + 1) = pixel (x - 1, y + 1) + quant error * 3 / 16
                    // pixel at (x    , y + 1) = pixel (x    , y + 1) + quant error * 5 / 16
                    // pixel at (x + 1, y + 1) = pixel (x + 1, y + 1) + quant error * 1 / 16

                    // let old_pixel = image.pixels[index]
                    let new_pixel = quantize(old_pixel)

                    image.set(x, y, new_pixel)

                    let quant_error = (old_pixel - new_pixel)

                    image.set(x + 1, y, sketch.round(togray(image.get(x + 1, y)) + quant_error * 7 / 16.0))
                    image.set(x - 1, y + 1, sketch.round(togray(image.get(x - 1, y + 1)) + quant_error * 3 / 16.0))
                    image.set(x, y + 1, sketch.round(togray(image.get(x, y + 1)) + quant_error * 5 / 16.0))
                    image.set(x + 1, y + 1, sketch.round(togray(image.get(x + 1, y + 1)) + quant_error * 1 / 16.0))

                    // let r = sketch.round(red / 255) * 255
                    // let g = sketch.round(green / 255) * 255
                    // let b = sketch.round(blue / 255) * 255

                    // image.pixels[index] = r
                    // image.pixels[index + 1] = g
                    // image.pixels[index + 2] = b
                    image.updatePixels()
                }
            }

            image.updatePixels()
            sketch.image(image, 0, 0)
        }
    }

    let myp5 = new p5(sketch1)
    let myp5_2 = new p5(sketch2)

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
})()