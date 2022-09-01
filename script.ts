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

type Pixel = {
    r: number,
    b: number,
    g: number
}

type Position = {
    x: number,
    y: number
}

type HistogramRange = {
    from: number,
    to: number
}

interface Dictionary<T> {
    [Key: string]: T;
}

class Config {
    colors: Pixel[] = [];

    // the max width of the pixelated image
    image_width: number = 9;

    // how many cubes side by side
    cube_width: number = Math.floor(this.image_width / 3);

    // how many cubes stacked
    cube_height: number = 10;

    // how many pixels to draw each square
    square_size: number = 10;

    // how many pixels is the border around square
    border_size: number = 0;

    // how many pixels is the gap size between each cube
    cube_gap_size: number = 1;

    // how many pixels is the gap size between each square
    square_gap_size: number = 1;

    // what color to draw the border of the cubes
    border_color: string = '#111';

    // calculate the image width and height
    width: number = this.cube_width * 3 * this.square_size;
    height: number = this.cube_height * 3 * this.square_size;

    // current position of which cube to show
    cube_current_pos: Position = { x: 0, y: 0 };

    should_draw_grids: boolean = true;

    // live update the canvas when image width is sliding
    live_update: boolean = false;

    // draw a prominent crosshair on cube_current_pos
    show_crosshair: boolean = false;

    // saturation
    sat: number = 10;

    // hue
    hue: number = 10;

    selected_function: Function = nearestPixelColor;

    img_url: string = '';

    histogram_ranges: HistogramRange[] = [];

    crop_x_start: number = 0;
    crop_x_end: number = 100;
    crop_y_start: number = 0;
    crop_y_end: number = 100;

    dithering: boolean = false
    dithering_fs: boolean = false
    dithering_toggles: Dictionary<boolean> = {}
    dithering_percents: number[] = []

    constructor() {
        for (let i = 0; i < color_strs.length; i++) {
            const element = color_strs[i];

            let r = parseInt(element.substring(1, 3), 16)
            let g = parseInt(element.substring(3, 5), 16)
            let b = parseInt(element.substring(5, 7), 16)

            this.colors.push({ r, g, b });
        }
    }
}

let config: Config = new Config()
let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas')

let ctx: CanvasRenderingContext2D
let tmp_canvas: HTMLCanvasElement
let histogram: HTMLCanvasElement

let global_image_data: ImageData
let window_pixel_data: string[][]

// for floyd steinberg dithering algo
let quant_error_array: Pixel[][]

let selected: number = 0
const functions = [
    nearestPixelGray,
    nearestPixelColor,
    nearestPixelColor2,
    nearestPixelColor3,
    histogramValues,
]

if (canvas) {
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    tmp_canvas = document.getElementById('tmp') as HTMLCanvasElement
    histogram = document.getElementById('histogram') as HTMLCanvasElement

    canvas.setAttribute('width', config.width.toString())
    canvas.setAttribute('height', config.height.toString())

    // histogram sliders
    buildSliders(color_strs)

    // dithering checkboxes
    buildDitheringToggleCheckboxes(color_strs)

    // first draw
    update()
}

const dither_functions = [
    (x: number, y: number) => (x + y) % 2 == 0,
    (x: number, y: number) => (x + y) % 4 == 0 && (x - y) % 4 == 0,
    (x: number, y: number) => (x - y) % 4 == 0,
    (x: number, y: number) => (x + y) % 4 == 0,
    (x: number, y: number) => (x) % 2 == 0,
    (x: number, y: number) => (y) % 2 == 0,
]

function getHistogram(image_data: ImageData) {
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

function drawHistogram(image_data: ImageData, histogram: HTMLCanvasElement) {
    let grays = getHistogram(image_data)
    let context = histogram.getContext('2d') as CanvasRenderingContext2D

    let max = Math.max(...grays)

    histogram.setAttribute('height', max.toString())
    histogram.setAttribute('width', '256')

    context.fillStyle = 'white'
    context.fillRect(0, 0, 256, max)

    // context.fillStyle = 'white' context.fillRect(0, 0, 256, max)
    context.lineWidth = 2
    context.strokeStyle = 'black'

    for (let i = 0; i < grays.length; i++) {
        drawLine(context, i, max, i, max - grays[i])
    }
}

function pixelToRGB(pixel: Pixel) {
    let { r, g, b } = pixel

    return `rgb(${r}, ${g}, ${b})`
}

function pixelAt(data: ImageData, x: number, y: number) {
    let at = (y * data.width * 4) + x * 4

    let r = data.data[at]
    let g = data.data[at + 1]
    let b = data.data[at + 2]

    return { r, g, b }
}

function getGray(pixel: Pixel) {
    return Math.floor((pixel.r + pixel.g + pixel.b) / 3)
}

function nearestPixelGray(pixel: Pixel, colors: Pixel[], return_values: (string | Pixel)[]) {
    // find nearest pixel
    let last_diff = 0
    let result = -1

    if (return_values == undefined) {
        return_values = colors
    }

    for (let i = 0; i < colors.length; i++) {
        const color = colors[i];

        const color_avg = getGray(color)
        const pixel_avg = getGray(pixel)

        let diff = Math.abs(color_avg - pixel_avg)

        if (result == -1 || diff < last_diff) {
            result = i
            last_diff = diff
        }
    }

    return return_values[result]
}

function nearestPixelColor(pixel: Pixel, colors: Pixel[], return_values: (string | Pixel)[]) {
    // find nearest pixel
    let last_diff = 0
    let result = -1

    if (return_values == undefined) {
        return_values = colors
    }

    for (let i = 0; i < colors.length; i++) {
        const color = colors[i];

        let d_r = Math.abs(color.r - pixel.r)
        let d_g = Math.abs(color.g - pixel.g)
        let d_b = Math.abs(color.b - pixel.b)

        let diff = d_r + d_b + d_g

        if (result == -1 || diff < last_diff) {
            result = i
            last_diff = diff
        }
    }

    return return_values[result]
}

function nearestPixelColor2(pixel: Pixel, colors: Pixel[], return_values: (string | Pixel)[]) {
    // find nearest pixel
    let last_diff = 0
    let result = -1

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

        if (result == -1 || diff < last_diff) {
            result = i
            last_diff = diff
        }
    }

    return return_values[result]
}

function histogramValues(pixel: Pixel, colors: Pixel[], return_values: (string | Pixel)[]) {
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

function saturation(pixel: Pixel) {
    return (pixel.r * 0.3333 + pixel.g * 0.3333 + pixel.b * 0.3333)
}

function rgb2hue(pixel: Pixel) {
    let { r, g, b } = pixel

    r /= 255;
    g /= 255;
    b /= 255;

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var c = max - min;
    var hue = 0;

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

function nearestPixelColor3(pixel: Pixel, colors: Pixel[], return_values: (string | Pixel)[]) {
    // find nearest pixel
    let last_diff = 0
    let result = -1

    if (return_values == undefined) {
        return_values = colors
    }

    for (let i = 0; i < colors.length; i++) {
        const color = colors[i];

        let hue = rgb2hue(color)
        let sat = Math.floor(saturation(color))

        let h = rgb2hue(pixel)
        let s = Math.floor(saturation(pixel))

        // let diff = Math.abs((h + h * (s / 255)) - (hue + hue * (sat / 255)))
        // let diff = Math.abs((s + s * 2 * (h / 255)) - (sat + sat * 2 * (hue / 255)))
        // let diff = Math.abs((s / 255 * h * 100) - (sat / 255 * hue * 100))

        let diff = Math.abs((h / config.hue + s / config.sat) - (hue / config.hue + sat / config.sat))

        if (result == -1 || diff < last_diff) {
            result = i
            last_diff = diff
        }
    }

    return return_values[result]
}

function drawPreview(callback: Function) {
    let img = new Image;
    let ctx = tmp_canvas.getContext('2d') as CanvasRenderingContext2D

    img.onload = function () {
        let w = img.width
        let h = img.height

        let target_w = config.image_width
        let target_h = Math.floor(h * config.image_width / w)

        tmp_canvas.setAttribute('width', target_w.toString())
        tmp_canvas.setAttribute('height', target_h.toString())

        // todo: crop
        ctx.drawImage(img,
            -(config.crop_x_start / 100 * target_w),
            -(config.crop_y_start / 100 * target_h),
            target_w + ((100 - config.crop_x_end) / 100 * target_w) + (config.crop_x_start / 100 * target_w),
            target_h + ((100 - config.crop_y_end) / 100 * target_h) + (config.crop_y_start / 100 * target_h),
        );

        let image_data = ctx.getImageData(0, 0, target_w, target_h)
        global_image_data = image_data

        callback()
    };

    img.crossOrigin = "Anonymous"
    img.src = config.img_url
}

function drawLine(ctx: CanvasRenderingContext2D, x: number, y: number, x1: number, y1: number) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}

function pixelDiff(lhs: Pixel, rhs: Pixel): Pixel {
    return {
        r: lhs.r - rhs.r,
        g: lhs.g - rhs.g,
        b: lhs.b - rhs.b
    }
}

function pixelAdd(lhs: Pixel, rhs: Pixel): Pixel {
    return {
        r: lhs.r + rhs.r,
        g: lhs.g + rhs.g,
        b: lhs.b + rhs.b
    }
}

function pixelMultiply(lhs: Pixel, value: number): Pixel {
    return {
        r: lhs.r * value,
        g: lhs.g * value,
        b: lhs.b * value
    }
}

function calc_color(_x: number, _y: number) {

    let thecolor;

    if (_y * global_image_data.width + _x > global_image_data.width * global_image_data.height) {
        thecolor = color_strs[Math.floor(Math.random() * color_strs.length)]
        c("random color")
    } else {
        let myfunc = config.selected_function;
        let thepixel = pixelAt(global_image_data, _x, _y)
        let color_obj = myfunc(thepixel, config.colors)
        thecolor = pixelToRGB(color_obj)

        let hex_color = myfunc(thepixel, config.colors, color_strs)

        if (config.dithering) {
            if (config.dithering_fs) {

                if (quant_error_array == undefined || (_x == 0 && _y == 0)) {
                    quant_error_array = []
                    for (let x = 0; x < config.cube_width * 3; x++) {
                        quant_error_array.push([])
                        for (let y = 0; y < config.cube_height * 3; y++) {
                            quant_error_array[x].push({ r: 0, g: 0, b: 0 })
                        }
                    }

                    console.log('built the errorarray')
                }

                let old_pixel = pixelAt(global_image_data, _x, _y)

                // todo: apply quant error here to old_pixel // done

                old_pixel = pixelAdd(old_pixel, quant_error_array[_x][_y])

                let new_pixel = myfunc(old_pixel, config.colors)

                thecolor = pixelToRGB(new_pixel)

                let quant_error = pixelDiff(old_pixel, new_pixel)

                if (_x < quant_error_array.length - 1) {
                    quant_error_array[_x + 1][_y] = pixelAdd(quant_error_array[_x + 1][_y], pixelMultiply(quant_error, 7 / 16))
                }

                if (_y < quant_error_array[_x].length - 1) {
                    if (_x > 0) {
                        quant_error_array[_x - 1][_y + 1] = pixelAdd(quant_error_array[_x - 1][_y + 1], pixelMultiply(quant_error, 3 / 16))
                    }

                    quant_error_array[_x][_y + 1] = pixelAdd(quant_error_array[_x][_y + 1], pixelMultiply(quant_error, 5 / 16))

                    if (_x < quant_error_array.length - 1) {
                        quant_error_array[_x + 1][_y + 1] = pixelAdd(quant_error_array[_x + 1][_y + 1], pixelMultiply(quant_error, 1 / 16))
                    }
                }

                // pseudo code for dithering
                // old pixel = pixel at (x,y)
                // new pixel  = find closest color of old pixel
                // quant error = old pixel - new pixel
                // pixel at (x + 1, y    ) = pixel (x + 1, y    ) + quant error * 7 / 16
                // pixel at (x - 1, y + 1) = pixel (x - 1, y + 1) + quant error * 3 / 16
                // pixel at (x    , y + 1) = pixel (x    , y + 1) + quant error * 5 / 16
                // pixel at (x + 1, y + 1) = pixel (x + 1, y + 1) + quant error * 1 / 16

            } else {
                let should_apply_my_dithering = config.dithering_toggles[hex_color]

                if (should_apply_my_dithering) {
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
        }
    }

    return thecolor
}

function drawRubiks() {

    // update height
    let ratio = parseInt(tmp_canvas.getAttribute('width') ?? "") / parseInt(tmp_canvas.getAttribute('height') ?? "")

    if (ratio != 0) {
        config.cube_height = Math.floor(config.cube_width / ratio)
    }

    config.width = config.cube_width * 3 * config.square_size
    config.height = config.cube_height * 3 * config.square_size

    // create pixel data
    window_pixel_data = []

    canvas.setAttribute('width', config.width.toString())
    canvas.setAttribute('height', config.height.toString())

    for (let x = 0; x < config.cube_width * 3; x++) {
        window_pixel_data.push([])
        for (let y = 0; y < config.cube_height * 3; y++) {
            let thecolor = calc_color(x, y)
            window_pixel_data[x].push(thecolor)

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

function drawGrids(ctx: CanvasRenderingContext2D,
    cube_width: number,
    cube_height: number,
    square_size: number,
    cube_gap_size: number,
    width: number,
    height: number) {

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
function c(...args: any[]) {
    console.log(...args)
}

function intFromEl(el_name: string) {
    let el = document.getElementById(el_name) as HTMLInputElement
    return parseInt(el?.value)
}

function strFromEl(el_name: string) {
    let el = document.getElementById(el_name) as HTMLInputElement
    return el?.value
}

function boolFromCheckbox(el_name: string) {
    let el = document.getElementById(el_name) as HTMLInputElement
    return el?.checked
}

function floatFromEl(el_name: string) {
    let el = document.getElementById(el_name) as HTMLInputElement
    return parseFloat(el?.value)
}

function update() {
    config.image_width = intFromEl('tmp_size')
    config.cube_width = Math.floor(config.image_width / 3)
    config.img_url = strFromEl('img_url')
    config.selected_function = functions[intFromEl('function') % functions.length];
    config.border_color = boolFromCheckbox('black_grid') ? '#1f1f1f' : '#efefef'
    config.should_draw_grids = boolFromCheckbox('show_grid')
    config.sat = floatFromEl('config_sat')
    config.hue = floatFromEl('config_hue')
    config.live_update = boolFromCheckbox('live_update')
    config.show_crosshair = boolFromCheckbox('show_crosshair')
    config.dithering = boolFromCheckbox('dithering')
    config.dithering_fs = boolFromCheckbox('dithering_floyd_steinberg')

    config.dithering_percents = []

    config.dithering_percents.push(parseInt((<HTMLInputElement>document.getElementById('config_dithering_1')).value))
    config.dithering_percents.push(parseInt((<HTMLInputElement>document.getElementById('config_dithering_2')).value))
    config.dithering_percents.push(parseInt((<HTMLInputElement>document.getElementById('config_dithering_3')).value))
    config.dithering_percents.push(parseInt((<HTMLInputElement>document.getElementById('config_dithering_4')).value))

    config.dithering_toggles = {}

    config.crop_x_start = parseInt((<HTMLInputElement>document.getElementById('crop_x_start')).value)
    config.crop_x_end = parseInt((<HTMLInputElement>document.getElementById('crop_x_end')).value)
    config.crop_y_start = parseInt((<HTMLInputElement>document.getElementById('crop_y_start')).value)
    config.crop_y_end = parseInt((<HTMLInputElement>document.getElementById('crop_y_end')).value)

    for (let color of color_strs) {
        config.dithering_toggles[color] = (<HTMLInputElement>document.getElementById(color)).checked
    }

    if (config.selected_function == histogramValues) {
        toggleSliderVisibility(true)
    } else {
        toggleSliderVisibility(false)
    }

    update_histogram_ranges()

    const _update = function () {
        let ratio = parseInt(tmp_canvas.getAttribute('width') ?? "") / parseInt(tmp_canvas.getAttribute('height') ?? "")

        if (ratio != 0) {
            config.cube_height = Math.floor(config.cube_width / ratio)
        }

        (<HTMLElement>document.getElementById('cube_count')).innerHTML = `${config.cube_width} x ${config.cube_height} = ${config.cube_width * config.cube_height}`
    }

    const _callback = function () {
        drawRubiks()
        _update()

        if (config.show_crosshair) drawCursor()
        drawCubes()
        drawHistogram(global_image_data, histogram)

        //Todo: check run_channels
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
        let value = parseInt((<HTMLInputElement>elements[i]).value)
        let value2 = parseInt((<HTMLInputElement>elements[i + 1]).value)

        config.histogram_ranges.push({ from: value, to: value2 })
    }
}

function buildSliders(colors: string[]) {

    let placeholder = document.getElementById('histogram_placeholder')

    if (placeholder) {
        for (let i = 0; i < colors.length + 1; i++) {

            let input = document.createElement('input')
            let value = 0

            value = Math.floor(i * 256 / colors.length)

            input.setAttribute('type', 'range')
            input.setAttribute('min', '0')
            input.setAttribute('max', '255')
            input.setAttribute('value', value.toString())
            input.setAttribute('step', '1')
            input.className = 'histogram_slider'
            placeholder.appendChild(input)

            let box = document.createElement('div')
            box.setAttribute('style', 'height: 20px; width: 40px; margin: 0 auto; background-color: ' + colors[i] + ';')

            placeholder.appendChild(box)
        }

    }
}

function buildDitheringToggleCheckboxes(colors: string[]) {
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

function toggleSliderVisibility(show: boolean) {
    let placeholder = document.getElementById('histogram_placeholder') as HTMLDivElement

    placeholder.style.display = show ? 'flex' : 'none'
}

function drawCubes() {
    let cubes = document.getElementsByClassName('cube') as HTMLCollectionOf<HTMLCanvasElement>

    for (let cube of cubes) {
        let index = parseInt(cube.dataset['index'] ?? "") * 3

        // c('index', index)

        let size = 15

        if (cube) {
            cube.setAttribute('width', (size * 3).toString())
            cube.setAttribute('height', (size * 3).toString())

            let cube_context = cube.getContext('2d') as CanvasRenderingContext2D

            if (config.cube_current_pos && cube) {
                let pos = config.cube_current_pos

                for (let j = 0; j < 3; j++) {
                    for (let i = 0; i < 3; i++) {

                        if (pos.x * 3 + i + index < window_pixel_data.length) {
                            let square_color = window_pixel_data[pos.x * 3 + i + index][pos.y * 3 + j]

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

function hook(el_name: string, event_name: string, callback: (this: HTMLElement, e: Event) => any): void {
    let el = document.getElementById(el_name) as HTMLInputElement

    el.addEventListener(event_name, callback)
}

hook('tmp_size', 'input', (e) => {
    let el = document.getElementById('tmp_size_value') as HTMLSpanElement;
    el.innerHTML = (e.target as HTMLInputElement).value;

    if (config.live_update) {
        update();
    }
})

hook('tmp_size', 'change', () => update())
hook('show_grid', 'change', () => update())
hook('black_grid', 'change', () => update())
hook('live_update', 'change', () => { config.live_update = boolFromCheckbox('live_update') })
hook('function', 'change', () => { update() })
hook('config_sat', 'input', () => { update() })
hook('config_hue', 'input', () => { update() })
hook('show_crosshair', 'change', () => { update() })
hook('dithering', 'change', () => { update() })
hook('dithering_floyd_steinberg', 'change', () => { update() })
hook('show_controls', 'change', () => {
    if ((document.getElementById('show_controls') as HTMLInputElement).checked) {
        (document.getElementById('controls') as HTMLElement).style.display = 'block'
    } else {
        (document.getElementById('controls') as HTMLElement).style.display = 'none'
    }
})

document.addEventListener('input', (e) => {
    if ((e.target as HTMLElement).classList.contains('histogram_slider')) {
        update_histogram_ranges()
        update()
    } else if ((e.target as HTMLElement).classList.contains('dithering_slider')) {
        update()
    } else if ((e.target as HTMLElement).classList.contains('dithering_toggle_checkbox')) {
        update()
    } else if ((e.target as HTMLElement).classList.contains('crop_slider')) {
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