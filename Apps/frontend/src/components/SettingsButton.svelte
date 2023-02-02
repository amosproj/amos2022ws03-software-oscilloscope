<script>
  import SettingsPopup from "../views/SettingsPopup.svelte";
  import { presetPopupOpen } from "../stores";
  import { fly } from "svelte/transition";
  import { getAllChannelConfig } from "../rest/ChannelConfigController";
  import { availableChannelConfigPresets } from "../stores";
  import { clickOutside } from "../helper";
  import { Tooltip } from "sveltestrap";
  import { TOOLTIP_BUTTON_SETTINGS } from "../labels";

  $: panelHeight = 0;

  async function loadAllChannelConfigPresets() {
    var response = await getAllChannelConfig();
    if (response !== undefined) availableChannelConfigPresets.set(response);
  }

  function showPopup() {
    $presetPopupOpen = true;
    loadAllChannelConfigPresets();
  }

  let button;
</script>

{#if $presetPopupOpen}
  <nav
    class="control-panel--bottom"
    transition:fly={{ y: panelHeight, opacity: 1 }}
    bind:clientHeight={panelHeight}
    use:clickOutside
    on:click-outside={() => ($presetPopupOpen = false)}
    data-cy="expanded-preset-popup"
  >
    <SettingsPopup />
  </nav>
{/if}

<button
  bind:this={button}
  class="icon-button icon--settings"
  on:click={showPopup}
  data-cy="settings-button"
/>
<Tooltip target={button} placement="bottom" data-cy="settings-button-tooltip">
  {TOOLTIP_BUTTON_SETTINGS}
</Tooltip>
