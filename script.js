let color_strs = [
    // '#0000bb', // blue
    '#013082',
    // '#bb0000', // red
    '#BB2328',
    // '#009900', // green
    '#01B351',
    // '#eea500', // orange
    '#FE8F25',
    // '#efea00', // yellow
    '#F5FF42',
    // '#efefef', // white
    '#ECF3F6'
]

let config = {}

config.colors = []

for (let i = 0; i < color_strs.length; i++) {
    const element = color_strs[i];

    let r = parseInt(element.substring(1, 3), 16)
    let g = parseInt(element.substring(3, 5), 16)
    let b = parseInt(element.substring(5, 7), 16)

    config.colors.push({ r, g, b });
}

// DEFAULT VALUES
// the max width of the pixelated image
config.image_width = 9

// how many cubes side by side
config.cube_width = Math.floor(config.image_width / 3)

// how many cubes stacked
config.cube_height = 10

// how many pixels to draw each square
config.square_size = 10

// how many pixels is the border around square
config.border_size = 0

// how many pixels is the gap size between each cube
config.cube_gap_size = 1

// how many pixels is the gap size between each square
config.square_gap_size = 1

// what color to draw the border of the cubes
config.border_color = '#111'

// calculate the image width and height
config.width = config.cube_width * 3 * config.square_size
config.height = config.cube_height * 3 * config.square_size

config.cube_current_pos = { x: 0, y: 0 }

config.should_draw_grids = true

config.live_update = false

config.show_crosshair = false

config.sat = 10

config.selected_function = nearestPixelColor

config.img_url = ''

config.histogram_ranges = []

config.crop_x_start = 0
config.crop_x_end = 100
config.crop_y_start = 0
config.crop_y_end = 100

let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

let tmp_canvas = document.getElementById('tmp');

let histogram = document.getElementById('histogram');

canvas.setAttribute('width', config.width)
canvas.setAttribute('height', config.height)

const dither_functions = [
    (x, y) => (x + y) % 2 == 0,
    (x, y) => (x + y) % 4 == 0 && (x - y) % 4 == 0,
    (x, y) => (x - y) % 4 == 0,
    (x, y) => (x + y) % 4 == 0,
    (x, y) => (x) % 2 == 0,
    (x, y) => (y) % 2 == 0,
]

function getHistogram(image_data) {
    let grays = []

    for (let i = 0; i < 256; i++) {
        grays.push(0)
    }

    for (let y = 0; y < image_data.height; y++) {
        for (let x = 0; x < image_data.width; x++) {
            let pixel = pixelAt(image_data, y, x)
            let gray = getGray(pixel)

            if (gray < grays.length) {
                grays[gray]++
            }
        }
    }

    return grays
}

function drawHistogram(image_data, histogram) {
    let grays = getHistogram(image_data)
    let context = histogram.getContext('2d')

    let max = Math.max(...grays)

    histogram.setAttribute('height', max)
    histogram.setAttribute('width', 256)

    context.fillStyle = 'white'
    context.fillRect(0, 0, 256, max)

    // context.fillStyle = 'white' context.fillRect(0, 0, 256, max)
    context.lineWidth = 2
    context.strokeStyle = 'black'

    for (let i = 0; i < grays.length; i++) {
        drawLine(context, i, max, i, max - grays[i])
    }
}

function pixelToRGB(pixel) {
    let { r, g, b } = pixel

    return `rgb(${r}, ${g}, ${b})`
}

function pixelAt(data, x, y) {
    let at = (y * data.width * 4) + x * 4

    let r = data.data[at]
    let g = data.data[at + 1]
    let b = data.data[at + 2]

    return { r, g, b }
}

function getGray(pixel) {
    return Math.floor((pixel.r + pixel.g + pixel.b) / 3)
}

function nearestPixelGray(pixel, colors, return_values) {
    // find nearest pixel
    let last_diff = 0
    let result = null

    if (return_values == undefined) {
        return_values = colors
    }

    for (let i = 0; i < colors.length; i++) {
        const color = colors[i];

        const color_avg = getGray(color)
        const pixel_avg = getGray(pixel)

        diff = Math.abs(color_avg - pixel_avg)

        if (result == null || diff < last_diff) {
            result = i
            last_diff = diff
        }
    }

    return return_values[result]
}

function nearestPixelColor(pixel, colors, return_values) {
    // find nearest pixel
    let last_diff = 0
    let result = null

    if (return_values == undefined) {
        return_values = colors
    }

    for (let i = 0; i < colors.length; i++) {
        const color = colors[i];

        let d_r = Math.abs(color.r - pixel.r)
        let d_g = Math.abs(color.g - pixel.g)
        let d_b = Math.abs(color.b - pixel.b)

        let diff = d_r + d_b + d_g

        if (result == null || diff < last_diff) {
            result = i
            last_diff = diff
        }
    }

    return return_values[result]
}

function nearestPixelColor2(pixel, colors, return_values) {
    // find nearest pixel
    let last_diff = 0
    let result = null

    if (return_values == undefined) {
        return_values = colors
    }

    for (let i = 0; i < colors.length; i++) {
        const color = colors[i];

        let d_r = Math.abs(color.r - pixel.r)
        let d_g = Math.abs(color.g - pixel.g)
        let d_b = Math.abs(color.b - pixel.b)

        let diff = (d_r + d_b) ** 2
            + (d_r + d_g) ** 2
            + (d_g + d_b) ** 2

        if (result == null || diff < last_diff) {
            result = i
            last_diff = diff
        }
    }

    return return_values[result]
}

function histogramValues(pixel, colors, return_values) {
    let gray = getGray(pixel);

    let len = config.histogram_ranges.length;

    if (return_values == undefined) {
        return_values = colors
    }

    for (let i = 0; i < len; i++) {
        let from = config.histogram_ranges[i].from
        let to = config.histogram_ranges[i].to

        if (gray >= from && gray <= to) {
            if (colors[i] == undefined) {
                c('color[i] is undefined')
            } else {
                if (return_values) {
                    if (return_values !== undefined) {
                        return return_values[i]
                    } else {
                        return colors[i]
                    }
                } else {
                    c('white as a last option')
                    return '#ffffff'
                }
            }
        }
    }

    return colors[Math.floor(Math.random() * colors.length)]
}

function saturation(r, g, b) {
    return (r * 0.3333 + g * 0.3333 + b * 0.3333)
}

function rgb2hue(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var c = max - min;
    var hue;
    if (c == 0) {
        hue = 0;
    } else {
        switch (max) {
            case r:
                var segment = (g - b) / c;
                var shift = 0 / 60;       // R° / (360° / hex sides)
                if (segment < 0) {          // hue > 180, full rotation
                    shift = 360 / 60;         // R° / (360° / hex sides)
                }
                hue = segment + shift;
                break;
            case g:
                var segment = (b - r) / c;
                var shift = 120 / 60;     // G° / (360° / hex sides)
                hue = segment + shift;
                break;
            case b:
                var segment = (r - g) / c;
                var shift = 240 / 60;     // B° / (360° / hex sides)
                hue = segment + shift;
                break;
        }
    }
    return hue * 60; // hue is in [0,6], scale it up
}

function nearestPixelColor3(pixel, colors, return_values) {
    // find nearest pixel
    let last_diff = 0
    let result = null

    if (return_values == undefined) {
        return_values = colors
    }

    for (let i = 0; i < colors.length; i++) {
        const color = colors[i];

        let hue = rgb2hue(color.r, color.g, color.b)
        let sat = Math.floor(saturation(color.r, color.g, color.b))

        let h = rgb2hue(pixel.r, pixel.g, pixel.b)
        let s = Math.floor(saturation(pixel.r, pixel.g, pixel.b))

        // let diff = Math.abs((h + h * (s / 255)) - (hue + hue * (sat / 255)))
        // let diff = Math.abs((s + s * 2 * (h / 255)) - (sat + sat * 2 * (hue / 255)))
        // let diff = Math.abs((s / 255 * h * 100) - (sat / 255 * hue * 100))

        let diff = Math.abs((h / config.hue + s / config.sat) - (hue / config.hue + sat / config.sat))

        if (result == null || diff < last_diff) {
            result = i
            last_diff = diff
        }
    }

    return return_values[result]
}

function drawPreview(callback) {
    let img = new Image;
    let ctx = tmp_canvas.getContext('2d');

    img.onload = function () {
        let w = img.width
        let h = img.height

        let target_w = config.image_width
        let target_h = Math.floor(h * config.image_width / w)

        tmp_canvas.setAttribute('width', target_w)
        tmp_canvas.setAttribute('height', target_h)

        // todo: crop
        ctx.drawImage(img,
            -(config.crop_x_start / 100 * target_w),
            -(config.crop_y_start / 100 * target_h),
            target_w + ((100 - config.crop_x_end) / 100 * target_w) + (config.crop_x_start / 100 * target_w),
            target_h + ((100 - config.crop_y_end) / 100 * target_h) + (config.crop_y_start / 100 * target_h),
        );

        let image_data = ctx.getImageData(0, 0, target_w, target_h)
        window.data = image_data

        callback()
    };

    img.crossOrigin = "Anonymous"
    img.src = config.img_url
}

function drawLine(ctx, x, y, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}

function calc_color(_x, _y) {

    let thecolor;

    if (_y * window.data.width + _x > window.data.width * window.data.height) {
        thecolor = color_strs[Math.floor(Math.random() * color_strs.length)]
        c("random color")
    } else {
        let myfunc = config.selected_function;
        let thepixel = pixelAt(window.data, _x, _y)
        let color_obj = myfunc(thepixel, config.colors)
        let hex_color = myfunc(thepixel, config.colors, color_strs)
        thecolor = pixelToRGB(color_obj)

        c('the hex color', hex_color + JSON.stringify(thepixel))

        let should_apply = config.dithering_toggles[hex_color]

        if (config.dithering && should_apply) {
            let themorepixel = {
                r: Math.min(thepixel.r * (1 + config.dithering_percents[0] / 100), 255),
                g: Math.min(thepixel.g * (1 + config.dithering_percents[0] / 100), 255),
                b: Math.min(thepixel.b * (1 + config.dithering_percents[0] / 100), 255)
            }

            let thelesspixel = {
                r: Math.min(thepixel.r * (1 - config.dithering_percents[1] / 100), 255),
                g: Math.min(thepixel.g * (1 - config.dithering_percents[1] / 100), 255),
                b: Math.min(thepixel.b * (1 - config.dithering_percents[1] / 100), 255)
            }

            let themoremorepixel = {
                r: Math.min(thepixel.r * (1 + config.dithering_percents[2] / 100), 255),
                g: Math.min(thepixel.g * (1 + config.dithering_percents[2] / 100), 255),
                b: Math.min(thepixel.b * (1 + config.dithering_percents[2] / 100), 255)
            }

            let thelesslesspixel = {
                r: Math.min(thepixel.r * (1 - config.dithering_percents[3] / 100), 255),
                g: Math.min(thepixel.g * (1 - config.dithering_percents[3] / 100), 255),
                b: Math.min(thepixel.b * (1 - config.dithering_percents[3] / 100), 255)
            }

            let thecolor_less = pixelToRGB(myfunc(thelesspixel, config.colors))
            let thecolor_more = pixelToRGB(myfunc(themorepixel, config.colors))

            let thecolor_lessless = pixelToRGB(myfunc(thelesslesspixel, config.colors))
            let thecolor_moremore = pixelToRGB(myfunc(themoremorepixel, config.colors))

            if (JSON.stringify(thecolor) != JSON.stringify(thecolor_less)) {
                if (dither_functions[0](_x, _y)) {
                    thecolor = thecolor_less
                }
            } else if (JSON.stringify(thecolor) != JSON.stringify(thecolor_more)) {
                if (dither_functions[0](_x, _y)) {
                    thecolor = thecolor_more
                }
            } else if (JSON.stringify(thecolor) != JSON.stringify(thecolor_lessless)) {
                if (dither_functions[1](_x, _y)) {
                    thecolor = thecolor_lessless
                }
            } else if (JSON.stringify(thecolor) != JSON.stringify(thecolor_moremore)) {
                if (dither_functions[1](_x, _y)) {
                    thecolor = thecolor_moremore
                }
            }
        }
    }

    return thecolor
}

function drawRubiks() {

    // update height
    let ratio = tmp_canvas.getAttribute('width') / tmp_canvas.getAttribute('height')
    config.cube_height = Math.floor(config.cube_width / ratio)

    config.width = config.cube_width * 3 * config.square_size
    config.height = config.cube_height * 3 * config.square_size

    // create pixel data
    window.pixel_data = []

    canvas.setAttribute('width', config.width)
    canvas.setAttribute('height', config.height)

    for (let x = 0; x < config.cube_width * 3; x++) {
        window.pixel_data.push([])
        for (let y = 0; y < config.cube_height * 3; y++) {
            let thecolor = calc_color(x, y)
            window.pixel_data[x].push(thecolor)

            ctx.fillStyle = thecolor
            ctx.fillRect(x * config.square_size,
                y * config.square_size,
                x * config.square_size + config.square_size,
                y * config.square_size + config.square_size)
        }
    }

    drawCubes()

    if (config.should_draw_grids)
        drawGrids(ctx, config.cube_width, config.cube_height, config.square_size, config.cube_gap_size, config.width, config.height)

}

function drawGrids(ctx, cube_width, cube_height, square_size, cube_gap_size, width, height) {

    ctx.lineWidth = config.border_size
    ctx.strokeStyle = config.border_color

    // draw vertical lines
    for (let x = 0; x <= cube_width * 3 * square_size; x += square_size) {
        drawLine(ctx, x, 0, x, height)
    }

    // draw horizontal lines
    for (let y = 0; y <= cube_height * 3 * square_size; y += square_size) {
        drawLine(ctx, 0, y, width, y)
    }

    ctx.lineWidth = cube_gap_size
    ctx.strokeStyle = '#111'
    // draw vertical lines
    for (let x = 0; x <= cube_width * 3 * square_size; x += square_size * 3) {
        drawLine(ctx, x, 0, x, height)
    }

    // draw horizontal lines
    for (let y = 0; y <= cube_height * 3 * square_size; y += square_size * 3) {
        drawLine(ctx, 0, y, width, y)
    }

    ctx.lineWidth = config.square_gap_size
    ctx.strokeStyle = '#111'
    // draw vertical lines
    for (let x = 0; x <= cube_width * 3 * square_size; x += square_size) {
        drawLine(ctx, x, 0, x, height)
    }

    // draw horizontal lines
    for (let y = 0; y <= cube_height * 3 * square_size; y += square_size) {
        drawLine(ctx, 0, y, width, y)
    }
}

// console log
function c(...args) {
    console.log(...args)
}

function update() {
    config.image_width = parseInt(document.getElementById('tmp_size').value)
    config.cube_width = Math.floor(config.image_width / 3)
    config.img_url = document.getElementById('img_url').value
    config.selected_function = functions[parseInt(document.getElementById('function').value) % functions.length];
    config.border_color = document.getElementById('black_grid').checked
        ? '#1f1f1f' : '#efefef'
    config.should_draw_grids = document.getElementById('show_grid').checked
    config.sat = parseFloat(document.getElementById('config_sat').value)
    config.hue = parseFloat(document.getElementById('config_hue').value)
    config.live_update = document.getElementById('live_update').checked
    config.show_crosshair = document.getElementById('show_crosshair').checked
    config.dithering = document.getElementById('dithering').checked

    config.dithering_percents = []
    config.dithering_percents.push(parseInt(document.getElementById('config_dithering_1').value))
    config.dithering_percents.push(parseInt(document.getElementById('config_dithering_2').value))
    config.dithering_percents.push(parseInt(document.getElementById('config_dithering_3').value))
    config.dithering_percents.push(parseInt(document.getElementById('config_dithering_4').value))

    config.dithering_toggles = {}

    config.crop_x_start = parseInt(document.getElementById('crop_x_start').value)
    config.crop_x_end = parseInt(document.getElementById('crop_x_end').value)
    config.crop_y_start = parseInt(document.getElementById('crop_y_start').value)
    config.crop_y_end = parseInt(document.getElementById('crop_y_end').value)

    for (let color of color_strs) {
        config.dithering_toggles[color] = document.getElementById(color).checked
    }

    if (config.selected_function == histogramValues) {
        toggleSliderVisibility(true)
    } else {
        toggleSliderVisibility(false)
    }

    update_histogram_ranges()

    const _update = function () {
        let ratio = tmp_canvas.getAttribute('width') / tmp_canvas.getAttribute('height')
        config.cube_height = Math.floor(config.cube_width / ratio)

        document.getElementById('cube_count').innerHTML = `${config.cube_width} x ${config.cube_height} = ${config.cube_width * config.cube_height}`
    }

    const _callback = function () {
        drawRubiks()
        _update()

        if (config.show_crosshair) drawCursor()
        drawCubes()
        drawHistogram(window.data, histogram)

        if (run_channels != undefined) {
            run_channels()
        }
    }

    drawPreview(_callback)
}

function drawCursor() {
    let pos = config.cube_current_pos
    let size = config.square_size

    let _x = pos.x * size * 3
    let _y = pos.y * size * 3

    ctx.lineWidth = 5
    ctx.strokeStyle = 'red'
    ctx.beginPath()
    ctx.rect(_x, _y, (size * 3), (size * 3))
    ctx.stroke()

    drawLine(ctx, 0, 0, _x, _y)
    drawLine(ctx, 0, config.height, _x, _y + (size * 3))
    drawLine(ctx, config.width, 0, (size * 3) + _x, _y)
    drawLine(ctx, config.width, config.height, (size * 3) + _x, _y + (size * 3))

    ctx.lineWidth = 2
    ctx.strokeStyle = 'white'
    ctx.beginPath()
    ctx.rect(_x, _y, (size * 3), (size * 3))
    ctx.stroke()

    drawLine(ctx, 0, 0, _x, _y)
    drawLine(ctx, 0, config.height, _x, _y + (size * 3))
    drawLine(ctx, config.width, 0, (size * 3) + _x, _y)
    drawLine(ctx, config.width, config.height, (size * 3) + _x, _y + (size * 3))
}

function update_histogram_ranges() {
    let elements = document.getElementsByClassName('histogram_slider');

    config.histogram_ranges = []

    for (let i = 0; i < elements.length - 1; i++) {
        let value = elements[i].value
        let value2 = elements[i + 1].value

        config.histogram_ranges.push({ from: value, to: value2 })
    }
}

function buildSliders(colors) {

    let placeholder = document.getElementById('histogram_placeholder')

    if (placeholder) {
        for (let i = 0; i < colors.length + 1; i++) {

            let input = document.createElement('input')
            let value = 0

            value = Math.floor(i * 256 / colors.length)

            input.setAttribute('type', 'range')
            input.setAttribute('min', '0')
            input.setAttribute('max', '255')
            input.setAttribute('value', value)
            input.setAttribute('step', '1')
            input.className = 'histogram_slider'
            placeholder.appendChild(input)

            let box = document.createElement('div')
            box.style = 'height: 20px; width: 40px; margin: 0 auto; background-color: ' + colors[i] + ';'

            placeholder.appendChild(box)
        }

    }
}

function buildDitheringToggleCheckboxes(colors) {
    let placeholder = document.getElementById('dithering_toggles_placeholder')

    if (placeholder) {
        for (let i = 0; i < colors.length; i++) {
            let input = document.createElement('input')

            input.type = 'checkbox'
            input.id = colors[i]
            input.className = 'dithering_toggle_checkbox'

            let label = document.createElement('label')
            label.htmlFor = colors[i]
            label.innerText = '__'
            label.style.backgroundColor = colors[i]

            placeholder.appendChild(input)
            placeholder.appendChild(label)
        }
    }
}

function toggleSliderVisibility(show) {
    let placeholder = document.getElementById('histogram_placeholder')

    placeholder.style.display = show ? 'flex' : 'none'
}

function drawCubes() {
    let cubes = document.getElementsByClassName('cube');

    for (let cube of cubes) {
        let index = parseInt(cube.dataset['index']) * 3

        // c('index', index)

        let size = 15

        if (cube) {
            cube.setAttribute('width', size * 3)
            cube.setAttribute('height', size * 3)

            let cube_context = cube.getContext('2d')

            if (config.cube_current_pos && cube) {
                let pos = config.cube_current_pos

                for (let j = 0; j < 3; j++) {
                    for (let i = 0; i < 3; i++) {

                        if (pos.x * 3 + i + index < window.pixel_data.length) {
                            let square_color = window.pixel_data[pos.x * 3 + i + index][pos.y * 3 + j]

                            cube_context.fillStyle = square_color
                            cube_context.fillRect((i) * size, (j) * size, (i + 1) * size, (j + 1) * size)
                        } else {
                            cube_context.fillStyle = 'black'
                        }

                        cube_context.fillRect((i) * size, (j) * size, (i + 1) * size, (j + 1) * size)
                    }
                }
            }
        }
    }

}


let selected = 0
let functions = [
    nearestPixelGray,
    nearestPixelColor,
    nearestPixelColor2,
    nearestPixelColor3,
    histogramValues,
]

// histogram sliders
buildSliders(color_strs)

// dithering checkboxes
buildDitheringToggleCheckboxes(color_strs)

// first draw
update()

// hook event handlers for live update
document.getElementById('tmp_size').addEventListener('input', (e) => {
    document.getElementById('tmp_size_value').innerHTML = e.target.value

    if (config.live_update) {
        update()
    }
})

document.getElementById('tmp_size').addEventListener('change', (e) => {
    update()
})

document.getElementById('show_grid').addEventListener('change', (e) => {
    update()
})

document.getElementById('black_grid').addEventListener('change', (e) => {
    update()
})

document.getElementById('live_update').addEventListener('change', (e) => {
    config.live_update = document.getElementById('live_update')
})

document.getElementById('function').addEventListener('change', (e) => {
    update()
})

document.getElementById('config_sat').addEventListener('input', (e) => {
    update()
})

document.getElementById('config_hue').addEventListener('input', (e) => {
    update()
})

document.getElementById('show_crosshair').addEventListener('change', (e) => {
    update()
})

document.getElementById('dithering').addEventListener('change', (e) => {
    update()
})

document.getElementById('show_controls').addEventListener('change', (e) => {
    if (document.getElementById('show_controls').checked) {
        document.getElementById('controls').style.display = 'block'
    } else {
        document.getElementById('controls').style.display = 'none'
    }
})

document.addEventListener('input', (e) => {
    if (e.target.classList.contains('histogram_slider')) {
        update_histogram_ranges()
        update()
    } else if (e.target.classList.contains('dithering_slider')) {
        update()
    } else if (e.target.classList.contains('dithering_toggle_checkbox')) {
        update()
    } else if (e.target.classList.contains('crop_slider')) {
        update()
    }
})

document.addEventListener('keydown', (e) => {
    if (e.target == document.getElementsByTagName('body')[0]) {
        if (e.key == 'w') {
            config.cube_current_pos.y = Math.max(0, config.cube_current_pos.y - 1)
            update()
        } else if (e.key == 'a') {
            config.cube_current_pos.x = Math.max(0, config.cube_current_pos.x - 1)
            update()
        } else if (e.key == 's') {
            config.cube_current_pos.y = Math.min(config.cube_height - 1, config.cube_current_pos.y + 1)
            update()
        } else if (e.key == 'd') {
            config.cube_current_pos.x = Math.min(config.cube_width - 1, config.cube_current_pos.x + 1)
            update()
        }
    }
})