<script>
  import { MAX_AMPLITUDE, MIN_AMPLITUDE, NUM_CHANNELS } from "../const.js";
  import StartStopButton from "../views/StartStopButton.svelte";
  import OnOffButton from "./OnOffButton.svelte";
  import ResetButton from "../views/ResetButton.svelte";
  import Slider from "./Slider.svelte";
  import { timeSweep } from "../stores.js";
  import TimeSweepSlider from "./TimeSweepSlider.svelte";
  import ThicknessSwitch from "./ThicknessSwitch.svelte";
  import DistributeOffsetButton from "./DistributeOffsetButton.svelte";
  export let waveElement;
  export let isEnabled;
  export let indicatorElement;
  let btnOnOff;
</script>

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
    <DistributeOffsetButton
      on:distributeOffset={(event) => {
        let offset = event.detail.offset;
        // loop over all channels and set offset
        let offsetY = 1 - offset;
        for (let index = 0; index < NUM_CHANNELS; index++) {
          waveElement.updateChannelOffsetY(index, offsetY);
          indicatorElement.updateChannelOffsetY(index, offsetY);
          document.getElementById(`offsetSlider-${index}`).value = offsetY;
          offsetY -= offset;
        }
      }}
    />
  </div>
  <div class="slider-wrapper">
    <div class="sliders">
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
    <div class="sliders">
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
    <div class="sliders">
      Offset
      <div class="placeholder" />
      <br />
      <small>Channels</small>
      {#each { length: NUM_CHANNELS } as _, index}
        <Slider
          id={`offsetSlider-${index}`}
          onInput={(offsetY) => {
            waveElement.updateChannelOffsetY(index, offsetY);
            indicatorElement.updateChannelOffsetY(index, offsetY);
          }}
          value={0}
          min={-1.0}
          max={1.0}
          step={0.01}
        />
      {/each}
    </div>
    <div class="sliders">
      Time Sweep
      <br />
      <small>Common</small>
      <TimeSweepSlider channel={NUM_CHANNELS + 1} isCommon={true} />
      <small>Channels</small>
      {#each { length: NUM_CHANNELS } as _, index}
        <Slider
          id={`timesweepSlider-${index}`}
          bind:value={$timeSweep[index]}
          onInput={() => {}}
        />
      {/each}
    </div>
    <div class="sliders">
      Amplitude
      <div class="placeholder" />
      <br />
      <small>Channels</small>
      {#each { length: NUM_CHANNELS } as _, index}
        <Slider
          id={`amplitudeSlider-${index}`}
          className="amplitude-slider"
          onInput={(value) => {
            waveElement.updateChannelScaling(index, value);
            indicatorElement.updateChannelScaling(index, value);
          }}
          max={MAX_AMPLITUDE}
          min={MIN_AMPLITUDE}
          calcDisplayValue={(value) => (1 / value).toFixed(2)}
        />
      {/each}
    </div>
  </div>
</div>

<style>
  .amplitude-slider {
    display: grid;
    grid-template-columns: 129px auto;
    margin: 0 8%;
  }

  .controls {
    grid-column: 2;
    justify-content: center;
  }
  .slider-wrapper {
    display: flex;
  }

  .sliders {
    width: 50%;
  }

  .button-wrapper {
    display: flex;
    margin: 1rem;
  }

  .placeholder {
    height: 32.4833px;
  }
</style>
