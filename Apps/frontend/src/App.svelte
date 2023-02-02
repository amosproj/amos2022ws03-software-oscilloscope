<script>
  import Layout from "./views/Oscilloscope.svelte";
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/icon?family=Material+Icons"
  />
  <link rel="stylesheet" href="node_modules/svelte-material-ui/bare.css" />
  <link
    rel="stylesheet"
    href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
  />
</svelte:head>
<main data-cy="oscilloscope">
  <Layout />
</main>
