<script>
  import { onMount, onDestroy } from "svelte";
  import CoordinateSystem from "./CoordinateSystem.svelte";
  import Waves from "../views/Waves.svelte";
  import { NUM_CHANNELS } from "../const";


  let waveElement;
  let scalesY = Array(NUM_CHANNELS).fill(1); // 1V per horizontal line
  let offsetsY = Array(NUM_CHANNELS).fill(0);
  let socket;

  onMount(() => {
    socket = new WebSocket("ws://localhost:9000");
    socket.binaryType = "arraybuffer";

    socket.onopen = () => {
      console.log("Socket opened");
    };

    socket.onmessage = (message) => {
      let samples = new Float64Array(message.data);

      waveElement.updateBuffer(samples);
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
  <div class="sliders-wrapper">
    {#each offsetsY as offsetY}
      <div>
        <input type="range"
          bind:value={offsetY}
          min="-1.4"
          max="1.4"
          step="0.2"
        />
      </div>
    {/each}
  </div>
</div>

<style>
  .wrapper {
    position: relative;
    width: 10vw;
    height: 10vh;
    display: flex;
    margin: 0 2rem;
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
  .sliders-wrapper {
    float:right;
    margin-right: 2rem;
  }
</style>
