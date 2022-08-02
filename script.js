let color_strs = [
    '#bb0000', // red
    '#0000bb', // blue
    // '#009900', // green
    '#efea00', // yellow
    '#efefef', // white
    '#eea500', // orange
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

// the max width of the pixelated image
config.tmp_size = 50

// how many cubes side by side
config.cube_width = Math.floor(config.tmp_size / 3)

// how many cubes stacked
config.cube_height = 10

// how many pixels to draw each square
config.square_size = 40

// how many pixels is the border around square
config.border_size = 4

// how many pixels is the gap size between each cube
config.cube_gap_size = 2

// how many pixels is the gap size between each square
config.square_gap_size = 1

// what color to draw the border of the cubes
config.border_color = '#111'

// calculate the image width and height
config.width = config.cube_width * 3 * config.square_size
config.height = config.cube_height * 3 * config.square_size

config.should_draw_grids = true

config.selected_function = nearestPixelColor

config.img_url = ''


let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

let tmp_canvas = document.getElementById('tmp');

canvas.setAttribute('width', config.width)
canvas.setAttribute('height', config.height)

function pixelColorAt(pixel) {
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

function nearestPixelGray(pixel, colors) {
    // find nearest pixel
    let last_diff = 0
    let result = null

    for (let i = 0; i < colors.length; i++) {
        const color = colors[i];

        const color_avg = Math.floor((color.r + color.g + color.b) / 3)
        const pixel_avg = Math.floor((pixel.r + pixel.g + pixel.b) / 3)

        diff = Math.abs(color_avg - pixel_avg)

        if (result == null || diff < last_diff) {
            result = color
            last_diff = diff
        }
    }

    return result
}

function nearestPixelGray2(pixel, colors) {
    // find nearest pixel
    let last_diff = 0
    let result = null

    for (let i = 0; i < colors.length; i++) {
        const color = colors[i];

        const color_avg = Math.floor((color.r + color.g + color.b) / 3)
        const pixel_avg = Math.floor((pixel.r + pixel.g + pixel.b) / 3)

        diff = Math.abs(color_avg - pixel_avg)

        diff = diff * diff

        if (result == null || diff < last_diff) {
            result = color
            last_diff = diff
        }
    }

    return result
}

function nearestPixelColor(pixel, colors) {
    // find nearest pixel
    let last_diff = 0
    let result = null

    for (let i = 0; i < colors.length; i++) {
        const color = colors[i];

        d_r = Math.abs(color.r - pixel.r)
        d_g = Math.abs(color.g - pixel.g)
        d_b = Math.abs(color.b - pixel.b)

        diff = d_r + d_b + d_g

        if (result == null || diff < last_diff) {
            result = color
            last_diff = diff
        }
    }

    return result
}

function nearestPixelColor2(pixel, colors) {
    // find nearest pixel
    let last_diff = 0
    let result = null

    for (let i = 0; i < colors.length; i++) {
        const color = colors[i];

        d_r = Math.abs(color.r - pixel.r)
        d_g = Math.abs(color.g - pixel.g)
        d_b = Math.abs(color.b - pixel.b)

        diff = (d_r + d_b) ** 2
            + (d_r + d_g) ** 2
            + (d_g + d_b) ** 2

        if (result == null || diff < last_diff) {
            result = color
            last_diff = diff
        }
    }

    return result
}

function drawPreview(callback) {
    let img = new Image;

    let ctx = tmp_canvas.getContext('2d');

    img.onload = function () {
        let w = img.width
        let h = img.height

        let target_w = config.tmp_size
        let target_h = Math.floor(h * config.tmp_size / w)

        tmp_canvas.setAttribute('width', target_w)
        tmp_canvas.setAttribute('height', target_h)

        ctx.drawImage(img, 0, 0, target_w, target_h);

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

function drawRubiks() {

    // update height
    let ratio = tmp_canvas.getAttribute('width') / tmp_canvas.getAttribute('height')
    config.cube_height = Math.floor(config.cube_width / ratio)

    config.width = config.cube_width * 3 * config.square_size
    config.height = config.cube_height * 3 * config.square_size

    canvas.setAttribute('width', config.width)
    canvas.setAttribute('height', config.height)

    // rubik's
    for (let x = 0; x < config.width; x += config.square_size) {
        for (let y = 0; y < config.height; y += config.square_size) {
            let _x = Math.floor(x / config.square_size)
            let _y = Math.floor(y / config.square_size)

            if (_y * window.data.width + _x > window.data.width * window.data.height) {
                var random_color = color_strs[Math.floor(Math.random() * color_strs.length)]
            } else {
                let myfunc = config.selected_function;
                random_color = pixelColorAt(myfunc(pixelAt(window.data, _x, _y), config.colors))
            }

            ctx.fillStyle = random_color
            ctx.fillRect(x, y, x + config.square_size, y + config.square_size)
        }
    }

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


function update() {
    config.tmp_size = document.getElementById('tmp_size').value
    config.cube_width = Math.floor(config.tmp_size / 3)
    config.img_url = document.getElementById('img_url').value

    drawPreview(drawRubiks)

    let ratio = tmp_canvas.getAttribute('width') / tmp_canvas.getAttribute('height')
    config.cube_height = Math.floor(config.cube_width / ratio)

    document.getElementById('cube_count').innerHTML = `${config.cube_width} x ${config.cube_height} = ${config.cube_width * config.cube_height}`
}


let selected = 0
let functions = [
    nearestPixelGray,
    nearestPixelColor,
    nearestPixelGray2,
    nearestPixelColor2,
]

// first draw
update()

// hook event handlers for live update
document.getElementById('tmp_size').addEventListener('input', (e) => {
    document.getElementById('tmp_size_value').innerHTML = e.target.value
    // update()
})

document.getElementById('tmp_size').addEventListener('change', (e) => {
    update()
})

document.getElementById('update').addEventListener('click', (e) => {
    update()
})

document.getElementById('show_grid').addEventListener('click', (e) => {
    config.should_draw_grids = e.target.checked
    update()
})

document.getElementById('black_grid').addEventListener('change', (e) => {
    config.border_color = document.getElementById('black_grid').checked ? '#111' : '#eee'
    update()
})

document.getElementById('function').addEventListener('change', (e) => {
    config.selected_function = functions[parseInt(e.target.value) % functions.length]
    update()
})