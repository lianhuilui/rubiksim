const pixelDiff = (lhs, rhs) => ({
    r: lhs.r - rhs.r,
    g: lhs.g - rhs.g,
    b: lhs.b - rhs.b,
});

const pixelAdd = (lhs, rhs) => ({
    r: lhs.r + rhs.r,
    g: lhs.g + rhs.g,
    b: lhs.b + rhs.b,
});

const clamp = (min, max, value) =>
    Math.max(min, Math.min(max, value));

let cache = {}

const hexToRgb = (hex) => {
    if (typeof hex != 'string') {
        throw Error("wrong type in hexToRgb")
    }

    if (cache[hex]) {
        return cache[hex]
    } else {

        if (hex.length == 4) {
            let [a, b, c, d] = hex.split("");

            hex = "#" + b + b + c + c + d + d;
        }

        let r = parseInt(hex.substring(1, 3), 16);
        let g = parseInt(hex.substring(3, 5), 16);
        let b = parseInt(hex.substring(5, 7), 16);

        let ans = { r, g, b };
        cache[hex] = ans

        return ans
    }
};

const calculatePixelDifference = (color1, color2, gray_scale_nearest_pixel) => {
    let pixel_diff = gray_scale_nearest_pixel
        ? pixelDiff(Rgb2Gray(color1), color2)
        : pixelDiff(color1, color2);

    let d_r = Math.abs(pixel_diff.r);
    let d_g = Math.abs(pixel_diff.g);
    let d_b = Math.abs(pixel_diff.b);

    let _diff = d_r * d_r + d_b * d_b + d_g * d_g;

    // optimized
    // _diff = Math.sqrt(_diff);

    return _diff;
};

let pallette_cache = {}
const nearestPixel = (rgb, pallette, gray_scale_nearest_pixel) => {
    let colors;
    if (pallette_cache[pallette]) {
        colors = pallette_cache[pallette]
    } else {
        colors = pallette;
        pallette_cache[pallette] = colors;
    }

    let ans = colors[0];
    let diff = null;

    colors.forEach((color, i) => {
        let _ = hexToRgb(color);

        let _diff = calculatePixelDifference(_, rgb, gray_scale_nearest_pixel);

        if (diff == null || diff > _diff) {
            diff = _diff;
            ans = _;
        }
    });

    return ans;
};

const nearestPixel2 = (rgb, pallette_array, gray_scale_nearest_pixel) => {
    let ans = pallette_array[0];
    let diff = null;

    pallette_array.forEach((color, i) => {

        let _diff = calculatePixelDifference(color, rgb, gray_scale_nearest_pixel);

        if (diff == null || diff > _diff) {
            diff = _diff;
            ans = color;
        }
    });


    return ans;
}

const RgbGrayValue = (rgb) =>
    Math.floor((rgb.r + rgb.g + rgb.b) / 3);

const RgbToHex = (rgb) =>
    "#" +
    rgb.r.toString(16).padStart(2, "0") +
    rgb.g.toString(16).padStart(2, "0") +
    rgb.b.toString(16).padStart(2, "0");

const Rgb2Gray = (rgb) => {
    let gray = RgbGrayValue(rgb);

    return {
        r: gray,
        g: gray,
        b: gray,
    };
};

/**
 * Returns a hash code from a string
 * @param  {String} str The string to hash.
 * @return {Number}    A 32bit integer
 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
function hashCode(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}


const calc_i = (x, y, width) => (y * width + x) * 4;

let setPixelDataRGB = function(image_data, x, y, pixel) {
    let width = image_data.width;
    let i = calc_i(x, y, width);

    image_data.data[i] = pixel.r;
    image_data.data[i + 1] = pixel.g;
    image_data.data[i + 2] = pixel.b;
};

let setPixelDataRaw = function(image_data, i, value) {
    image_data.data[i] = value;
};


let getPixelDataRGB = function(image_data, x, y) {
    let width = image_data.width;
    let i = calc_i(x, y, width);

    return {
        r: image_data.data[i],
        g: image_data.data[i + 1],
        b: image_data.data[i + 2],
    };
};

const cloneSubset = (src, des, x, y, w, h) => {
    let pctx = des.getContext('2d')

    let ctx = src.getContext('2d')

    let image_data = ctx.getImageData(
        0,
        0,
        w,
        h
    );

    pctx.putImageData(image_data, 0, 0)
}

function scaleImageData(c, imageData, scale) {
  var scaled = c.createImageData(imageData.width * scale, imageData.height * scale);

  for(var row = 0; row < imageData.height; row++) {
    for(var col = 0; col < imageData.width; col++) {
      var sourcePixel = [
        imageData.data[(row * imageData.width + col) * 4 + 0],
        imageData.data[(row * imageData.width + col) * 4 + 1],
        imageData.data[(row * imageData.width + col) * 4 + 2],
        imageData.data[(row * imageData.width + col) * 4 + 3]
      ];
      for(var y = 0; y < scale; y++) {
        var destRow = row * scale + y;
        for(var x = 0; x < scale; x++) {
          var destCol = col * scale + x;
          for(var i = 0; i < 4; i++) {
            scaled.data[(destRow * scaled.width + destCol) * 4 + i] =
              sourcePixel[i];
          }
        }
      }
    }
  }

  return scaled;
}
const drawGrid = (rctx, grid_size, rubiks_scale, width, height, color="#000000") => {

    rctx.lineWidth = grid_size;
    rctx.strokeStyle = color;

    for (let y = 0; y < height + 1; y++) {
        rctx.beginPath();
        rctx.moveTo(0, y * rubiks_scale);
        rctx.lineTo(
            width * rubiks_scale,
            y * rubiks_scale
        );
        rctx.stroke();
    }

    for (let x = 0; x < width + 1; x++) {
        rctx.beginPath();
        rctx.moveTo(x * rubiks_scale, 0);
        rctx.lineTo(
            x * rubiks_scale,
            height * rubiks_scale
        );
        rctx.stroke();
    }
}



const img_proc = {
    cloneSubset,
    getPixelDataRGB,
    setPixelDataRGB,
    setPixelDataRaw,
    calc_i,
    hashCode,
    Rgb2Gray,
    RgbGrayValue,
    RgbToHex,
    nearestPixel,
    nearestPixel2,
    clamp,
    pixelAdd,
    pixelDiff,
    hexToRgb,
    RgbToHex,
    calculatePixelDifference,
    drawGrid,
    scaleImageData
}

export {
    img_proc as img_processing
}
