<script>
  import { onMount, onDestroy } from "svelte";
  import CoordinateSystem from "./CoordinateSystem.svelte";
  import SineWave from "./SineWave.svelte";
  import { CANVAS_HEIGHT, CANVAS_WIDTH, NUM_CHANNELS } from "../const";
  import Indicators from "./Indicators.svelte";
  import OnOffButton from "./OnOffButton.svelte";
  import TimeSweepSlider from "./TimeSweepSlider.svelte";

  let waveElement;
  let indicatorElement;
  let scaleY = 0.5; // 1V per horizontal line
  let socket;

  let isEnabled = false;

  onMount(() => {
    socket = new WebSocket("ws://localhost:9000");
    socket.binaryType = "arraybuffer";

    socket.onopen = () => {
      console.log("Socket opened");
    };

    socket.onmessage = (message) => {
      let samples = new Float64Array(message.data);
      if (!isEnabled) return;
      waveElement.updateBuffer(samples);
      indicatorElement.update(samples);
    };
  });

  onDestroy(() => {
    socket.close();
  });
</script>

<div
  class="wrapper"
  style="--canvas-width: {CANVAS_WIDTH}px; --canvas-height: {CANVAS_HEIGHT}px"
  data-cy="oscilloscope"
>
  <div class="indicators">
    <Indicators bind:this={indicatorElement} {scaleY} />
  </div>
  <div class="stack coordinate-system">
    <CoordinateSystem yScale={scaleY} />
  </div>
  <div class="stack wave">
    <SineWave bind:this={waveElement} {scaleY} />
  </div>
</div>

<div class="wrapper" id="control-panel">
  <div id="btn-on-off">
    <OnOffButton
      on:switch-plot-enabled={(e) => {
        isEnabled = e.detail.enabled;
      }}
    />
  </div>
  <div id="slider-container">
    {#each Array(NUM_CHANNELS) as _, i}
      <div class="slider"><TimeSweepSlider channel={i} /></div>
    {/each}
  </div>
</div>

<style>
  .wrapper {
    position: relative;
    width: var(--canvas-width);
    height: var(--canvas-height);
    margin-left: auto;
    margin-right: auto;
  }
  .indicators {
    position: absolute;
    left: 0;
    transform: translateX(-100%);
  }
  .stack {
    position: absolute;
    inset: 0;
  }
  .coordinate-system {
    z-index: 0;
  }
  .wave {
    z-index: 1;
  }
  #control-panel {
    top: 500px;
  }
  #slider-container {
    display: table;
  }
  .slider {
    display: table-cell;
  }
</style>
