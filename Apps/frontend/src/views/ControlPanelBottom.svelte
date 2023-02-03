<script>
  import Slider from "../components/Slider.svelte";
  import StartStopSwitch from "../components/StartStopSwitch.svelte";
  import ThicknessSwitch from "../components/ThicknessSwitch.svelte";
  import ControlColumnHeader from "../components/ControlColumnHeader.svelte";
  import {
    MAX_AMPLITUDE,
    MAX_SWEEP_SLIDER_VALUE,
    MIN_AMPLITUDE,
    MIN_CONTROL_PANEL_BOTTOM_HEIGHT,
    MIN_SWEEP_SLIDER_VALUE,
    NUM_CHANNELS,
    TIME_PER_DIV,
  } from "../const";
  import {
    amplitudeAdjustment,
    expandedPanelOpen,
    offsetAdjustment,
    timeSweep,
  } from "../stores";
  import {
    TOOLTIP_CONTROL_HEADER_ONOFF,
    TOOLTIP_CONTROL_HEADER_THICKNESS,
    TOOLTIP_CONTROL_HEADER_OFFSET,
    TOOLTIP_CONTROL_HEADER_TIMESWEEP,
    TOOLTIP_CONTROL_HEADER_AMPLITUDE,
  } from "../labels";
  import { computeDisplayDeltaFromTimeSweep } from "../helper";

  export let controlPanelBottomHeight = 0;

  const computeDisplaySpeed = (value) => {
    let delta = computeDisplayDeltaFromTimeSweep(value);
    return (TIME_PER_DIV / delta).toFixed(2) + " s/div";
  };
</script>

<!--This is the control panel that appears below the main control panel. It is only visible when the user clicks on the "Control Panel" button.-->
<table>
  <th>
    {#if $expandedPanelOpen && controlPanelBottomHeight <= MIN_CONTROL_PANEL_BOTTOM_HEIGHT}
      <button
        class="icon-button icon-button--small icon--close"
        on:click={() => ($expandedPanelOpen = false)}
        data-cy="expanded-control-panel-close-button"
      />
    {:else}
      Channel
    {/if}
  </th>
  <th
    ><ControlColumnHeader
      label="Start/Stop"
      icon="startstop"
      tooltip={TOOLTIP_CONTROL_HEADER_ONOFF}
    /></th
  >
  <th
    ><ControlColumnHeader
      label="Thickness"
      icon="thickness"
      tooltip={TOOLTIP_CONTROL_HEADER_THICKNESS}
    /></th
  >
  <th
    ><ControlColumnHeader
      label="Offset"
      icon="offset"
      tooltip={TOOLTIP_CONTROL_HEADER_OFFSET}
    /></th
  >
  <th
    ><ControlColumnHeader
      label="Time Sweep"
      icon="timesweep"
      tooltip={TOOLTIP_CONTROL_HEADER_TIMESWEEP}
    /></th
  >
  <th
    ><ControlColumnHeader
      label="Amplitude"
      icon="amplitude"
      tooltip={TOOLTIP_CONTROL_HEADER_AMPLITUDE}
    /></th
  >
  <tr>
    <td> Common </td>
    <td><!--Placeholder--></td>
    <td><!--Placeholder--></td>
    <td><!--Placeholder--></td>
    <td>
      <!--Common TimeSweep Slider-->
      <Slider
        className="control-panel--entry"
        onInput={() => {
          for (let index = 0; index < NUM_CHANNELS; index++) {
            $timeSweep[index] = $timeSweep[NUM_CHANNELS];
          }
        }}
        bind:value={$timeSweep[NUM_CHANNELS]}
        min={MIN_SWEEP_SLIDER_VALUE}
        max={MAX_SWEEP_SLIDER_VALUE}
        dataCy={`timesweepSlider-${NUM_CHANNELS}`}
        calculateDisplayedValue={computeDisplaySpeed}
      />
    </td>
    <td><!--Placeholder--></td>
  </tr>
  {#each { length: NUM_CHANNELS } as _, index}
    <tr>
      <td>Ch. {index + 1}</td>
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
          calculateDisplayedValue={computeDisplaySpeed}
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
