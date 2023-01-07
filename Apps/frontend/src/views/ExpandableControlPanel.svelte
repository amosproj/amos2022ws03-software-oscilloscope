<script>
  import { fly } from "svelte/transition";
  import clsx from "clsx";
  import ControlPanelBottom from "./ControlPanelBottom.svelte";
  import { expandedPanelOpen } from "../stores";

  $: panelHeight = 0;
  export let waveElement;
  export let indicatorElement;

  /**
   * The function introduces an event handler to check if there is a click
   * event outside the chosen element.
   * To attach the handler add `use:clickOutside` to the node properties.
   */
  const clickOutside = (element) => {
    const handleClick = (event) => {
      if (
        element &&
        !element.contains(event.target) &&
        !event.defaultPrevented
      ) {
        element.dispatchEvent(new CustomEvent("click-outside", element));
      }
    };
    document.addEventListener("click", handleClick, true);
    return {
      destroy() {
        document.removeEventListener("click", handleClick, true);
      },
    };
  };
</script>

<button
  class="control-panel--bottom_expand-accordion"
  on:click={() => ($expandedPanelOpen = true)}
  data-cy="expand-accordion"
>
  <button
    class={clsx(
      { "icon-button": true },
      { "mui-icon--expand-less": $expandedPanelOpen },
      { "mui-icon--expand-more": !$expandedPanelOpen }
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
  >
    <ControlPanelBottom {waveElement} {indicatorElement} />
  </nav>
{/if}
