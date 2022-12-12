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

  if (id === undefined) console.error("Missing id for Slider!");
</script>

<div>
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
</div>
