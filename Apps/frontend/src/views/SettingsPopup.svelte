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
    LABEL_HEADER_LOAD_FROM_LIST_CHANNEL_CONFIG,
    LABEL_HEADER_CREATE_CHANNEL_CONFIG,
  } from "../labels";
  import { EVENT_LOADED_CHANNEL_CONFIG } from "../events";
  import { getAllChannelConfig } from "../rest/ChannelConfigController";

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
    if (document.getElementById("presetName").value === "") {
      document.getElementById("storeChannelConfig").disabled = true;
    } else {
      document.getElementById("storeChannelConfig").disabled = false;
    }
  }

  function handleLoadButton() {
    if (document.getElementById("availablePreset").value === "") {
      document.getElementById("getChannelConfig").disabled = true;
    } else {
      document.getElementById("getChannelConfig").disabled = false;
    }
  }
</script>

<div data-cy="settings-popup">
  <div style="display: flex;">
    <button
      class="icon-button icon-button--small mui-icon--close"
      on:click={() => ($presetPopupOpen = false)}
      data-cy="expanded-control-panel-close-button"
    />
    <h3 style="display: inline;">Settings</h3>
  </div>
  <hr class="rounded">
  <div>
    <ol>
      <li>  
        <h4 style="width: fit-content; margin:0">Presets:</h4>
        <ul>
            <li>
                <div style="display: table; width: fit-content;">
                  {LABEL_HEADER_LOAD_FROM_LIST_CHANNEL_CONFIG}
                  <div style="display: table-cell;">
                    <div style="display: table-cell;">
                      <select id="availablePreset" 
                        class="margin-small"
                        bind:value={selectedPreset}
                        on:select={handleLoadButton}>
                        {#each $availableChannelConfigPresets as preset}
                          <option value={preset}>
                            {preset}
                          </option>
                        {/each}
                        <option value="" disabled selected>Select preset</option>
                      </select>
                    </div>
                    <div style="display: table-cell;">
                      <button id="getChannelConfig"
                        class="icon-button icon-button--big mui-icon--publish"
                        on:click={loadChannelConfigById}
                        disabled                 
                      />
                    </div> 
                  </div>                  
                </div>
            </li>
            <li>
              <div style="display: table; width: fit-content;">
                {LABEL_HEADER_CREATE_CHANNEL_CONFIG}
                <div style="display: table-cell;">
                  <div style="display: table-cell;">
                    <input
                    class="margin-small"
                    id="presetName"
                    type="text"
                    bind:value={presetName}
                    on:keyup={handleSaveButton}
                    placeholder="Set preset name..."
                    />
                  </div>    
                  <div style="display: table-cell;">
                    <button id="storeChannelConfig"
                      class="icon-button icon-button--big mui-icon--save"
                      on:click={storeChannelConfig} 
                      disabled
                    />     
                </div>                
              </div>
            </li>
        </ul>        
      </li>      
    </ol>    
  </div>
</div>
