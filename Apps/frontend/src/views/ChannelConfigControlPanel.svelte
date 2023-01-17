<script>
  import ChannelConfigPopup from "./ChannelConfigPopup.svelte";
  import { LABEL_BUTTON_MANAGE_CHANNEL_CONFIG } from "../labels";
  import { presetPopupOpen } from "../stores";
  import { fly } from "svelte/transition";
  import { getAllChannelConfig } from "../rest/ChannelConfigController";
  import { availableChannelConfigPresets } from "../stores";

  $: panelHeight = 0;
  export let waveElement;
  export let indicatorElement;

  async function loadAllChannelConfigPresets() {
    var response = await getAllChannelConfig();
    if (response !== undefined) availableChannelConfigPresets.set(response);
  }

  function showPopup() {
    $presetPopupOpen = true;
    loadAllChannelConfigPresets();
  }
</script>

{#if $presetPopupOpen}
  <nav
    class="control-panel--bottom"
    transition:fly={{ y: panelHeight, opacity: 1 }}
    bind:clientHeight={panelHeight}
    data-cy="expanded-preset-popup"
  >
    <ChannelConfigPopup {waveElement} {indicatorElement} />
  </nav>
{/if}

<div>
  <button id="managePresets" on:click={showPopup}
    >{LABEL_BUTTON_MANAGE_CHANNEL_CONFIG}</button
  >
</div>
