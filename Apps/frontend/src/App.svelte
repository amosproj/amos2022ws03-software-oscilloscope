<script>
  import { onMount } from "svelte";
  import Logo from "./views/Logo.svelte";
  import OnOffButton from "./views/OnOffButton.svelte";
  import Oscilloscope from "./views/Oscilloscope.svelte";
  import StartStopButton from "./views/StartStopButton.svelte";
</script>

<main>
  <div>
    <Logo />
  </div>
  <div class="canvas">
    <Oscilloscope />
  </div>
  <OnOffButton on:switch-plot-enabled={async (event)  => {console.log('Turned ' + (event.detail.enabled ? 'on' : 'off') +'...')}} />
</main>

<style>
  main {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .canvas {
    flex-grow: 1;
  }
</style>
