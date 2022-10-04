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

  let config = {
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
    sqrt: true,
    pattern_grid: [
      [0 / 4, 2 / 4],
      [3 / 4, 1 / 4],
    ],
    pattern_grid0: [
      [0 / 16, 8 / 16, 2 / 16, 10 / 16],
      [12 / 16, 4 / 16, 14 / 16, 6 / 16],
      [3 / 16, 11 / 16, 1 / 16, 9 / 16],
      [15 / 16, 7 / 16, 13 / 16, 5 / 16],
    ],
    debug_color: "#fff",
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

      await tick();

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

  let calculatePixelDifference = function (color1, color2, sqrt) {
    let pixel_diff = config.gray_scale_nearest_pixel
      ? pixelDiff(Rgb2Gray(color1), color2)
      : pixelDiff(color1, color2);

    let d_r = Math.abs(pixel_diff.r);
    let d_g = Math.abs(pixel_diff.g);
    let d_b = Math.abs(pixel_diff.b);

    let _diff = d_r * d_r + d_b * d_b + d_g * d_g;

    if (config.sqrt) {
      _diff = Math.sqrt(_diff);
    }

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

  afterUpdate(async () => {
    if (config.width && image_loaded && originalImage) {
      let ctx = output_canvas.getContext("2d");

      let height = (ui.canvasheight / ui.canvaswidth) * config.width;

      ui.resizedwidth = parseInt(config.width / 3) * 3;
      ui.resizedheight = parseInt(height / 3) * 3;

      ui.total_pixels = ui.resizedheight * ui.resizedwidth;

      await tick();

      // resize

      if (config.debug_color) {
        ctx.fillStyle = config.debug_color;
        ctx.fillRect(0, 0, 100, 100);
      } else {
        ctx.drawImage(originalImage, 0, 0, ui.resizedwidth, ui.resizedheight);
      }

      await tick();

      let image_data = ctx.getImageData(
        0,
        0,
        ui.resizedwidth,
        ui.resizedheight
      );

      if (config.gray_scale_input) {
        for (let y = 0; y < image_data.height; y++) {
          for (let x = 0; x < image_data.width; x++) {
            let i = (y * ui.resizedwidth + x) * 4;

            let r = image_data.data[i + 0];
            let g = image_data.data[i + 1];
            let b = image_data.data[i + 2];

            let gray = Math.round((r + g + b) / 3);

            // gray scale
            image_data.data[i] = gray;
            image_data.data[i + 1] = gray;
            image_data.data[i + 2] = gray;
          }
        }
      }

      let pallette = config.pallette;

      if (config.individual_pallette_colors.length) {
        pallette = config.individual_pallette_colors
          .filter((color) => color.on)
          .map((color) => color.color)
          .join(",");
      }

      // processing
      for (let y = 0; y < image_data.height; y++) {
        for (let x = 0; x < image_data.width; x++) {
          let n = y * ui.resizedwidth + x;
          let i = n * 4;

          let r = image_data.data[i + 0];
          let g = image_data.data[i + 1];
          let b = image_data.data[i + 2];
          let a = image_data.data[i + 3];

          let pixel = { r, g, b };

          let np = nearestPixel(pixel, pallette);

          if (config.dithering == "") {
            // quantization
            image_data.data[i] = np.r;
            image_data.data[i + 1] = np.g;
            image_data.data[i + 2] = np.b;
          } else if (config.dithering == "fs") {
            // quantization
            image_data.data[i] = np.r;
            image_data.data[i + 1] = np.g;
            image_data.data[i + 2] = np.b;
            let quant_error = pixelDiff(pixel, np);

            if (x < image_data.width - 1) {
              let i1 = (y * ui.resizedwidth + x + 1) * 4;

              image_data.data[i1] =
                image_data.data[i1] + (quant_error.r * 7) / 16;
              image_data.data[i1 + 1] =
                image_data.data[i1 + 1] + (quant_error.g * 7) / 16;
              image_data.data[i1 + 2] =
                image_data.data[i1 + 2] + (quant_error.b * 7) / 16;
            }

            if (y < image_data.height - 1) {
              if (x > 0) {
                let i2 = ((y + 1) * ui.resizedwidth + x - 1) * 4;

                image_data.data[i2] =
                  image_data.data[i2] + (quant_error.r * 3) / 16;
                image_data.data[i2 + 1] =
                  image_data.data[i2 + 1] + (quant_error.g * 3) / 16;
                image_data.data[i2 + 2] =
                  image_data.data[i2 + 2] + (quant_error.b * 3) / 16;
              }

              let i3 = ((y + 1) * ui.resizedwidth + x) * 4;

              image_data.data[i3] =
                image_data.data[i3] + (quant_error.r * 5) / 16;
              image_data.data[i3 + 1] =
                image_data.data[i3 + 1] + (quant_error.g * 5) / 16;
              image_data.data[i3 + 2] =
                image_data.data[i3 + 2] + (quant_error.b * 5) / 16;

              if (x < image_data.width - 1) {
                let i4 = ((y + 1) * ui.resizedwidth + x + 1) * 4;
                image_data.data[i4] =
                  image_data.data[i4] + (quant_error.r * 1) / 16;
                image_data.data[i4 + 1] =
                  image_data.data[i4 + 1] + (quant_error.g * 1) / 16;
                image_data.data[i4 + 2] =
                  image_data.data[i4 + 2] + (quant_error.b * 1) / 16;
              }
            }
          } else if (config.dithering == "pattern") {
            // done - for each group of pixels, e.g., a 2x2 cluster of pixels,
            // done - find the average color of those pixels
            // done - calculate the min and max difference of that pixel from given pallette
            // done - clamp the all difference between 0 and 1
            // done - 0 being the nearest pixel, 1 being farthest
            // then apply the threshold defined by pattern_grid
            // done: average should include all pixels within range


            // TODO:
            // TRY:
            // Instead of averaging 2x2 (4 pixels) or 4x4 (16 pixels),
            // work on each pixel indiviually and match it with the moving threshold.
            // the moving threshold will come from the pattern_grid.
            // E.g. threshold = pattern_grid[x % 4][y % 4] where 4 is the grid size

            let sum_of_pixels = { r: 0, g: 0, b: 0 };

            for (let _i = 0; _i < config.pattern_grid.length; _i++) {
              for (let _j = 0; _j < config.pattern_grid[_i].length; _j++) {
                let i = ((y + _i) * ui.resizedwidth + (x + _j)) * 4;

                sum_of_pixels.r += image_data.data[i];
                sum_of_pixels.g += image_data.data[i + 1];
                sum_of_pixels.b += image_data.data[i + 2];
              }
            }

            let average = {
              r: Math.round(
                sum_of_pixels.r /
                  config.pattern_grid.length /
                  config.pattern_grid[0].length
              ),
              g: Math.round(
                sum_of_pixels.g /
                  config.pattern_grid.length /
                  config.pattern_grid[0].length
              ),
              b: Math.round(
                sum_of_pixels.b /
                  config.pattern_grid.length /
                  config.pattern_grid[0].length
              ),
            };

            if (x == 0 && y == 0) {
              console.log("sum", sum_of_pixels);
              console.log("average", average);
            }

            // average is the pixel we want to approximate
            // pixel_diffs are the color distances away from it from pallette
            // e.g. we have red, green, blue.
            // if average is purple, it is between red and blue
            // red ---- purple ---- blue
            // #f00  -----  ????  ----- #00f
            // can we have negative diff?

            let pixel_diffs = annotatePixelDifference(average, pallette);
            sortAnnotatedPalletteByDistance(pixel_diffs);

            let min_diff = pixel_diffs[0].diff;
            let max_diff = pixel_diffs[pixel_diffs.length - 1].diff;

            if (ui.show_debug) sortAnnotatedPalletteByGrayValue(pixel_diffs);

            if (x == 0 && y == 0) {
              console.log("diffs", pixel_diffs);
              console.log("min", min_diff);
              console.log("max", max_diff);
            }

            debugger;
            for (let itr = 0; itr < pixel_diffs.length; itr++) {
              const p_diff = pixel_diffs[itr];

              // normalize the diff
              p_diff.norm_diff =
                (p_diff.diff - min_diff) / (max_diff - min_diff);
            }

            if (x == 0 && y == 0) {
              console.log("diffs", pixel_diffs);
              console.log("min", min_diff);
              console.log("max", max_diff);
            }

            let width_of_grid = config.pattern_grid[0].length;
            let height_of_grid = config.pattern_grid.length;

            if (y % width_of_grid != 0) continue;
            if (x % height_of_grid != 0) continue;

            for (let _x = 0; _x < pixel_diffs.length; _x++) {
              const color = pixel_diffs[_x];

              if (color.norm_diff == 0) {
                // found the color we want. let's dither it
                // with the next one
                let next_color;
                debugger;
                if (_x < pixel_diffs.length - 1) {
                  next_color = pixel_diffs[_x + 1];
                } else {
                  next_color = pixel_diffs[_x - 1];
                }

                for (let _i = 0; _i < config.pattern_grid.length; _i++) {
                  for (let _j = 0; _j < config.pattern_grid[_i].length; _j++) {
                    const threshold = config.pattern_grid[_i][_j];
                    const i = ((y + _j) * ui.resizedwidth + (x + _i)) * 4;

                    if (RgbGrayValue(average)) {

                    }

                    if (next_color.norm_diff < threshold) {
                      // next color
                      image_data.data[i] = next_color.color.r;
                      image_data.data[i + 1] = next_color.color.g;
                      image_data.data[i + 2] = next_color.color.b;

                      // image_data.data[i] = 255
                      // image_data.data[i + 1] = 0
                      // image_data.data[i + 2] = 0
                    } else {
                      // this color
                      image_data.data[i] = color.color.r;
                      image_data.data[i + 1] = color.color.g;
                      image_data.data[i + 2] = color.color.b;
                    }
                  }
                }

                break;
              }
            }

            /*
            for (let _i = 0; _i < config.pattern_grid.length; _i++) {
              for (let _j = 0; _j < config.pattern_grid[_i].length; _j++) {
                // debugger;
                const threshold = config.pattern_grid[_i][_j];

                // let's assume
                // color.diff = 0.1
                // next_color.diff = 0.3
                // next.... 0.4 -> 0.5 -> 0.6 -> 1.0
                // threshold = 0.25
                for (let _x = 0; _x < pixel_diffs.length - 1; _x++) {
                  const color = pixel_diffs[_x];

                  if (color.norm_diff == 0) {
                    // found the color we want. let's dither it
                    // with the next one
                  }

                  if (color.norm_diff <= threshold) {
                    if (x == 0 && y == 0) {
                      console.log("color", color, "is less than", threshold);
                    }
                    // todo: take care of edge cases (edge of the image)
                    let i = ((y + _j) * ui.resizedwidth + (x + _i)) * 4;
                    image_data.data[i] = color.color.r;
                    image_data.data[i + 1] = color.color.g;
                    image_data.data[i + 2] = color.color.b;

                    break;
                  } else {
                    if (x == 0 && y == 0) {
                      console.log("skipping", color);
                    }
                  }

                  if (_x == pixel_diffs.length - 1) {
                    // no color was found
                    image_data.data[i] = 127;
                    image_data.data[i + 1] = 127;
                    image_data.data[i + 2] = 127;
                  }
                }
              }
            }
            */
          }
        }
      } // end 2d for loop

      ctx.putImageData(image_data, 0, 0);

      await tick();

      let rctx = rubiks_canvas.getContext("2d");

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
          <span class="p-2">Input Image</span>
          <Toggle text="Gray" bind:checked={config.gray_scale_input} />
        </div>
        <div class="flex">
          <span class="p-2">Nearest Pixel</span>
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
      <input type="text" bind:value={config.debug_color} />
      <input
        type="range"
        bind:value={config.debug_range}
        min="-1"
        max={ui.total_pixels}
        step="1"
      />
      <Toggle bind:checked={config.sqrt} text="Sqrt" />
      {#each config.pattern_grid as row}
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
