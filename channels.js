function run_channels() {
    let red = document.getElementById('red')
    let green = document.getElementById('green')
    let blue = document.getElementById('blue')

    let _red = red.getContext('2d')
    let _green = green.getContext('2d')
    let _blue = blue.getContext('2d')

    if (red && green && blue) {
        if (window.data) {
            let image_data = window.data

            red.setAttribute('width', image_data.width)
            red.setAttribute('height', image_data.height)

            green.setAttribute('width', image_data.width)
            green.setAttribute('height', image_data.height)

            blue.setAttribute('width', image_data.width)
            blue.setAttribute('height', image_data.height)

            for (let x = 0; x < image_data.width; x++) {
                for (let y = 0; y < image_data.height; y++) {
                    let pixel = pixelAt(image_data, x, y)

                    let {r, g, b} = pixel

                    _red.fillStyle = `rgb(${r}, ${0}, ${0})`
                    _red.fillRect(x, y, 1, 1)

                    _green.fillStyle = `rgb(${0}, ${g}, ${0})`
                    _green.fillRect(x, y, 1, 1)

                    _blue.fillStyle = `rgb(${0}, ${0}, ${b})`
                    _blue.fillRect(x, y, 1, 1)
                }
            }
        }
    }
}

setTimeout(run_channels, 100)