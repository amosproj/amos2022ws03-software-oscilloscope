<script>
    import { createEventDispatcher } from "svelte";
  
    const dispatch = createEventDispatcher();
  
    $: label = "Reset";
  
    const handleClick = async () => {
      dispatch("reset", {});
    };
  </script>
  
  <br />
  <button id="btn-on-off" on:click={handleClick}>{label}</button>
  
  <style>
    #btn-on-off {
      border-style: solid;
      border-color: grey;
    }
  </style>
  