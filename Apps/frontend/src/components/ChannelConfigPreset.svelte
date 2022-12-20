<script>
    import { createEventDispatcher } from "svelte";
    import { getChannelConfig, postChannelConfig } from "../rest/ChannelConfigController";
    import { channelConfig } from '../stores';
    import { LABEL_BUTTON_LOAD_CHANNEL_CONFIG, LABEL_BUTTON_UPDATE_CHANNEL_CONFIG } from "../labels";
    import { EVENT_LOADED_CHANNEL_CONFIG } from "../events";

    const dispatch = createEventDispatcher();
    
    async function loadChannelConfig() {
        var response = await getChannelConfig()

        if(response !== undefined)
            channelConfig.set(response.channels)          
            
        dispatch(EVENT_LOADED_CHANNEL_CONFIG, {});
    }

    async function storeChannelConfig() {
        var response = await postChannelConfig($channelConfig);
    }

</script>

<div data-cy="channelConfigPreset">
    <button id="getChannelConfig" on:click={loadChannelConfig}>{LABEL_BUTTON_LOAD_CHANNEL_CONFIG}</button>
    <button id="storeChannelConfig" on:click={storeChannelConfig}>{LABEL_BUTTON_UPDATE_CHANNEL_CONFIG}</button>
</div>