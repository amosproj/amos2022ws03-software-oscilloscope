<script>
  import { onMount, onDestroy } from "svelte";
  import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    NUM_CHANNELS,
    INDICATOR_SECTION_WIDTH,
  } from "../const";
  import CoordinateSystem from "../components/CoordinateSystem.svelte";
  import Waves from "../components/Waves.svelte";
  import Indicators from "./Indicators.svelte";
  import { logSocketCloseCode } from "../helper";
  import WaveControls from "../components/WaveControls.svelte";

  let waveElement;
  let scalesY = Array(NUM_CHANNELS).fill(1); // 1V per horizontal line
  let indicatorElement;
  let socket;

  let isEnabled = false;

  // ----- Svelte lifecycle hooks -----
  onMount(() => {
    socket = createSocket();

    socket.onmessage = socketOnMessage;
    socket.onclose = socketOnClose;
  });

  onDestroy(() => {
    socket.close();
  });

  // -----business logic functions -----
  const createSocket = () => {
    let socket = new WebSocket(import.meta.env.VITE_BACKEND_WEBSOCKET);
    socket.binaryType = "arraybuffer";

    return socket;
  };

  const socketOnMessage = (messageEvent) => {
    let samples = new Float64Array(messageEvent.data);
    if (!isEnabled) return;
    waveElement.updateBuffer(samples);
    indicatorElement.update(samples);
  };

  const socketOnClose = (closeEvent) => logSocketCloseCode(closeEvent.code);
</script>

<div
  class="wrapper"
  style="--canvas-width: {CANVAS_WIDTH}px; --canvas-height: {CANVAS_HEIGHT}px; --indicators-width: {INDICATOR_SECTION_WIDTH}px"
  data-cy="oscilloscope"
>
  <div class="grid-container">
    <div class="indicators">
      <Indicators bind:this={indicatorElement} scaleY={Math.max(...scalesY)} />
    </div>
    <div class="oscilloscope">
      <div class="coordinate-system">
        <CoordinateSystem scaleY={Math.max(...scalesY)} />
      </div>
      <div class="waves">
        <Waves bind:this={waveElement} {scalesY} />
      </div>
    </div>
    <WaveControls bind:isEnabled bind:waveElement bind:indicatorElement />
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    justify-content: center;
  }

  .grid-container {
    display: grid;
    grid-template-columns: var(--indicators-width) var(--canvas-width);
  }
  .indicators {
    grid-column: 1;
  }

  .oscilloscope {
    grid-column: 2;
    position: relative;
  }

  .oscilloscope .coordinate-system,
  .oscilloscope .waves {
    position: absolute;
    inset: 0;
  }
</style>
