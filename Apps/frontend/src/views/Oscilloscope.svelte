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
  let packageCounterPreCompute = 0
  let pps = 0

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
    console.log("Connecting to :" + import.meta.env.VITE_BACKEND_WEBSOCKET)
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
    packageCounterPreCompute += 1

    let samples = new Float64Array(messageEvent.data);
    for (let i = 0; i < samples.length; i += NUM_CHANNELS) {
      let sample = new Float64Array(samples.slice(i, i + NUM_CHANNELS))

      waveElement.updateBuffer(sample);
      indicatorElement.update(sample);
    }
  };

  const socketOnClose = (closeEvent) => logSocketCloseCode(closeEvent.code);

  /**
  * Calculates the packages per second received on the web socket
  */
  function calculatePackagesPerSecond(){
    pps = packageCounterPreCompute
    packageCounterPreCompute = 0;     
  }

  setInterval(function(){ calculatePackagesPerSecond() }, 1000);
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
                indicatorElement.startStopChannelI(index, hasStarted);
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
                indicatorElement.updateChannelOffsetY(index, offsetY);
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
                indicatorElement.updateChannelScaling(index, scaling);
              }}
            />
          {/each}
        </div>
      </div>
    </div>
    <div style="grid-column: 3; margin: 1rem">
      PPS: {pps*50}
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
