<script>
  import { afterUpdate } from "svelte";
  import { object_without_properties } from "svelte/internal";
  import Toggle from "./lib/Toggle.svelte";
  import PalletteButton from "./lib/PalletteButton.svelte";
  import { tick } from "svelte";

  let image_loaded = false;

  let pallettes = [
    { name: "rbk", colors: "#013082,#BB2328,#01B351,#FE8F25,#F5FF42,#ECF3F6" },
    { name: "rbkng", colors: "#013082,#BB2328,#FE8F25,#F5FF42,#ECF3F6" },
    { name: "b&w", colors: "#000,#fff" },
    { name: "gray", colors: "#000,#666,#fff" },
    {
      name: "grayscale",
      colors:
        "#000,#111,#222,#333,#444,#555,#666,#777,#888,#999,#aaa,#bbb,#ccc,#ddd,#eee,#fff",
    },
    { name: "rgb", colors: "#000,#f00,#0f0,#00f,#fff" },
    { name: "cmyk", colors: "#000,#0ff,#f0f,#ff0,#fff" },
  ];

  function pixelDiff(lhs, rhs) {
    return {
      r: lhs.r - rhs.r,
      g: lhs.g - rhs.g,
      b: lhs.b - rhs.b,
    };
  }

  function pixelAdd(lhs, rhs) {
    return {
      r: lhs.r + rhs.r,
      g: lhs.g + rhs.g,
      b: lhs.b + rhs.b,
    };
  }

  let clamp = function (min, max, value) {
    return Math.max(min, Math.min(max, value));
  };

  let hexToRgb = function (hex) {
    if (hex.length == 4) {
      let [a, b, c, d] = hex.split("");

      hex = "#" + b + b + c + c + d + d;
    }

    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    return { r, g, b };
  };

  let RgbToHex = function (rgb) {
    return (
      "#" +
      rgb.r.toString(16).padStart(2, "0") +
      rgb.g.toString(16).padStart(2, "0") +
      rgb.b.toString(16).padStart(2, "0")
    );
  };

  let RgbGrayValue = function (rgb) {
    return Math.floor((rgb.r + rgb.g + rgb.b) / 3);
  };

  let Rgb2Gray = function (rgb) {
    let gray = RgbGrayValue(rgb);

    return {
      r: gray,
      g: gray,
      b: gray,
    };
  };

  let nearestPixel = function (rgb, pallette) {
    let colors = pallette.split(",");
    let ans = colors[0];
    let diff = null;

    colors.forEach((color, i) => {
      let _ = hexToRgb(color);

      let _diff = calculatePixelDifference(_, rgb);

      if (diff == null || diff > _diff) {
        diff = _diff;
        ans = _;
      }
    });

    return ans;
  };

  let matrices = [
    [
      [0 / 4, 2 / 4],
      [3 / 4, 1 / 4],
    ],
    [
      [0 / 16, 8 / 16, 2 / 16, 10 / 16],
      [12 / 16, 4 / 16, 14 / 16, 6 / 16],
      [3 / 16, 11 / 16, 1 / 16, 9 / 16],
      [15 / 16, 7 / 16, 13 / 16, 5 / 16],
    ],
  ];

  // TODO: separate the configs which affect the final output
  // from the ones that dont
  let config = {
    cache: false,
    cap: true,
    pixelated: true,
    width: 0,
    dithering: "pattern",
    max_width: 300,
    show_rubiks: true,
    show_grid: false,
    rubiks_scale: 8,
    gray_scale_input: false,
    gray_scale_nearest_pixel: false,
    grid_size: 2,
    pallette: pallettes[0].colors,
    individual_pallette_colors: [],
    debug_range: -1,
    matrix: matrices[0],
  };

  $: debug = (
    "UI = " +
    JSON.stringify(ui) +
    "\nCONFIG:" +
    JSON.stringify(config)
  ).replaceAll(",", ", ");

  let ui = {
    current: "",
    hovering: false,
    show_debug: false,
    resizedwidth: 0,
    resizedheight: 0,
    total_pixels: 0,
    canvaswidth: 100,
    canvasheight: 100,
  };

  /* bound variables */
  let canvas;
  let output_canvas;
  let rubiks_canvas;

  let handleDrop = function (e) {
    e.preventDefault();

    let ev = e;

    if (ev.dataTransfer.items) {
      if (ev.dataTransfer.items.length == 1) {
        let item = ev.dataTransfer.items[0];

        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          const file = item.getAsFile();

          loadImageOnCanvas(file);
        } else {
          console.log("kind is not file, but: " + item.kind);
        }
      } else {
        debug = "Error: can only load one file";
      }
    }

    ui.hovering = false;
  };

  let handleDragEnter = function () {
    console.log("drag enter");
    ui.hovering = true;
  };

  let handleDragLeave = function () {
    ui.hovering = false;
  };

  let calc_i = function (x, y, width) {
    return (y * width + x) * 4;
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

  let originalImage;

  let loadImageOnCanvas = function (file) {
    console.log(file);

    let ctx = canvas.getContext("2d");
    originalImage = new Image();

    originalImage.onload = async function () {
      ui.canvasheight = originalImage.height;
      ui.canvaswidth = originalImage.width;

      config.width = Math.min(99, ui.canvaswidth);
      config.max_width = Math.min(ui.canvaswidth, 999);

      image_loaded = true;

      console.log('waiting')
      await tick();

      console.log('waited for tick, drawing now')
      ctx.drawImage(
        originalImage,
        0,
        0,
        originalImage.width,
        originalImage.height
      );
    };

    originalImage.src = URL.createObjectURL(file);
  };

  let setPallette = function (color) {
    config.pallette = color;

    config.individual_pallette_colors = [];

    color.split(",").forEach((value) => {
      config.individual_pallette_colors.push({ color: value, on: true });
    });
  };

  let toggleUI = function (str) {
    if (ui.current == str) {
      ui.current = "";
    } else {
      ui.current = str;
    }
  };

  /* return an array of colors from pallette
  annotated difference from given color */
  let annotatePixelDifference = function (color, pallette) {
    let array = [];

    pallette.split(",").forEach((pallette_color, i) => {
      let pallette_color_rgb = hexToRgb(pallette_color);
      let diff = calculatePixelDifference(color, pallette_color_rgb);

      let new_row = {
        color: pallette_color_rgb,
        hex: pallette_color,
        diff: diff,
      };

      array.push(new_row);
    });

    return array;
  };

  let calculatePixelDifference = function (color1, color2) {
    let pixel_diff = config.gray_scale_nearest_pixel
      ? pixelDiff(Rgb2Gray(color1), color2)
      : pixelDiff(color1, color2);

    let d_r = Math.abs(pixel_diff.r);
    let d_g = Math.abs(pixel_diff.g);
    let d_b = Math.abs(pixel_diff.b);

    let _diff = d_r * d_r + d_b * d_b + d_g * d_g;

    _diff = Math.sqrt(_diff);

    return _diff;
  };

  let sortAnnotatedPalletteByDistance = function (annotated_pallette) {
    annotated_pallette.sort((a, b) => a.diff - b.diff);

    return annotated_pallette;
  };

  let sortAnnotatedPalletteByGrayValue = function (annotated_pallette) {
    annotated_pallette.sort(
      (a, b) =>
        (a.color.r + a.color.b + a.color.g) / 3 -
        (b.color.r + b.color.b + b.color.g) / 3
    );

    return annotated_pallette;
  };

  let getPixelDataRGB = function (image_data, x, y) {
    let width = image_data.width;
    let i = calc_i(x, y, width);

    return {
      r: image_data.data[i],
      g: image_data.data[i + 1],
      b: image_data.data[i + 2],
    };
  };

  let setPixelDataRGB = function (image_data, x, y, pixel) {
    let width = image_data.width;
    let i = calc_i(x, y, width);

    image_data.data[i] = pixel.r;
    image_data.data[i + 1] = pixel.g;
    image_data.data[i + 2] = pixel.b;
  };

  // todo: cache result
  let cache = {};

  afterUpdate(async () => {
    console.log("afterupdate");

    if (!config.width) {
      console.log("no width, ending here");
      return;
    }

    if (!image_loaded) {
      console.log("no image loaded, ending here");
      return;
    }

    if (!originalImage) {
      console.log("originalImage is empty", "ending here");
      return;
    }

    let height = (ui.canvasheight / ui.canvaswidth) * config.width;
    ui.resizedwidth = parseInt(config.width / 3) * 3;
    ui.resizedheight = parseInt(height / 3) * 3;
    ui.total_pixels = ui.resizedheight * ui.resizedwidth;

    console.log('await tick')
    await tick();


    if (height < 1) {
      console.log("height is less than 1", 'ending here')
      return;
    }

    let thehash = hashCode(JSON.stringify(config))

    if (cache[thehash]) {
      console.log("found", thehash, "from cache");
      // console.log(cache[thehash]);

      let ctx = output_canvas.getContext("2d");

      // let cached_image_data = ctx.createImageData(0, 0, ui.resizedwidth, ui.resizedheight)

      let __ = cache[thehash];
      let cached_image_data = new ImageData(__.data, __.width, __.height);

      ctx.putImageData(cached_image_data, 0, 0);

      console.log("loaded", thehash);
    } else {
      console.log("generating!!!");
      let ctx = output_canvas.getContext("2d");

      // let height = (ui.canvasheight / ui.canvaswidth) * config.width;

      // ui.resizedwidth = parseInt(config.width / 3) * 3;
      // ui.resizedheight = parseInt(height / 3) * 3;
      // ui.total_pixels = ui.resizedheight * ui.resizedwidth;

      // console.log('waiting')
      // await tick();

      console.log('waited for tick, resizing now')

      // resize
      ctx.drawImage(originalImage, 0, 0, ui.resizedwidth, ui.resizedheight);

      // await tick();

      let image_data = ctx.getImageData(
        0,
        0,
        ui.resizedwidth,
        ui.resizedheight
      );

      // make grayscale
      if (config.gray_scale_input) {
        for (let y = 0; y < image_data.height; y++) {
          for (let x = 0; x < image_data.width; x++) {
            let pixel = getPixelDataRGB(image_data, x, y);
            let gray = Math.round((pixel.r + pixel.g + pixel.b) / 3);
            setPixelDataRGB(image_data, x, y, { r: gray, g: gray, b: gray });
          }
        }
      }

      // only get the pallette colors that are "ON"
      let pallette = config.pallette;

      if (config.individual_pallette_colors.length) {
        pallette = config.individual_pallette_colors
          .filter((color) => color.on)
          .map((color) => color.color)
          .join(",");
      }

      let N = pallette.split(",").length;

      // processing
      for (let y = 0; y < image_data.height; y++) {
        for (let x = 0; x < image_data.width; x++) {
          // if (config.debug_range >= 0) {
          //   let i = calc_i(x, y, image_data.width)
          //   i /= 4
          //   if (i > config.debug_range){
          //     x = image_data.width
          //     y = image_data.height
          //     break;
          //   } else {
          //     console.log("i", i, "is less than", config.debug_range)
          //   }
          // } else {
          //   console.log(config.debug_range)
          // }

          let pixel = getPixelDataRGB(image_data, x, y);

          let np = nearestPixel(pixel, pallette);

          if (config.dithering == "") {
            // quantization
            setPixelDataRGB(image_data, x, y, np);
          } else if (config.dithering == "fs") {
            // TODO: investigate if quantization error that is pushed to other pixels are limited by 8 bits 0-255
            // causing the value to clamp

            // quantization
            setPixelDataRGB(image_data, x, y, np);

            let quant_error = pixelDiff(pixel, np);

            if (x < image_data.width - 1) {
              let old_pixel = getPixelDataRGB(image_data, x + 1, y);

              if (config.cap) {
                setPixelDataRGB(image_data, x + 1, y, {
                  r: clamp(0, 255, old_pixel.r + (quant_error.r * 7) / 16),
                  g: clamp(0, 255, old_pixel.g + (quant_error.g * 7) / 16),
                  b: clamp(0, 255, old_pixel.b + (quant_error.b * 7) / 16),
                });
              } else {
                setPixelDataRGB(image_data, x + 1, y, {
                  r: old_pixel.r + (quant_error.r * 7) / 16,
                  g: old_pixel.g + (quant_error.g * 7) / 16,
                  b: old_pixel.b + (quant_error.b * 7) / 16,
                });
              }
            }

            if (y < image_data.height - 1) {
              if (x > 0) {
                let old_pixel = getPixelDataRGB(image_data, x - 1, y + 1);

                if (config.cap) {
                  setPixelDataRGB(image_data, x - 1, y + 1, {
                    r: clamp(0, 255, old_pixel.r + (quant_error.r * 3) / 16),
                    g: clamp(0, 255, old_pixel.g + (quant_error.g * 3) / 16),
                    b: clamp(0, 255, old_pixel.b + (quant_error.b * 3) / 16),
                  });
                } else {
                  setPixelDataRGB(image_data, x - 1, y + 1, {
                    r: old_pixel.r + (quant_error.r * 3) / 16,
                    g: old_pixel.g + (quant_error.g * 3) / 16,
                    b: old_pixel.b + (quant_error.b * 3) / 16,
                  });
                }
              }

              let old_pixel = getPixelDataRGB(image_data, x, y + 1);

              if (config.cap) {
                setPixelDataRGB(image_data, x, y + 1, {
                  r: clamp(0, 255, old_pixel.r + (quant_error.r * 5) / 16),
                  g: clamp(0, 255, old_pixel.g + (quant_error.g * 5) / 16),
                  b: clamp(0, 255, old_pixel.b + (quant_error.b * 5) / 16),
                });
              } else {
                setPixelDataRGB(image_data, x, y + 1, {
                  r: old_pixel.r + (quant_error.r * 5) / 16,
                  g: old_pixel.g + (quant_error.g * 5) / 16,
                  b: old_pixel.b + (quant_error.b * 5) / 16,
                });
              }

              if (x < image_data.width - 1) {
                let old_pixel = getPixelDataRGB(image_data, x + 1, y + 1);

                if (config.cap) {
                  setPixelDataRGB(image_data, x + 1, y + 1, {
                    r: clamp(0, 255, old_pixel.r + (quant_error.r * 1) / 16),
                    g: clamp(0, 255, old_pixel.g + (quant_error.g * 1) / 16),
                    b: clamp(0, 255, old_pixel.b + (quant_error.b * 1) / 16),
                  });
                } else {
                  setPixelDataRGB(image_data, x + 1, y + 1, {
                    r: old_pixel.r + (quant_error.r * 1) / 16,
                    g: old_pixel.g + (quant_error.g * 1) / 16,
                    b: old_pixel.b + (quant_error.b * 1) / 16,
                  });
                }
              }
            }
          } else if (config.dithering == "pattern") {
            // ordered dithering
            // https://en.wikipedia.org/wiki/Ordered_dithering
            // new_pixel = nearestPalletteColor(old_pixel + (255/n) * pattern_grid[x%4][y%4] - 0.5)

            let old_pixel = getPixelDataRGB(image_data, x, y);

            let change =
              (255 / N) *
              (config.matrix[x % config.matrix[0].length][
                y % config.matrix.length
              ] -
                0.5);

            let new_pixel = nearestPixel(
              {
                r: old_pixel.r + change,
                g: old_pixel.g + change,
                b: old_pixel.b + change,
              },
              pallette
            );

            setPixelDataRGB(image_data, x, y, new_pixel);
          }
        }
      } // end 2d for loop

      ctx.putImageData(image_data, 0, 0);

      // image_data = ctx.getImageData(0, 0, ui.resizedwidth, ui.resizedheight);

      // todo: cache the result in cache
      // 1. generate a unique key based on config
      // 2. store the image_data in cache with a hash of the config

      let tocache = new ImageData(new Uint8ClampedArray(image_data.data), image_data.width, image_data.height);

      cache[thehash] = tocache;

      // console.log("adding", thehash, "to cache");
      // console.log(image_data);
      // console.log(tocache);
    }

    // await tick();

    if (config.show_rubiks) {
      let rctx = rubiks_canvas.getContext("2d");
      let ctx = output_canvas.getContext("2d");
      let image_data = ctx.getImageData(
        0,
        0,
        ui.resizedwidth,
        ui.resizedheight
      );

      for (let y = 0; y < image_data.height; y++) {
        for (let x = 0; x < image_data.width; x++) {
          let style = "#ffffff";

          let i = (y * image_data.width + x) * 4;

          let r = image_data.data[i + 0];
          let g = image_data.data[i + 1];
          let b = image_data.data[i + 2];

          style = RgbToHex({ r, g, b });

          rctx.fillStyle = style;
          rctx.fillRect(
            x * config.rubiks_scale,
            y * config.rubiks_scale,
            x + config.rubiks_scale + 1,
            y + config.rubiks_scale + 1
          );
        }
      }

      if (config.show_grid && config.grid_size > 0) {
        rctx.lineWidth = config.grid_size;
        rctx.strokeStyle = "#000000";

        for (let y = 0; y < image_data.height; y++) {
          rctx.beginPath();
          rctx.moveTo(0, y * config.rubiks_scale);
          rctx.lineTo(
            image_data.width * config.rubiks_scale,
            y * config.rubiks_scale
          );
          rctx.stroke();
        }

        for (let x = 0; x < image_data.width; x++) {
          rctx.beginPath();
          rctx.moveTo(x * config.rubiks_scale, 0);
          rctx.lineTo(
            x * config.rubiks_scale,
            image_data.height * config.rubiks_scale
          );
          rctx.stroke();
        }
      }
    }
  });
</script>

<main>
  <div class="flex flex-col bg-red-800 h-screen">
    <div class="bg-white text-black p-2">
      <div class="flex">
        <button
          class:bg-gray-400={ui.current == "img"}
          class="h-10 p-2 rounded-lg border-solid border-2 text-center"
          on:click={() => {
            toggleUI("img");
          }}>Image</button
        >
        <button
          class:bg-gray-400={ui.current == "pallette"}
          class="h-10 p-2 rounded-lg border-solid border-2 text-center"
          on:click={() => {
            toggleUI("pallette");
          }}>Pallette</button
        >
        <button
          class:bg-gray-400={ui.current == "processing"}
          class="h-10 p-2 rounded-lg border-solid border-2 text-center"
          on:click={() => {
            toggleUI("processing");
          }}>Processing</button
        >
        <button
          class:bg-gray-400={ui.current == "rubiks"}
          class="h-10 p-2 rounded-lg border-solid border-2 text-center"
          on:click={() => {
            toggleUI("rubiks");
          }}>Rubiks</button
        >
        <div class="spacer" />

        <Toggle bind:checked={ui.show_debug} text="debug" />
      </div>
    </div>

    {#if ui.current == "img"}
      <div class="bg-white text-black p-2">
        <div class="flex flex-col">
          <div class="flex slider-wrapper">
            <span>Width</span>
            <input
              style="flex: 1"
              type="range"
              bind:value={config.width}
              min="3"
              max={config.max_width}
              step="3"
            />
            <span>{config.width}</span>
          </div>
          <div class="flex">
            <div class="d-block">
              <Toggle text="Pixelated" bind:checked={config.pixelated} />
            </div>
          </div>
        </div>
      </div>
    {/if}

    {#if ui.current == "rubiks"}
      <div class="bg-white text-black p-2">
        <div class="flex flex-col">
          <div class="flex">
            <Toggle bind:checked={config.show_rubiks} text="rubiks" />
            <Toggle text="Show Grid" bind:checked={config.show_grid} />
          </div>
          <div class="flex">
            Scale
            <input type="range" bind:value={config.rubiks_scale} max="40" />
            <span>{config.rubiks_scale}</span>

            <span style="margin-left: 10px">&nbsp;</span>
            Grid Size
            <input type="range" bind:value={config.grid_size} max="10" />
            <span>{config.grid_size}</span>
          </div>
        </div>
      </div>
    {/if}

    {#if ui.current == "processing"}
      <div class="bg-white text-black p-2">
        <div class="flex">
          <span class="p-2">Input Image:</span>
          <Toggle text="Gray" bind:checked={config.gray_scale_input} />
        </div>
        <div class="flex">
          <span class="p-2">Nearest Pixel:</span>
          <Toggle
            text="Nearest Gray Pixel"
            bind:checked={config.gray_scale_nearest_pixel}
          />
        </div>
        <div class="flex">
          <Toggle
            text="No Dithering"
            checked={config.dithering == ""}
            on:click={() => (config.dithering = "")}
          />
          <Toggle
            text="Patterned Dithering"
            checked={config.dithering == "pattern"}
            on:click={() => (config.dithering = "pattern")}
          />
          {#if config.dithering == "pattern"}
            <span class="h-10 p-2"> Matrix: </span>
            {#each matrices as m}
              <button
                class:bg-green-600={config.matrix == m}
                class="h-10 p-2 rounded-lg border-solid border-2"
                on:click={() => {
                  config.matrix = m;
                }}
              >
                {m.length}
              </button>
            {/each}
          {/if}
          <Toggle
            text="Floyd Steinberg"
            on:click={() => (config.dithering = "fs")}
            checked={config.dithering == "fs"}
          />
        </div>
      </div>
    {/if}

    {#if ui.current == "pallette"}
      <div class="bg-white text-black p-2">
        <div class="flex">
          {#each pallettes as pallette}
            <PalletteButton
              selected={config.pallette}
              on:click={(e, t) => {
                setPallette(pallette.colors);
              }}
              name={pallette.name}
              color={pallette.colors}
            />
          {/each}
        </div>
      </div>
      <div class="flex">
        {#each config.individual_pallette_colors as c}
          <Toggle
            bind:checked={c.on}
            text={c.color}
            bgcolor={c.on ? c.color : "white"}
          />
        {/each}
      </div>
    {/if}

    {#if ui.show_debug}
      <code>{debug}</code>
      <input
        type="range"
        bind:value={config.debug_range}
        min="-1"
        max={ui.total_pixels}
        step="1"
      />
      {#if config.dithering == "pattern"}
        {#each config.matrix as row}
          <div class="flex">
            {#each row as cell}
              <input
                type="range"
                bind:value={cell}
                step="0.01"
                max="1.0"
                min="0.0"
              />
              {cell}
            {/each}
          </div>
        {/each}
      {/if}
      {#if config.dithering == "fs"}
        <Toggle text="Cap" bind:checked={config.cap} />
      {/if}
    {/if}

    <div class="bg-green-800 grow justify-center">
      <div
        ondragover="return false"
        on:drop={handleDrop}
        on:dragenter={handleDragEnter}
        on:dragleave={handleDragLeave}
        id="drop_zone"
        class="bg-black h-full"
      >
        <div class="flex">
          <div class="flex-col">
            <canvas
              class="small"
              class:shown={image_loaded}
              class:pixelated={config.pixelated}
              id="canvas"
              width={ui.canvaswidth}
              height={ui.canvasheight}
              bind:this={canvas}
            />
            <canvas
              class:small={config.show_rubiks}
              class:shown={image_loaded}
              class:pixelated={config.pixelated}
              id="output_canvas"
              width={ui.resizedwidth}
              height={ui.resizedheight}
              bind:this={output_canvas}
            />
            <canvas
              class:shown={image_loaded && config.show_rubiks}
              class:pixelated={config.pixelated}
              id="rubiks_canvas"
              width={ui.resizedwidth * config.rubiks_scale}
              height={ui.resizedheight * config.rubiks_scale}
              bind:this={rubiks_canvas}
            />
          </div>
        </div>

        {#if !image_loaded && ui.hovering}
          <div
            class="rounded-lg border-solid border-2 p-8 text-white text-center m-auto w-fit"
          >
            Drop to load image
          </div>
        {/if}
      </div>
    </div>

    {#if ui.resizedheight && ui.resizedwidth}
      Image Size: {ui.resizedwidth} x {ui.resizedheight} = {ui.resizedwidth *
        ui.resizedheight}
      | Total Rubiks: {(ui.resizedheight * ui.resizedwidth) / 9}
    {/if}
  </div>
</main>

<style>
  .spacer {
    flex-grow: 1;
  }
  pre {
    overflow: hidden;
  }
  #canvas,
  #rubiks_canvas {
    display: none;
  }
  .small {
    max-width: 10%;
    display: inline;
  }
  #canvas.shown,
  #rubiks_canvas.shown {
    display: inline-block;
  }
  .pixelated {
    image-rendering: pixelated;
  }
  canvas {
    border: 1px solid black;
    width: 100vw;
  }
  #rubiks_canvas {
  }
  .slider-wrapper > * {
    margin: 4px;
  }

  .slider-wrapper > *:first-child {
    margin-left: 0;
  }

  .slider-wrapper > *:last-child {
    margin-right: 0;
  }
</style>
