<script>
  import { createEventDispatcher } from "svelte";
  import {
    getChannelConfig,
    postChannelConfig,
    getAllChannelConfig
  } from "../rest/ChannelConfigController";
  import {
    getLiveChannelConfig,
    setLiveChannelConfig,
    availableChannelConfigPresets,
    presetPopupOpen,
  } from "../stores";
  import {
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
  }

  async function storeChannelConfig() {
    await postChannelConfig(getLiveChannelConfig(), presetName);

    var response = await getAllChannelConfig();
    if (response !== undefined) availableChannelConfigPresets.set(response);
  }

  function handleSaveButton() {
    let storeButton = document.getElementById("storeChannelConfig");

    if (presetName === "") {
      storeButton.disabled = true;
    } else {
      storeButton.disabled = false;
    }
  }

  function handleLoadButton() {
    let loadButton = document.getElementById("getChannelConfig");

    if (selectedPreset === "") {
      loadButton.disabled = true;
    } else {
      loadButton.disabled = false;
    }
  }
</script>

<div data-cy="preset-config-open-popup">
  <div class="settings--close">
    <button
      class="icon-button icon-button--small icon--close"
      on:click={() => ($presetPopupOpen = false)}
      data-cy="expanded-control-panel-close-button"
    />
    <h3 class="settings--headline">Settings</h3>
  </div>
  <hr class="rounded" />
  <div>
    <ol>
      <li>
        <h4 class="settings--headline-section">Presets:</h4>
        <ul>
          <li>
            <div class="settings--list-element">
              {LABEL_HEADER_LOAD_FROM_LIST_CHANNEL_CONFIG}
              <div>
                <div>
                  <select
                    class="margin--small"
                    bind:value={selectedPreset}
                    on:change={handleLoadButton}
                    data-cy="available-presets-list"
                  >
                    {#each $availableChannelConfigPresets as preset}
                      <option value={preset}>
                        {preset}
                      </option>
                    {/each}
                    <option value="" disabled selected>Select preset...</option>
                  </select>
                </div>
                <div>
                  <button
                    id="getChannelConfig"
                    class="icon-button icon-button--big icon--publish"
                    on:click={loadChannelConfigById}
                    disabled
                    data-cy="load-channel-config"
                  />
                </div>
              </div>
            </div>
          </li>
          <li>
            <div class="settings--list-element">
              {LABEL_HEADER_CREATE_CHANNEL_CONFIG}
              <div>
                <div>
                  <input
                    class="margin-small"
                    id="presetName"
                    type="text"
                    bind:value={presetName}
                    on:keyup={handleSaveButton}
                    placeholder="Set preset name..."
                    data-cy="selected-preset"
                  />
                </div>
                <div>
                  <button
                    id="storeChannelConfig"
                    class="icon-button icon-button--big icon--save"
                    on:click={storeChannelConfig}
                    disabled
                    data-cy="store-channel-config"
                  />
                </div>
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ol>
  </div>
</div>
