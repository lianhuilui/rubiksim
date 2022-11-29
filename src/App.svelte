<script>
  import { afterUpdate } from "svelte";
  import Toggle from "./lib/Toggle.svelte";
  import PalletteButton from "./lib/PalletteButton.svelte";
  import { tick } from "svelte";
  import { img_processing as m } from "./img_processing.js";

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
    loadedfile: "",
    cache: true,
    cap: false,
    pixelated: true,
    has_mockup: false,
    mockup_pixel_size: 1,
    mockup_x: 0,
    mockup_y: 0,
    width: 0,
    height: 0,
    dithering: "pattern",
    max_width: 600,
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

  $: params = {
    loadedfile: config.loadedfile,
    width: config.width,
    height: config.height,
    dithering: config.dithering,
    gray_scale_input: config.gray_scale_input,
    gray_scale_nearest_pixel: config.gray_scale_nearest_pixel,
    pallette: config.pallette,
    individual_pallette_colors: config.individual_pallette_colors,
    matrix: config.matrix,
  };


  $: debug = (
    "UI = " +
    JSON.stringify(ui) +
    "\nparams: " +
    JSON.stringify(params) +
    "\nCONFIG:" +
    JSON.stringify(config)
     +
     "CLIENT WIDTH:" + bgcanvas_clientWidth
  ).replaceAll(",", ", ");

  let ui = {
    current: "",
    hovering: false,
    mockup_hovering: false,
    mockupheight: 100,
    mockupwidth: 100,
    show_debug: false,
    resizedwidth: 0,
    resizedheight: 0,
    total_pixels: 0,
    canvaswidth: 100,
    canvasheight: 100,
  };

  /* bound variables */

  let bgcanvas_clientWidth;
  let bgcanvas_clientHeight;

  let canvas;
  let bgcanvas;
  let output_canvas;
  let rubiks_canvas;
  let thehash = "";

  // to cache output
  let cache = {};

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

  let handleMockupDrop = function (e) {
    e.preventDefault();

    let ev = e;

    if (ev.dataTransfer.items) {
      if (ev.dataTransfer.items.length == 1) {
        let item = ev.dataTransfer.items[0];

        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          const file = item.getAsFile();

          config.has_mockup = true;

          loadImageOnBackgroundCanvas(file);
        } else {
          console.log("kind is not file, but: " + item.kind);
        }
      } else {
        debug = "Error: can only load one file";
      }
    }

    ui.mockup_hovering = false;
  };

  let handleMockupDragEnter = function () {
    console.log("drag enter");
    ui.mockup_hovering = true;
  };

  let handleMockupDragLeave = function () {
    ui.mockup_hovering = false;
  };

  let originalImage;

  let bgImage;

  let loadImageOnBackgroundCanvas = function (file) {
    // empty cache
    let ctx = bgcanvas.getContext("2d");
    bgImage = new Image();

    bgImage.onload = async function () {

      await tick();

      ui.mockupheight = bgImage.height;
      ui.mockupwidth = bgImage.width;

      await tick();

      ctx.drawImage(bgImage, 0, 0, bgImage.width, bgImage.height);
    };

    bgImage.src = URL.createObjectURL(file);
  };

  let loadImageOnCanvas = function (file) {
    // empty cache
    config.loadedfile = file.name;

    let ctx = canvas.getContext("2d");
    originalImage = new Image();

    originalImage.onload = async function () {
      ui.canvasheight = originalImage.height;
      ui.canvaswidth = originalImage.width;

      config.width = Math.min(99, ui.canvaswidth);
      config.max_width = Math.min(ui.canvaswidth, 999);

      image_loaded = true;

      // this is the only way... by clearing cache
      cache = {};

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

  afterUpdate(async () => {
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
    config.height = height;
    ui.resizedwidth = parseInt(config.width / 3) * 3;
    ui.resizedheight = parseInt(height / 3) * 3;
    ui.total_pixels = ui.resizedheight * ui.resizedwidth;

    await tick();

    if (height < 1) {
      console.log("height is less than 1", "ending here");
      return;
    }

    thehash = m.hashCode(JSON.stringify(params));

    if (config.cache && thehash && cache[thehash]) {
      console.log("found", params.loadedfile, thehash, "from cache");

      let ctx = output_canvas.getContext("2d");

      let cached_data = cache[thehash].data;
      let cached_image_data = new ImageData(
        cached_data.data,
        cached_data.width,
        cached_data.height
      );

      ctx.putImageData(cached_image_data, 0, 0);
    } else {
      console.log("GENERATING IMAGE", JSON.stringify(params), thehash);
      let ctx = output_canvas.getContext("2d");

      ctx.drawImage(originalImage, 0, 0, ui.resizedwidth, ui.resizedheight);

      let image_data = ctx.getImageData(
        0,
        0,
        ui.resizedwidth,
        ui.resizedheight
      );

      // make grayscale
      if (config.gray_scale_input) {
        for (let y = 0, i = 0; y < image_data.height; y++) {
          for (let x = 0; x < image_data.width; x++, i += 4) {
            let pixel = m.getPixelDataRGB(image_data, x, y);
            let gray = Math.round((pixel.r + pixel.g + pixel.b) / 3);

            // setPixelDataRGB(image_data, x, y, { r: gray, g: gray, b: gray });

            // optimized
            m.setPixelDataRaw(image_data, i, gray);
            m.setPixelDataRaw(image_data, i + 1, gray);
            m.setPixelDataRaw(image_data, i + 2, gray);
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

      let color_array = pallette.split(",");

      color_array.forEach((color, i) => {
        color_array[i] = m.hexToRgb(color);
      });

      // processing
      for (let y = 0, i = 0; y < image_data.height; y++) {
        for (let x = 0; x < image_data.width; x++, i += 4) {
          // todo: optimize

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

          let pixel = m.getPixelDataRGB(image_data, x, y);

          let np = m.nearestPixel2(
            pixel,
            color_array,
            config.gray_scale_nearest_pixel
          );
          // let np = m.nearestPixel(pixel, pallette);

          if (config.dithering == "") {
            // quantization
            // setPixelDataRGB(image_data, x, y, np);
            m.setPixelDataRaw(image_data, i, np.r);
            m.setPixelDataRaw(image_data, i + 1, np.g);
            m.setPixelDataRaw(image_data, i + 2, np.b);
          } else if (config.dithering == "fs") {
            // TODO: investigate if quantization error that is pushed to other pixels are limited by 8 bits 0-255
            // causing the value to clamp
            // NOTE: it seems to be clamped because the underlying
            // array is Uint8ClampedArray

            // quantization
            // setPixelDataRGB(image_data, x, y, np);
            m.setPixelDataRaw(image_data, i, np.r);
            m.setPixelDataRaw(image_data, i + 1, np.g);
            m.setPixelDataRaw(image_data, i + 2, np.b);

            let quant_error = m.pixelDiff(pixel, np);

            if (x < image_data.width - 1) {
              let old_pixel = m.getPixelDataRGB(image_data, x + 1, y);

              if (config.cap) {
                m.setPixelDataRGB(image_data, x + 1, y, {
                  r: m.clamp(0, 255, old_pixel.r + (quant_error.r * 7) / 16),
                  g: m.clamp(0, 255, old_pixel.g + (quant_error.g * 7) / 16),
                  b: m.clamp(0, 255, old_pixel.b + (quant_error.b * 7) / 16),
                });
              } else {
                m.setPixelDataRGB(image_data, x + 1, y, {
                  r: old_pixel.r + (quant_error.r * 7) / 16,
                  g: old_pixel.g + (quant_error.g * 7) / 16,
                  b: old_pixel.b + (quant_error.b * 7) / 16,
                });
              }
            }

            if (y < image_data.height - 1) {
              if (x > 0) {
                let old_pixel = m.getPixelDataRGB(image_data, x - 1, y + 1);

                if (config.cap) {
                  m.setPixelDataRGB(image_data, x - 1, y + 1, {
                    r: m.clamp(0, 255, old_pixel.r + (quant_error.r * 3) / 16),
                    g: m.clamp(0, 255, old_pixel.g + (quant_error.g * 3) / 16),
                    b: m.clamp(0, 255, old_pixel.b + (quant_error.b * 3) / 16),
                  });
                } else {
                  m.setPixelDataRGB(image_data, x - 1, y + 1, {
                    r: old_pixel.r + (quant_error.r * 3) / 16,
                    g: old_pixel.g + (quant_error.g * 3) / 16,
                    b: old_pixel.b + (quant_error.b * 3) / 16,
                  });
                }
              }

              let old_pixel = m.getPixelDataRGB(image_data, x, y + 1);

              if (config.cap) {
                m.setPixelDataRGB(image_data, x, y + 1, {
                  r: m.clamp(0, 255, old_pixel.r + (quant_error.r * 5) / 16),
                  g: m.clamp(0, 255, old_pixel.g + (quant_error.g * 5) / 16),
                  b: m.clamp(0, 255, old_pixel.b + (quant_error.b * 5) / 16),
                });
              } else {
                m.setPixelDataRGB(image_data, x, y + 1, {
                  r: old_pixel.r + (quant_error.r * 5) / 16,
                  g: old_pixel.g + (quant_error.g * 5) / 16,
                  b: old_pixel.b + (quant_error.b * 5) / 16,
                });
              }

              if (x < image_data.width - 1) {
                let old_pixel = m.getPixelDataRGB(image_data, x + 1, y + 1);

                if (config.cap) {
                  m.setPixelDataRGB(image_data, x + 1, y + 1, {
                    r: m.clamp(0, 255, old_pixel.r + (quant_error.r * 1) / 16),
                    g: m.clamp(0, 255, old_pixel.g + (quant_error.g * 1) / 16),
                    b: m.clamp(0, 255, old_pixel.b + (quant_error.b * 1) / 16),
                  });
                } else {
                  m.setPixelDataRGB(image_data, x + 1, y + 1, {
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

            let old_pixel = m.getPixelDataRGB(image_data, x, y);

            let change =
              (255 / N) *
              (config.matrix[x % config.matrix[0].length][
                y % config.matrix.length
              ] -
                0.5);

            let new_pixel = m.nearestPixel2(
              {
                r: old_pixel.r + change,
                g: old_pixel.g + change,
                b: old_pixel.b + change,
              },
              color_array,
              config.gray_scale_nearest_pixel
            );

            // setPixelDataRGB(image_data, x, y, new_pixel);
            m.setPixelDataRaw(image_data, i, new_pixel.r);
            m.setPixelDataRaw(image_data, i + 1, new_pixel.g);
            m.setPixelDataRaw(image_data, i + 2, new_pixel.b);
          }
        }
      } // end 2d for loop

      ctx.putImageData(image_data, 0, 0);

      if (config.cache) {
        let tocache = new ImageData(
          new Uint8ClampedArray(image_data.data),
          image_data.width,
          image_data.height
        );

        console.log("adding", thehash, "to cache");

        cache[thehash] = {
          data: tocache,
          params: Object.assign({}, params),
          config: Object.assign({}, config),
        };
      }
    }

    if (config.show_rubiks) {
      let rctx = rubiks_canvas.getContext("2d");
      let ctx = output_canvas.getContext("2d");
      let image_data = ctx.getImageData(
        0,
        0,
        ui.resizedwidth,
        ui.resizedheight
      );

      rctx.imageSmoothingEnabled = false;
      rctx.drawImage(
        output_canvas,
        0,
        0,
        ui.resizedwidth * config.rubiks_scale,
        ui.resizedheight * config.rubiks_scale
      );

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
          }}>Output Image</button
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
        <button
          class:bg-gray-400={ui.current == "mockup"}
          class="h-10 p-2 rounded-lg border-solid border-2 text-center"
          on:click={() => {
            toggleUI("mockup");
          }}>Mock Up</button
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
              <Toggle text="Cache" bind:checked={config.cache} />
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

    {#if ui.current == "mockup"}
      <div class="bg-white text-black p-2">
        <div
          style="height: 100px;"
          ondragover="return false"
          on:drop={handleMockupDrop}
          on:dragenter={handleMockupDragEnter}
          on:dragleave={handleMockupDragLeave}
          id="mockup_drop_zone"
          class="bg-red-500 h-full p-4"
        >
          {#if !ui.mockup_hovering}
            Drop Mock Up Image here
          {:else}
            Release to load file
          {/if}
        </div>

        Mock Up Pixel
        <input type="range" bind:value={config.mockup_pixel_size} min="1" max="25" />
        <span>{config.mockup_pixel_size}</span>

        <br>
        Mock Up Position
        <input type="range" bind:value={config.mockup_x} min="-500" max="500" />
        <span>{config.mockup_x}</span>

        <input type="range" bind:value={config.mockup_y} min="-500" max="500" />
        <span>{config.mockup_y}</span>
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
            <div style="position: relative" id="canvas_wrapper">
              <canvas
                style="position: absolute;"
                class:shown={config.has_mockup}
                id="bgcanvas"
                width={ui.mockupwidth}
                height={ui.mockupheight}
                bind:this={bgcanvas}
                bind:clientHeight={bgcanvas_clientHeight}
                bind:clientWidth={bgcanvas_clientWidth}
              />
              
              <!--
                top = (pos y / 100) x (canvas height) - (half of canvas height)
                left = (pos x / 100) x (canvas width) - (half of canvas width)
              -->
              <canvas
                style="position: absolute;
                top: {(bgcanvas_clientHeight / 2 - (ui.resizedheight * config.mockup_pixel_size * bgcanvas_clientWidth / ui.mockupwidth / 2)) + (config.mockup_y*bgcanvas_clientWidth/ui.mockupwidth)}px;
                left: {(bgcanvas_clientWidth / 2 - (ui.resizedwidth * config.mockup_pixel_size * bgcanvas_clientWidth / ui.mockupwidth / 2)) + (config.mockup_x*bgcanvas_clientWidth/ui.mockupwidth)}px;
                width: {ui.resizedwidth * config.mockup_pixel_size * bgcanvas_clientWidth / ui.mockupwidth}px"
                class:shown={image_loaded && config.show_rubiks}
                class:pixelated={config.pixelated}
                id="rubiks_canvas"
                width={ui.resizedwidth *
                  config.rubiks_scale}
                height={ui.resizedheight *
                  config.rubiks_scale}
                bind:this={rubiks_canvas}
              />
            </div>
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

      WIDTH: {bgcanvas_clientWidth}
      HEIGHT: {bgcanvas_clientHeight}
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
  #bgcanvas,
  #rubiks_canvas {
    display: none;
  }
  .small {
    max-width: 10%;
    display: inline;
  }
  #canvas.shown,
  #bgcanvas.shown,
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
