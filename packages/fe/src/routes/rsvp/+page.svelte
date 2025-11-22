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
	:global(html, body) {
		margin: 0;
		height: 100%;
		overflow: hidden;
	}

	.rsvp-container {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		border: 0;
	}

	.rsvp-container iframe {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		border: 0;
	}
</style>
