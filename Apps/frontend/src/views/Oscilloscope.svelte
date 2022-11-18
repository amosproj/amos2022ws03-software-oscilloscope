<script>
  import { onMount, onDestroy } from "svelte";
  import TextField from "@smui/textfield"
  import CoordinateSystem from "./CoordinateSystem.svelte";
  import Waves from "../views/Waves.svelte";
  import { NUM_CHANNELS } from "../const";


  let waveElement;
  let scalesY = Array(NUM_CHANNELS).fill(1); // 1V per horizontal line
  let offsetsY = Array(NUM_CHANNELS).fill(0);
  let socket;

  /* DEBUG START */
  scalesY[0] = 2;
  offsetsY[0] = 0;
  /* DEBUG END */

  onMount(() => {
    socket = new WebSocket("ws://localhost:9000");
    socket.binaryType = "arraybuffer";

    socket.onopen = () => {
      console.log("Socket opened");
    };

    socket.onmessage = (message) => {
      let samples = new Float64Array(message.data);

      waveElement.updateBuffer(samples, );
    };
  });

  onDestroy(() => {
    socket.close();
  }) 
</script>

<div>
  <div class="wrapper" data-cy="oscilloscope">
    <div class="stack coordinate-system">
      <CoordinateSystem scaleY={Math.max(...scalesY)} />
    </div>
    <div class="stack wave">
      <Waves bind:this={waveElement} {scalesY} {offsetsY}/>
    </div>
  </div>
  <div style="float:right">
    {#each offsetsY as offsetY}
      <TextField bind:value={offsetY} label="Offset of y-axis" type="float" />
    {/each}
  </div>
</div>

<style>
  .wrapper {
    position: relative;
  }
  .stack {
    position: absolute;
    inset: 0;
  }
  .coordinate-system {
    z-index: 0;
  }
  .wave {
    z-index: 1;
  }
</style>
