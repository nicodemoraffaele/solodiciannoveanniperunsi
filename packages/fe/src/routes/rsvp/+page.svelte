<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		// Load Tally embed script
		const script = document.createElement('script');
		script.src = 'https://tally.so/widgets/embed.js';
		script.async = true;
		document.head.appendChild(script);
	});
</script>

<svelte:head>
	<title>RSVP - Sara e Raffaele</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
</svelte:head>

<div class="rsvp-container">
	<iframe
		data-tally-src="https://tally.so/r/ZjjbMB?transparentBackground=1"
		width="100%"
		height="100%"
		frameborder="0"
		marginheight="0"
		marginwidth="0"
		title="Sara e Raffaele"
	></iframe>
</div>

<style>
	.rsvp-container {
		width: 100%;
		min-height: 70vh;
		padding: 1rem;
	}

	.rsvp-container iframe {
		width: 100%;
		min-height: 600px;
		height: 90vh;
		border: 0;
		border-radius: 0.5rem;
	}
</style>
