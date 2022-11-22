<script>
  import { onMount, onDestroy } from "svelte";
  import CoordinateSystem from "./CoordinateSystem.svelte";
  import SineWave from "./SineWave.svelte";
  import { CANVAS_WIDTH } from "../const";
  import StartStopButton from "./StartStopButton.svelte";

  let waveElement;
  let scaleY = 1; // 1V per horizontal line
  let socket;

  let hasStarted = true

  onMount(() => {
    socket = new WebSocket("ws://localhost:9000");
    socket.binaryType = "arraybuffer";

    socket.onopen = () => {
      console.log("Socket opened");
    };

    socket.onmessage = (message) => {
      if(hasStarted){
        let samples = new Float64Array(message.data);
        waveElement.updateBuffer(samples);
      }  
    };
  });

  onDestroy(() => {
    socket.close();
  }) 
</script>

<div class="wrapper" data-cy="oscilloscope">
  <div class="stack coordinate-system">
    <CoordinateSystem yScale={scaleY} />
  </div>
  <div class="stack wave">
    <SineWave bind:this={waveElement} {scaleY} />
    <StartStopButton on:startStop={async (event)=> {hasStarted = event.detail.buttonValue}} />
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
