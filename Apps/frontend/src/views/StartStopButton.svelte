<script>
  import { createEventDispatcher } from "svelte";
  export let channel_id;

  const dispatch = createEventDispatcher();

  let play = "Start ▶";
  let stop = "Stop ■";
  let symbol = channel_id + " " + stop;
  let hasStarted = true;

  const handleStartStop = async () => {
    hasStarted = !hasStarted;
    hasStarted ? (symbol = stop) : (symbol = play);
    symbol = channel_id + " " + symbol;
    dispatch("startStop", { buttonValue: hasStarted });
  };
</script>

<button class="button-style" on:click={handleStartStop}>
  {symbol}
</button>

<style>
  .button-style {
    border-style: solid;
    border-color: grey;
  }
</style>
