<script>
  import { fly } from "svelte/transition";
  import clsx from "clsx";
  import { NUM_CHANNELS } from "../const";
  import ControlPanelBottom from "../views/ControlPanelBottom.svelte";

  $: panelHeight = 0;
  let expandedIndex = -1;
  export let waveElement;
  export let indicatorElement;

  const toggleExpand = (index) => {
    expandedIndex = expandedIndex === index ? -1 : index;
  };

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

{#each { length: NUM_CHANNELS } as _, index}
  <button
    class={clsx(
      { "icon-button control-panel--top_expand": true },
      { "mui-icon--expand-less": expandedIndex === index },
      { "mui-icon--expand-more": expandedIndex !== index }
    )}
    on:click={() => toggleExpand(index)}
    data-cy="expand-button"
  />
{/each}
{#if expandedIndex > -1 && expandedIndex < NUM_CHANNELS}
  <nav
    class="control-panel--bottom"
    bind:clientHeight={panelHeight}
    transition:fly={{ y: -panelHeight, opacity: 1 }}
    use:clickOutside
    on:click-outside={toggleExpand(expandedIndex)}
  >
    <ControlPanelBottom {waveElement} {indicatorElement} />
  </nav>
{/if}
