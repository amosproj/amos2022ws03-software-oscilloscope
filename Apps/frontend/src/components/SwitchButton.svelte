<script>
  import { createEventDispatcher } from "svelte";
  import Switch from "svelte-toggle";
  import { LINE_COLORS_RGBA } from "../const.js";
  import { channelEnabled } from "../stores.js";

  export let writableStore;
  export let writableStoreIndex;

  export let color;
  export let buttonLabel = "";

  export let data_cy;

  let isToggled = $writableStore[writableStoreIndex];
</script>

<div class="switch-wrapper" data-cy={data_cy}>
  <small class="button-label">{buttonLabel}</small>
  <Switch
    hideLabel
    bind:toggled={isToggled}
    on:toggle={(event) => {
      $writableStore[writableStoreIndex] = event.detail;
    }}
    toggledColor={color}
  />
</div>

<style>
  .switch-wrapper {
    display: flex;
    justify-content: start;
    margin: 0.32rem;
  }

  .button-label {
    margin-right: 0.5vw;
  }
</style>
