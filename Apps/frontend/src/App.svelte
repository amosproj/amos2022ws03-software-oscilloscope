<script>
  import Logo from "./views/Logo.svelte";
  import Oscilloscope from "./views/Oscilloscope.svelte";
  import "@pixi/math-extras";
</script>

<main>
  <div>
    <Logo />
  </div>
  <div class="canvas">
    <Oscilloscope />
  </div>
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
