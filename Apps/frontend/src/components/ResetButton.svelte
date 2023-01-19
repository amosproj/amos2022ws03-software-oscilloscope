<script>
  import { createEventDispatcher } from "svelte";
  import { Tooltip } from "sveltestrap";
  import { TOOLTIP_BUTTON_RESET } from "../labels";

  const dispatch = createEventDispatcher();
  $: url = "../assets/mui_reset.svg";

  const handleClick = async () => {
    dispatch("reset", {});
  };
</script>

<div>
  <button
    id="btn-reset"
    class="icon-button mui-icon--reset"
    on:click={handleClick}
    data-cy="reset-button"
  />
  <Tooltip target="btn-reset" placement="bottom">{TOOLTIP_BUTTON_RESET}</Tooltip
  >
</div>
