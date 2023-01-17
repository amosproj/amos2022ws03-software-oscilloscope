<script>
  import { createEventDispatcher } from "svelte";
  import { NUM_CHANNELS } from "../const";
  import {
    getChannelConfig,
    postChannelConfig,
  } from "../rest/ChannelConfigController";
  import {
    channelConfig,
    availableChannelConfigPresets,
    presetPopupOpen,
  } from "../stores";
  import {
    LABEL_BUTTON_LOAD_CHANNEL_CONFIG,
    LABEL_BUTTON_UPDATE_CHANNEL_CONFIG,
    LABEL_BUTTON_CANCEL_CHANNEL_CONFIG,
    LABEL_HEADER_LOAD_FROM_LIST_CHANNEL_CONFIG,
    LABEL_HEADER_CREATE_CHANNEL_CONFIG,
  } from "../labels";
  import { EVENT_LOADED_CHANNEL_CONFIG } from "../events";

  export let waveElement;
  export let indicatorElement;

  let presetName;
  let selectedPreset;

  const dispatch = createEventDispatcher();

  async function loadChannelConfigById() {
    var response = await getChannelConfig(selectedPreset);

    if (response !== undefined) channelConfig.set(response.channels);

    updateChannelConfig();
    dispatch(EVENT_LOADED_CHANNEL_CONFIG, {});
  }

  async function storeChannelConfig() {
    await postChannelConfig($channelConfig, presetName);
  }

  function updateChannelConfig() {
    for (let index = 0; index < NUM_CHANNELS; index++) {
      /* StartStop */
      waveElement.startStopChannelI(index, $channelConfig[index].enabled);
      indicatorElement.startStopChannelI(index, $channelConfig[index].enabled);
      /* Thickness */
      waveElement.updateChannelThickness(
        index,
        $channelConfig[index].thickness
      );
      /* Offset */
      waveElement.updateChannelOffsetY(index, $channelConfig[index].offset);
      indicatorElement.updateChannelOffsetY(
        index,
        $channelConfig[index].offset
      );
      /* Sweepspeed is automatically updated */
      /* Amplitude */
      waveElement.updateChannelScaling(index, $channelConfig[index].amplitude);
      indicatorElement.updateChannelScaling(
        index,
        $channelConfig[index].amplitude
      );
    }
  }
</script>

<div data-cy="channelConfigPreset">
  <div style="margin-left: auto;">
    <h3>{LABEL_HEADER_LOAD_FROM_LIST_CHANNEL_CONFIG}</h3>
    <select id="availablePreset" bind:value={selectedPreset}>
      {#each $availableChannelConfigPresets as preset}
        <option value={preset}>
          {preset}
        </option>
      {/each}
    </select>
    <button id="getChannelConfig" on:click={loadChannelConfigById}
      >{LABEL_BUTTON_LOAD_CHANNEL_CONFIG}</button
    >
  </div>
  <div style="margin-left: auto;">
    <h3>{LABEL_HEADER_CREATE_CHANNEL_CONFIG}</h3>
    <input id="presetName" type="text" bind:value={presetName} />
    <button id="storeChannelConfig" on:click={storeChannelConfig}
      >{LABEL_BUTTON_UPDATE_CHANNEL_CONFIG}</button
    >
  </div>
  <br />
  <button id="cancelChannelConfig" on:click={() => ($presetPopupOpen = false)}
    >{LABEL_BUTTON_CANCEL_CHANNEL_CONFIG}</button
  >
</div>
