<script>
  import { onMount, onDestroy } from "svelte";
  import { channelConfig } from "../stores";
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
  import ThicknessSwitch from "../components/ThicknessSwitch.svelte";
  import ChannelConfigPreset from "../components/ChannelConfigPreset.svelte";
  import { EVENT_LOADED_CHANNEL_CONFIG } from "../events";

  let waveElement;
  let scalesY = Array(NUM_CHANNELS).fill(1); // 1V per horizontal line
  let indicatorElement;
  /** Websocket for connection to backend */
  let socket;
  /** Flag for enabled and updating canvas */
  let isEnabled = false;
  /** Number of received packages before they are computed */
  let packageCounterPreCompute = 0;
  /** Number of packages per second */
  let pps = 0;
  /** Duration of computing and updating one package */
  let packageComputeTime = 0;
  /** Duration of computing and updating one channel window within the package */
  let windowComputeTime = 0;
  /** Number of chunks in a package */
  let chunkNumber = 0;

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
    console.log("Connecting to :" + import.meta.env.VITE_BACKEND_WEBSOCKET);
    let socket = new WebSocket(import.meta.env.VITE_BACKEND_WEBSOCKET);
    socket.binaryType = "arraybuffer";

    return socket;
  };

  /**
   * On receiving a socket message, update buffer of waves.
   *
   * @param {MessageEvent} messageEvent - has poperty (Float64Array) data
   */
  const socketOnMessage = (messageEvent) => {
    if (!isEnabled) return;
    packageCounterPreCompute += 1;

    var chunkCounter = 0;
    var startPackage = window.performance.now();

    let samples = new Float64Array(messageEvent.data);
    for (let index = 0; index < samples.length; index += NUM_CHANNELS) {
      var startWindow = window.performance.now();
      waveElement.updateBuffer(samples, index, index + NUM_CHANNELS);
      if (index % 1000 == 0) indicatorElement.update(samples, index);
      var endWindow = window.performance.now();

      ++chunkCounter;
      updateWindowComputeTime(startWindow, endWindow);
    }

    var endPackage = window.performance.now();
    updatePackageComputeTime(startPackage, endPackage);
    chunkNumber = chunkCounter;
  };

  const socketOnClose = (closeEvent) => logSocketCloseCode(closeEvent.code);

  function updateChannelConfig() {
    for (let index = 0; index < NUM_CHANNELS; index++) {
      /* StartStop */
      waveElement.startStopChannelI(index, $channelConfig[index].enabled);
      indicatorElement.startStopChannelI(index, $channelConfig[index].enabled);

      /* Thickness */
      waveElement.updateChannelThickness(
        index,
        $channelConfig[index].thickness
      );

      /* Offset */
      waveElement.updateChannelOffsetY(index, $channelConfig[index].offset);
      indicatorElement.updateChannelOffsetY(
        index,
        $channelConfig[index].offset
      );

      /* Sweepseed is automatically updated */

      /* Amplitude */
      waveElement.updateChannelScaling(index, $channelConfig[index].amplitude);
      indicatorElement.updateChannelScaling(
        index,
        $channelConfig[index].amplitude
      );
    }
  }

  /**
   * Calculates the packages per second received on the web socket
   */
  function calculatePackagesPerSecond() {
    pps = packageCounterPreCompute;
    packageCounterPreCompute = 0;
  }

  /**
   * Calculate the duration between start and end of
   * TODO implement historic average over e.g. last 20 packages
   * @param start start timestamp
   * @param end end timestamp
   */
  function updatePackageComputeTime(start, end) {
    packageComputeTime = end - start;
  }
  /**
   * Calculate the duration between start and end of single index windows on a package
   * TODO implement historic average over e.g. last 20 packages
   * @param start start timestamp
   * @param end end timestamp
   */
  function updateWindowComputeTime(start, end) {
    windowComputeTime = end - start;
  }

  setInterval(function () {
    calculatePackagesPerSecond();
  }, 1000);
</script>

<div
  class="wrapper"
  style="--canvas-width: 1000px; --canvas-height: {CANVAS_HEIGHT}px; --indicators-width: {INDICATOR_SECTION_WIDTH}px"
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
      <div class="control-panel">
        <div class="switch">
          Start/Stop
          <div class="placeholder" />
          <br />
          <small>Channels</small>
          {#each { length: NUM_CHANNELS } as _, index}
            <StartStopButton
              channel_id={index}
              on:startStop={async (event) => {
                let hasStarted = event.detail.buttonValue;
                waveElement.startStopChannelI(index, hasStarted);
                indicatorElement.startStopChannelI(index, hasStarted);
              }}
            />
          {/each}
        </div>
        <div class="switch">
          Thickness
          <div class="placeholder" />
          <br />
          <small>Channels</small>
          {#each { length: NUM_CHANNELS } as _, index}
            <ThicknessSwitch
              channel={index}
              onClick={(isThick) => {
                waveElement.updateChannelThickness(index, !isThick);
              }}
            />
          {/each}
        </div>
        <div class="slider">
          Offset
          <div class="placeholder" />
          <br />
          <small>Channels</small>
          {#each { length: NUM_CHANNELS } as _, index}
            <OffsetSlider
              onInput={(offsetY) => {
                waveElement.updateChannelOffsetY(index, offsetY);
                indicatorElement.updateChannelOffsetY(index, offsetY);
              }}
            />
          {/each}
        </div>
        <div class="slider">
          Time Sweep
          <br />
          <small>Common</small>
          <TimeSweepSlider channel={NUM_CHANNELS + 1} isCommon={true} />
          <small>Channels</small>
          {#each { length: NUM_CHANNELS } as _, index}
            <TimeSweepSlider channel={index} />
          {/each}
        </div>
        <div class="slider">
          Amplitude
          <div class="placeholder" />
          <br />
          <small>Channels</small>
          {#each { length: NUM_CHANNELS } as _, index}
            <AmplitudeSlider
              channel={index}
              onInput={(scaling) => {
                waveElement.updateChannelScaling(index, scaling);
                indicatorElement.updateChannelScaling(index, scaling);
              }}
            />
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
<div style="grid-column: 3; margin: 1rem; text-align: end">
  <p>
    Package Size: {chunkNumber} | PPS: {pps * chunkNumber} | Updatetime/Window: {windowComputeTime.toFixed(
      5
    )} ms | Updatetime/Package: {packageComputeTime.toFixed(5)} ms
  </p>
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
