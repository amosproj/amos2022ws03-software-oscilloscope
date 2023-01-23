<script>
  import { fly } from "svelte/transition";
  import clsx from "clsx";
  import ControlPanelBottom from "./ControlPanelBottom.svelte";
  import { expandedPanelOpen } from "../stores";
  import { clickOutside } from "../helper";
  $: panelHeight = 0;
</script>

<button
  class="control-panel--bottom_expand-accordion"
  on:click={() => ($expandedPanelOpen = true)}
  data-cy="expand-accordion"
>
  <button
    class={clsx(
      { "icon-button": true },
      { "icon--expand-less": $expandedPanelOpen },
      { "icon--expand-more": !$expandedPanelOpen }
    )}
  />
</button>
{#if $expandedPanelOpen}
  <nav
    class="control-panel--bottom"
    transition:fly={{ y: panelHeight, opacity: 1 }}
    bind:clientHeight={panelHeight}
    use:clickOutside
    on:click-outside={() => ($expandedPanelOpen = false)}
    data-cy="expanded-control-panel"
  >
    <ControlPanelBottom />
  </nav>
{/if}
