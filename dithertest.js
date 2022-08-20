function run() {
    let color_strs = [
        '#013082',
        '#BB2328',
        '#01B351',
        '#FE8F25',
        '#F5FF42',
        '#ECF3F6'
    ]

    // document.getElementById('controls').hidden = true
    // document.getElementById('canvas').hidden = true

    let canvases = document.getElementsByClassName('dither')

    for (let canvas of canvases) {
        w = canvas.width
        h = canvas.height

        let ctx = canvas.getContext('2d')

        let dataset = canvas.dataset

        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, w, h)

        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                if (dither_functions[dataset['ditherfunc']](i, j)) {
                    ctx.fillStyle = color_strs[dataset['color0']]
                    ctx.fillRect(i, j, 1, 1)
                } else {
                    ctx.fillStyle = color_strs[dataset['color1']]
                    ctx.fillRect(i, j, 1, 1)
                }
            }
        }
    }
}

run()