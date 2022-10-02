<script>
  import { afterUpdate } from "svelte";
  import { object_without_properties } from "svelte/internal";
  import Toggle from "./lib/Toggle.svelte";
  import PalletteButton from "./lib/PalletteButton.svelte";
  import { tick } from "svelte";

  let image_loaded = false;

  let pallettes = [
    { name: "b&w", colors: "#000,#fff" },
    { name: "gray", colors: "#000,#888,#fff" },
    { name: "rgb", colors: "#000,#f00,#0f0,#00f,#fff" },
    { name: "cmyk", colors: "#000,#0ff,#f0f,#ff0,#fff" },
    { name: "rbk", colors: "#013082,#BB2328,#01B351,#FE8F25,#F5FF42,#ECF3F6" },
    { name: "rbkng", colors: "#013082,#BB2328,#FE8F25,#F5FF42,#ECF3F6" },
  ];

  /*

  */

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

      let pixel_diff = config.gray_scale_nearest_pixel
        ? pixelDiff(Rgb2Gray(_), rgb)
        : pixelDiff(_, rgb);

      let d_r, d_g, d_b, _diff;

      d_r = Math.abs(pixel_diff.r);
      d_g = Math.abs(pixel_diff.g);
      d_b = Math.abs(pixel_diff.b);

      _diff = d_r * d_r + d_b * d_b + d_g * d_g;

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
    dithering: "fs",
    max_width: 999,
    show_rubiks: true,
    show_grid: true,
    rubiks_scale: 8,
    gray_scale_input: false,
    gray_scale_nearest_pixel: false,
    grid_size: 2,
    pallette: pallettes[0].colors,
    debug_range: 100,
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
  };

  let toggleUI = function (str) {
    if (ui.current == str) {
      ui.current = "";
    } else {
      ui.current = str;
    }
  };

  afterUpdate(async () => {
    if (config.width && image_loaded && originalImage) {
      let ctx = output_canvas.getContext("2d");

      let height = (ui.canvasheight / ui.canvaswidth) * config.width;
      ui.resizedwidth = parseInt(config.width);
      ui.resizedheight = parseInt(height);

      await tick();

      // resize
      ctx.drawImage(originalImage, 0, 0, ui.resizedwidth, ui.resizedheight);

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

      // processing
      for (let y = 0; y < image_data.height; y++) {
        for (let x = 0; x < image_data.width; x++) {
          let i = (y * ui.resizedwidth + x) * 4;

          if (ui.show_debug && config.debug_range < 100) {
            if ((i / image_data.data.length) * 100 > config.debug_range) {
              break;
            }
          }

          let r = image_data.data[i + 0];
          let g = image_data.data[i + 1];
          let b = image_data.data[i + 2];
          let a = image_data.data[i + 3];

          let pixel = { r, g, b };

          let np = nearestPixel(pixel, config.pallette);

          // quantization
          image_data.data[i] = np.r;
          image_data.data[i + 1] = np.g;
          image_data.data[i + 2] = np.b;

          if (config.dithering == "fs") {
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
    {/if}

    {#if ui.show_debug}
      <p>debug: {debug}</p>
      <input type="range" bind:value={config.debug_range} min="0" max="100" step="0.1" />
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
