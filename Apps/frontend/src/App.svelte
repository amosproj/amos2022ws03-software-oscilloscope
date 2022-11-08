<script>
  import HelloWorld from "./views/HelloWorld.svelte";
  import Logo from "./views/Logo.svelte";
  import OnOffButton from './views/OnOffButton.svelte'
  import Logo from "./views/Logo.svelte"
</script>

<main>
  <Logo />
  <HelloWorld />
  <OnOffButton on:switch-plot-enabled={async (event)  => {console.log('Turned ' + (event.detail.enabled ? 'on' : 'off') +'...')}} />
</main>

<style>
</style>
