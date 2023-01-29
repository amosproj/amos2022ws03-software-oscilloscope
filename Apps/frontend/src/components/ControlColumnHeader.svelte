<script>
  export let label;
  export let icon;
  export let tooltip = null;
  import { Tooltip } from "sveltestrap";
  let div;
</script>

<div bind:this={div} class="control-column-header">
  <div class="icon icon--{icon}" />
  <div>{label}</div>
</div>
<Tooltip target={div} placement="bottom">
  {tooltip != null ? tooltip : label}
</Tooltip>
