<script>
  export let label;
  export let icon;
  export let tooltip = null;
  import { Tooltip } from "sveltestrap";
  let div;
</script>

<div bind:this={div} style="cursor: help;">
  <div class="icon icon--{icon}" />
  <div>{label}</div>
</div>
<Tooltip target={div} placement="bottom">
  {tooltip != null ? tooltip : label}
</Tooltip>

<style>
  .icon {
    width: 100%;
    height: 24px;
    background-position: center;
    background-repeat: no-repeat;
  }
</style>
