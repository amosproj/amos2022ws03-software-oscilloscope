<script>
  import { onMount, onDestroy } from "svelte";
  import CoordinateSystem from "./CoordinateSystem.svelte";
  import Waves from "./Waves.svelte";
  import OffsetSlider from "./OffsetSlider.svelte";
  import { CANVAS_HEIGHT, CANVAS_WIDTH, NUM_CHANNELS } from "../const";
  import Indicators from "./Indicators.svelte";
  import OnOffButton from "./OnOffButton.svelte";
  import TimeSweepSlider from "./TimeSweepSlider.svelte";


  let waveElement;
  let scalesY = Array(NUM_CHANNELS).fill(1); // 1V per horizontal line
  let indicatorElement;
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
    <Indicators bind:this={indicatorElement} scaleY={Math.max(...scalesY)} />
  </div>
  <div class="stack coordinate-system">
    <CoordinateSystem scaleY={Math.max(...scalesY)} />
  </div>
  <div class="stack wave">
    <Waves bind:this={waveElement} {scalesY} />
  </div>
  <div class="wrapper" id="control-panel">
    <div id="btn-on-off">
      <OnOffButton
        on:switch-plot-enabled={(e) => {
          isEnabled = e.detail.enabled;
        }}
      />
    </div>
    <div class="sliders-wrapper">
      {#each { length: NUM_CHANNELS } as _, index}
        <OffsetSlider
          onInput={(offsetY) => {
            waveElement.updateChannelOffsetY(index, offsetY);
          }}
        />
      {/each}
    </div>
    <div class="sliders-wrapper">
      {#each { length: NUM_CHANNELS } as _, i}
        <TimeSweepSlider channel={i} />
      {/each}
    </div>
  </div>
</div>

<style>
  .wrapper {
    position: relative;
    width: var(--canvas-width);
    height: var(--canvas-height);
    display: flex;
    margin: 0 2rem;
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
  .sliders-wrapper {
    float: right;
    margin-right: 2rem;
  }
</style>
