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
  import OffsetSlider from "../components/OffsetSlider.svelte";
  import StartStopButton from "./StartStopButton.svelte";
  import Indicators from "./Indicators.svelte";
  import OnOffButton from "../components/OnOffButton.svelte";
  import TimeSweepSlider from "../components/TimeSweepSlider.svelte";
  import ResetButton from "./ResetButton.svelte";
  import AmplitudeSlider from "./AmplitudeSlider.svelte";
  import { logSocketCloseCode } from "../helper";
  import ThicknessSwitch from "../components/ThicknessSwitch.svelte";

  let waveElement;
  let btnOnOff;
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
    <div class="controls">
      <div class="button-wrapper">
        <OnOffButton
          on:switch-plot-enabled={(e) => {
            isEnabled = e.detail.enabled;
          }}
          bind:this={btnOnOff}
        />
        <ResetButton
          on:reset={() => {
            // if oscilloscope is running, click stop button
            if (isEnabled) {
              btnOnOff.click();
            }
            // clear canvas and indicators
            indicatorElement.clearCanvas();
            waveElement.resetPlot();
          }}
        />
      </div>
      <div class="slider-wrapper">
        <div class="sliders">
          Start/Stop
          <br />
          {#each { length: NUM_CHANNELS } as _, index}
            <StartStopButton
              channel_id={index}
              on:startStop={async (event) => {
                let hasStarted = event.detail.buttonValue;
                waveElement.startStopChannelI(index, hasStarted);
              }}
            />
          {/each}
        </div>
        <div class="sliders">
          Thickness
          {#each { length: NUM_CHANNELS } as _, index}
            <ThicknessSwitch
              channel={index}
              onClick={(isThick) => {
                waveElement.updateChannelThickness(index, !isThick);
              }}
            />
          {/each}
        </div>
        <div class="sliders">
          Offset
          {#each { length: NUM_CHANNELS } as _, index}
            <OffsetSlider
              onInput={(offsetY) => {
                waveElement.updateChannelOffsetY(index, offsetY);
              }}
            />
          {/each}
        </div>
        <div class="sliders">
          Time Sweep
          {#each { length: NUM_CHANNELS } as _, index}
            <TimeSweepSlider channel={index} />
          {/each}
        </div>
        <div class="sliders">
          Amplitude
          {#each { length: NUM_CHANNELS } as _, index}
            <AmplitudeSlider
              channel={index}
              onInput={(scaling) => {
                waveElement.updateChannelScaling(index, scaling);
              }}
            />
          {/each}
        </div>
      </div>
    </div>
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
  .controls {
    grid-column: 2;
    justify-content: center;
  }

  .slider-wrapper {
    display: flex;
  }

  .button-wrapper {
    display: flex;
    margin: 1rem;
  }

  .sliders {
    width: 50%;
  }
</style>
