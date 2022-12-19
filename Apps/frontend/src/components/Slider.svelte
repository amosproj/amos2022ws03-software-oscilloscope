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
  export let className = "slider";
  export let calcDisplayValue = undefined;

  if (id === undefined) console.error("Missing id for Slider!");
</script>

<div class={className} data-cy={id}>
  <input
    {id}
    type="range"
    class="slider"
    on:input={() => onInput(value)}
    bind:value
    {min}
    {max}
    {step}
  />
  {#if calcDisplayValue !== undefined}
    <span>{calcDisplayValue(value)}</span>
  {/if}
</div>

<style>
  .slider {
  }
</style>
