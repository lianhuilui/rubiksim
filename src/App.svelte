<script>
  import { afterUpdate } from "svelte";
  import { object_without_properties } from "svelte/internal";
  import Toggle from "./lib/Toggle.svelte";
  import PalletteButton from "./lib/PalletteButton.svelte";
  import { tick } from "svelte";

  let image_loaded = false;

  let pallettes = [
    { name: "rgb", colors: "#f00,#0f0,#00f" },
    { name: "cmyk", colors: "#000,#0ff,#f0f,#ff0" },
    { name: "b&w", colors: "#000,#fff" },
  ];

  let config = {
    pixelated: false,
    width: 0,
    max_width: 999,
    show_grid: false,
    black_grid: false,
    pallette: pallettes[0].colors,
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
  };

  /* bound variables */
  let canvas;
  let resized_canvas;

  let imageloaded = false;

  let canvaswidth = 100;
  let canvasheight = 100;

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
      canvasheight = originalImage.height;
      canvaswidth = originalImage.width;

      config.width = Math.min(99, canvaswidth);
      config.max_width = Math.min(canvaswidth, 999);

      image_loaded = true;
      imageloaded = true;

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
      let ctx = resized_canvas.getContext("2d");

      let height = (canvasheight/canvaswidth) * config.width;
      ui.resizedwidth = config.width;
      ui.resizedheight = height;

      await tick();
      ctx.drawImage(
        originalImage,
        0,
        0,
        parseInt(ui.resizedwidth),
        parseInt(ui.resizedheight)
      );
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
          class:bg-gray-400={ui.current == "grid"}
          class="h-10 p-2 rounded-lg border-solid border-2 text-center"
          on:click={() => {
            toggleUI("grid");
          }}>Grid</button
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

        <div class="spacer" />

        <Toggle bind:checked={ui.show_debug} text="debug" />
      </div>
    </div>

    {#if ui.current == "img"}
      <div class="bg-white text-black p-2">
        <div class="flex flex-col">
          <div class="flex justify-around">
            <div>
              <span>Width</span>
              <input
                type="range"
                bind:value={config.width}
                min="3"
                max={config.max_width}
                step="3"
              />
              <span>{config.width}</span>
            </div>
          </div>
          <div class="flex">
            <div class="d-block">
              <Toggle text="Pixelated" bind:checked={config.pixelated} />
            </div>
          </div>
        </div>
      </div>
    {/if}

    {#if ui.current == "grid"}
      <div class="bg-white text-black p-2">
        <div class="flex">
          <div>
            <Toggle text="Show Grid" bind:checked={config.show_grid} />
          </div>
          <div>
            <Toggle text="Black Grid" bind:checked={config.black_grid} />
          </div>
        </div>
      </div>
    {/if}

    {#if ui.current == "processing"}
      <div class="bg-white text-black p-2">
        <div class="flex">
          <div>
            <Toggle text="Dithering" bind:checked={config.dithering} />
          </div>
          {#if config.dithering}
            <div>
              <Toggle
                text="Floyd Steinberg"
                bind:checked={config.dithering_floyd_steinberg}
              />
            </div>
          {/if}
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
              class:shown={image_loaded}
              class:pixelated={config.pixelated}
              id="canvas"
              width={canvaswidth}
              height={canvasheight}
              bind:this={canvas}
            />
            <canvas
              class:shown={image_loaded}
              class:pixelated={config.pixelated}
              id="resized_canvas"
              width={ui.resizedwidth}
              height={ui.resizedheight}
              bind:this={resized_canvas}
            />
          </div>
        </div>

        {#if !imageloaded && ui.hovering}
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
  #canvas {
    display: none;
    max-width: 10%;
  }
  #resized_canvas {
    margin: 0 auto;
    /* width: 100%; */
  }
  #canvas.shown {
    display: block;
  }
  .pixelated {
    image-rendering: pixelated;
  }
  canvas {
    border: 1px solid black;
    max-width: 100%;
    max-height: 100%;
  }
</style>
