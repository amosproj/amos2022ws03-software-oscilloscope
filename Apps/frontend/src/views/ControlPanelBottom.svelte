<script>
  import Slider from "../components/Slider.svelte";
  import StartStopButton from "../components/StartStopButton.svelte";
  import ThicknessSwitch from "../components/ThicknessSwitch.svelte";
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
      <Slider
        className="control-panel--entry"
        onInput={() => {
          for (let index = 0; index < NUM_CHANNELS; index++) {
            $channelConfig[index].sweepSpeed =
              $channelConfig[NUM_CHANNELS].sweepSpeed;
          }
        }}
        bind:value={$channelConfig[NUM_CHANNELS].sweepSpeed}
        min={MIN_SWEEP_SLIDER_VALUE}
        max={MAX_SWEEP_SLIDER_VALUE}
        dataCy={`timesweepSlider-${NUM_CHANNELS}`}
      />
    </td>
    <td><!--Placeholder--></td>
  </tr>
  {#each { length: NUM_CHANNELS } as _, index}
    <tr>
      <td>Ch. {index}</td>
      <td>
        <StartStopButton
          channel={index}
          on:startStop={async (event) => {
            waveElement.startStopChannelI(index, !$channelConfig[index].enabled);
            indicatorElement.startStopChannelI(
              index,
              !$channelConfig[index].enabled
            );
          }}
        />
      </td>
      <td>
        <ThicknessSwitch
          channel={index}
          onClick={(isThick) => {
            waveElement.updateChannelThickness(
              index,
              !$channelConfig[index].thickness
            );
          }}
        />
      </td>
      <td>
        <Slider
          className="control-panel--entry"
          onInput={() => {
            waveElement.updateChannelOffsetY(
              index,
              $channelConfig[index].offset
            );
            indicatorElement.updateChannelOffsetY(
              index,
              $channelConfig[index].offset
            );
          }}
          bind:value={$channelConfig[index].offset}
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
          bind:value={$channelConfig[index].sweepSpeed}
          min={MIN_SWEEP_SLIDER_VALUE}
          max={MAX_SWEEP_SLIDER_VALUE}
          dataCy={`timesweepSlider-${index}`}
        />
      </td>
      <td>
        <Slider
          className="control-panel--entry"
          onInput={(value) => {
            waveElement.updateChannelScaling(
              index,
              $channelConfig[index].amplitude
            );
            indicatorElement.updateChannelScaling(
              index,
              $channelConfig[index].amplitude
            );
          }}
          bind:value={$channelConfig[index].amplitude}
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
