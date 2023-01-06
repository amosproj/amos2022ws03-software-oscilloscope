<script>
  import AmplitudeSlider from "../components/AmplitudeSlider.svelte";
  import OffsetSlider from "../components/OffsetSlider.svelte";
  import ThicknessSwitch from "../components/ThicknessSwitch.svelte";
  import TimeSweepSlider from "../components/TimeSweepSlider.svelte";
  import { NUM_CHANNELS } from "../const";
  import { expandedPanelOpen } from "../stores";

  export let waveElement;
  export let indicatorElement;
</script>

<table>
  <th>
    {#if $expandedPanelOpen}
      <button
        class="icon-button icon-button--small mui-icon--close"
        on:click={() => ($expandedPanelOpen = false)}
        data-cy="reset-button"
      />
    {/if}
  </th>
  <th>Thickness</th>
  <th>Offset</th>
  <th>Time Sweep</th>
  <th>Amplitude</th>
  <tr>
    <td> Common </td>
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
        <ThicknessSwitch
          channel={index}
          onClick={(isThick) => {
            waveElement.updateChannelThickness(index, !isThick);
          }}
        />
      </td>
      <td>
        <OffsetSlider
          onInput={(offsetY) => {
            waveElement.updateChannelOffsetY(index, offsetY);
            indicatorElement.updateChannelOffsetY(index, offsetY);
          }}
        />
      </td>
      <td>
        <TimeSweepSlider channel={index} />
      </td>
      <td>
        <AmplitudeSlider
          channel={index}
          onInput={(scaling) => {
            waveElement.updateChannelScaling(index, scaling);
            indicatorElement.updateChannelScaling(index, scaling);
          }}
        />
      </td>
    </tr>
  {/each}
  <tr />
</table>
