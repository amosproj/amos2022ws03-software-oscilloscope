<script>
  import Slider from "../components/Slider.svelte";
  import StartStopSwitch from "../components/StartStopSwitch.svelte";
  import ThicknessSwitch from "../components/ThicknessSwitch.svelte";
  import TimeSweepSlider from "../components/TimeSweepSlider.svelte";
  import {
    MAX_AMPLITUDE,
    MAX_SWEEP_SLIDER_VALUE,
    MIN_AMPLITUDE,
    MIN_CONTROL_PANEL_BOTTOM_HEIGHT,
    MIN_SWEEP_SLIDER_VALUE,
    NUM_CHANNELS,
  } from "../const";
  import {
    amplitudeAdjustment,
    expandedPanelOpen,
    offsetAdjustment,
    timeSweep,
  } from "../stores";

  export let controlPanelBottomHeight = 0;
</script>

<table>
  <th>
    {#if $expandedPanelOpen && controlPanelBottomHeight <= MIN_CONTROL_PANEL_BOTTOM_HEIGHT}
      <button
        class="icon-button icon-button--small mui-icon--close"
        on:click={() => ($expandedPanelOpen = false)}
        data-cy="expanded-control-panel-close-button"
      />
    {/if}
  </th>
  <th>Start/Stop</th>
  <th>Thickness</th>
  <th>Offset</th>
  <th>Time Sweep</th>
  <th>Amplitude</th>
  <tr>
    <td> Common </td>
    <td><!--Placeholder--></td>
    <td><!--Placeholder--></td>
    <td><!--Placeholder--></td>
    <td>
      <TimeSweepSlider channel={NUM_CHANNELS + 1} isCommon={true} />
    </td>
    <td><!--Placeholder--></td>
  </tr>
  {#each { length: NUM_CHANNELS } as _, index}
    <tr>
      <td>Ch. {index}</td>
      <td>
        <StartStopSwitch channel={index} />
      </td>
      <td>
        <ThicknessSwitch channel={index} />
      </td>
      <td>
        <Slider
          className="control-panel--entry"
          bind:value={$offsetAdjustment[index]}
          min={-1.0}
          max={1.0}
          step={0.01}
          dataCy={`offsetSlider-${index}`}
        />
      </td>
      <td>
        <Slider
          className="control-panel--entry"
          bind:value={$timeSweep[index]}
          min={MIN_SWEEP_SLIDER_VALUE}
          max={MAX_SWEEP_SLIDER_VALUE}
          dataCy={`timesweepSlider-${index}`}
        />
      </td>
      <td>
        <Slider
          className="control-panel--entry"
          bind:value={$amplitudeAdjustment[index]}
          min={MIN_AMPLITUDE}
          max={MAX_AMPLITUDE}
          calculateDisplayedValue={(value) => (1 / value).toFixed(2)}
          dataCy={`amplitudeSlider-${index}`}
        />
      </td>
    </tr>
  {/each}
  <tr />
</table>
