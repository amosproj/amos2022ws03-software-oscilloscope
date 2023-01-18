<script>
  import ChannelConfigControlPanel from "./ChannelConfigControlPanel.svelte";

  export let waveElement;
  export let indicatorElement;
</script>

<div>
  <ChannelConfigControlPanel {waveElement} {indicatorElement} />
</div>
