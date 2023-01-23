<script>
  import { osciEnabled, isGND } from "../stores";
  import OnOffButton from "../components/OnOffButton.svelte";
  import ResetButton from "../components/ResetButton.svelte";
  import GNDButton from "../components/GNDButton.svelte";
  import DistributeOffsetButton from "../components/DistributeOffsetButton.svelte";
  import SettingsButton from "../components/SettingsButton.svelte";

  let onOffButton;
  export let lineIndicatorElement;
  export let textIndicatorElement;
  export let waveElement;
</script>

<OnOffButton
  on:switch-plot-enabled={(e) => {
    $osciEnabled = e.detail.enabled;
  }}
  bind:this={onOffButton}
/>
<ResetButton
  on:reset={() => {
    // if oscilloscope is running, click stop button
    if ($osciEnabled) {
      onOffButton.click();
    }
    // clear canvas and indicators
    lineIndicatorElement.reset();
    textIndicatorElement.reset();
    waveElement.resetPlot();
  }}
/>
<GNDButton
  on:set-gnd={(e) => {
    $isGND = e.detail.down;
  }}
/>
<DistributeOffsetButton />
<SettingsButton />
