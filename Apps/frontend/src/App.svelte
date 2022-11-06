<script>
  import HelloWorld from './views/HelloWorld.svelte'
  import OnOffButton from './views/OnOffButton.svelte'
</script>

<main>
  <h1>Hello World</h1>
  <HelloWorld />
  <OnOffButton on:switch-plot-enabled={async (event)  => {console.log('Turned ' + (event.detail.enabled ? 'on' : 'off') +'...')}} />
</main>

<style>
</style>
