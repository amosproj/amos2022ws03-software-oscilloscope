<script>
  export let value = 1;
  export let min = 0;
  export let max = 10;
  export let step = 0.1;
  export let id = undefined;
  export let dataCy = undefined;
  export let className = undefined;
  export let calculateDisplayedValue = undefined;

  export let onInput = () => {};
</script>

<div class={className} data-cy={dataCy}>
  <input {id} type="range" bind:value on:input={onInput} {min} {max} {step} />
  {#if calculateDisplayedValue !== undefined}
    <div class="slider-label">{calculateDisplayedValue(value)}</div>
  {/if}
</div>
