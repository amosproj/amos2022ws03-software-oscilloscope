<script>
  import AmplitudeSlider from "../components/AmplitudeSlider.svelte";
  import OffsetSlider from "../components/OffsetSlider.svelte";
  import ThicknessSwitch from "../components/ThicknessSwitch.svelte";
  import TimeSweepSlider from "../components/TimeSweepSlider.svelte";
  import { NUM_CHANNELS } from "../const";

  export let waveElement;
  export let indicatorElement;
</script>

<div class="control-panel--bottom_thickness">
  Thickness
  <div class="control-panel--placeholder" />
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
<div class="control-panel--bottom_offset">
  Offset
  <div class="control-panel--placeholder" />
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
<div class="control-panel--bottom_time-sweep">
  Time Sweep
  <small>Common</small>
  <TimeSweepSlider channel={NUM_CHANNELS + 1} isCommon={true} />
  <small>Channels</small>
  {#each { length: NUM_CHANNELS } as _, index}
    <TimeSweepSlider channel={index} />
  {/each}
</div>
<div class="control-panel--bottom_amplitude">
  Amplitude
  <div class="control-panel--placeholder" />
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
