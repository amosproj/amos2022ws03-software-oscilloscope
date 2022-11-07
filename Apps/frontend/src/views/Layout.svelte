<script>
  import Logo from "./Logo.svelte";
</script>

<main>
  <div>
    <Logo />
  </div>
  <div class="content">
    <slot />
  </div>
</main>

<style>
  main {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .content {
    flex-grow: 1;
  }
</style>
