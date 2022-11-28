<script>
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	let play = "Start ▶";
	let stop = "Stop ■";
	let symbol = stop;
	let hasStarted = true;

	const handleStartStop = async () => {
		hasStarted = !hasStarted;
		hasStarted ? symbol = stop : symbol = play;
		dispatch('startStop', {buttonValue: hasStarted})
	}


</script>

<button class="button-style" on:click={handleStartStop}>
	{symbol}
</button>


<style>
	.button-style {
    position: fixed;
    z-index: 99;
    left: 20px;
	top: 40px;
  }

</style>