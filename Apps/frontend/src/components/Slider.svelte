<script>
  export let onInput = (value) => {
    console.error(`Missing implementation of Slider.onInput(${value})!`);
    return value;
  };

  export let value = 1;
  export let min = 0;
  export let max = 10;
  export let step = 0.1;
  export let id = undefined;
  export let dataCy = undefined;
  export let className = undefined;
  export let calculateDisplayedValue = undefined;
</script>

<div class={className} data-cy={dataCy}>
  <input
    {id}
    type="range"
    on:input={() => onInput(value)}
    bind:value
    {min}
    {max}
    {step}
  />
  {#if calculateDisplayedValue !== undefined}
    <span>{calculateDisplayedValue(value)}</span>
  {/if}
</div>
