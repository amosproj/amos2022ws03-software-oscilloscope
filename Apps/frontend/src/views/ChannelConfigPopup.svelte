<script>
  import { createEventDispatcher } from "svelte";
  import {
    getChannelConfig,
    postChannelConfig,
  } from "../rest/ChannelConfigController";
  import {
    getLiveChannelConfig,
    setLiveChannelConfig,
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

  let presetName;
  let selectedPreset;

  const dispatch = createEventDispatcher();

  async function loadChannelConfigById() {
    var response = await getChannelConfig(selectedPreset);

    if (response !== undefined) setLiveChannelConfig(response.channels);

    dispatch(EVENT_LOADED_CHANNEL_CONFIG, {});
    $presetPopupOpen = false;
  }

  async function storeChannelConfig() {
    await postChannelConfig(getLiveChannelConfig(), presetName);
    $presetPopupOpen = false;
  }

  function handleSaveButton() {
    if (document.getElementById("presetName").value === "") {
      document.getElementById("storeChannelConfig").disabled = true;
    } else {
      document.getElementById("storeChannelConfig").disabled = false;
    }
  }
</script>

<div data-cy="channelConfigPreset">
  <div style="margin-left: auto;">
    <h3>{LABEL_HEADER_LOAD_FROM_LIST_CHANNEL_CONFIG}</h3>
    <select bind:value={selectedPreset}>
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
    <input
      id="presetName"
      type="text"
      bind:value={presetName}
      on:change={handleSaveButton}
    />
    <button id="storeChannelConfig" on:click={storeChannelConfig} disabled
      >{LABEL_BUTTON_UPDATE_CHANNEL_CONFIG}</button
    >
  </div>
  <br />
  <button id="cancelChannelConfig" on:click={() => ($presetPopupOpen = false)}
    >{LABEL_BUTTON_CANCEL_CHANNEL_CONFIG}</button
  >
</div>
