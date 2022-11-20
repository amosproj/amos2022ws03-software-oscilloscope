<script>
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	let play = "▶";
	let stop = "■";
	let symbol = stop;
	let hasStarted = true;

	const handleStartStop = async () => {
		hasStarted = !hasStarted;
		hasStarted ? symbol = stop : symbol = play;
	
		//console.log("hasStarted:" + hasStarted)
		
		dispatch('startStop', {buttonValue: hasStarted})
	}
	
	
</script>

<button class="button-style button-up" on:click={handleStartStop}> 
	{symbol}
</button>


<style>
	.button-style {    
    position: fixed;
    z-index: 99;
    left: 20px;
	padding: 10px;
	margin: 10px;
	font-size: 1.5em;
  }
	
	.button-up {
		top: 40px;
	}


</style>