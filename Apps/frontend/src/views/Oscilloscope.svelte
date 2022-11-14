<script>
    import { onMount, onDestroy } from "svelte";
    import CoordinateSystem from "./CoordinateSystem.svelte";
    import SineWave from "./SineWave.svelte";
    import { CANVAS_WIDTH } from "../const";


    let waveElement;
    let scaleY = 1; // 1V per horizontal line
    let socket;

  onMount(() => {
    socket = new WebSocket("ws://localhost:9000");
    socket.binaryType = 'arraybuffer';

    socket.onopen = () => {
      console.log("Socket opened");
    };

    let index = 0;

    socket.onmessage = (message) => {
      
      console.log(`Message.data: ${JSON.stringify(message.data)}`);

      waveElement.updatePoint(index++, parseFloat(message.data));
      index = index % CANVAS_WIDTH;
    };
  });

  onDestroy(() => {
    socket.close();
  }) 
</script>

<div class="wrapper">
  <div class="stack coordinate-system">
    <CoordinateSystem
      yScale={scaleY}
    />
  </div>
  <div class="stack wave">
    <SineWave
      bind:this={waveElement}
      {scaleY}
    />
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
