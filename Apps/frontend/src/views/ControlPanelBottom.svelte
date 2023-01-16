<script>
  import Slider from "../components/Slider.svelte";
  import OnOffButton from "../components/OnOffButton.svelte";
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
  import { expandedPanelOpen, channelConfig } from "../stores";

  export let waveElement;
  export let indicatorElement;
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
        <OnOffButton
          channel={index}
          on:startStop={async (event) => {
            let hasStarted = event.detail.buttonValue;
            waveElement.startStopChannelI(index, hasStarted);
            indicatorElement.startStopChannelI(index, hasStarted);
          }}
        />
      </td>
      <td>
        <ThicknessSwitch
          channel={index}
          onClick={(isThick) => {
            waveElement.updateChannelThickness(index, !isThick);
          }}
        />
      </td>
      <td>
        <Slider
          className="control-panel--entry"
          onInput={(offsetY) => {
            waveElement.updateChannelOffsetY(index, offsetY);
            indicatorElement.updateChannelOffsetY(index, offsetY);
          }}
          value={0}
          min={-1.0}
          max={1.0}
          step={0.01}
          dataCy={`offsetSlider-${index}`}
        />
      </td>
      <td>
        <Slider
          className="control-panel--entry"
          onInput={() => {}}
          min={MIN_SWEEP_SLIDER_VALUE}
          max={MAX_SWEEP_SLIDER_VALUE}
          bind:value={$channelConfig[index].sweepSpeed}
          dataCy={`timesweepSlider-${index}`}
        />
      </td>
      <td>
        <Slider
          className="control-panel--entry"
          onInput={(value) => {
            waveElement.updateChannelScaling(index, value);
            indicatorElement.updateChannelScaling(index, value);
          }}
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
