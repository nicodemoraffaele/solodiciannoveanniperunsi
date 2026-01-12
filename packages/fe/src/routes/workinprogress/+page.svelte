<script lang="ts">
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

	const imageUrl = `${base}/waiting_pc_no_bg.png`;

	onMount(() => {
		// Load Tally embed script
		const script = document.createElement('script');
		script.src = 'https://tally.so/widgets/embed.js';
		script.async = true;
		document.head.appendChild(script);
	});
</script>

<svelte:head>
	<title>Work In Progress - Sara e Raffaele</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
</svelte:head>

<div class="page-background min-h-screen overflow-hidden">
	<div class="mx-auto px-4">
		<div class="center workinprogress">
			<h1 class="animate-fadeInUp mb-6">L'amore non si costruisce in un giorno. <br /> Nemmeno questo sito.</h1>
			<img src={imageUrl} alt="waiting" />
		</div>
	</div>
</div>

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		overflow-x: hidden;
		height: 100%;
	}

	.page-background {
		background: linear-gradient(to bottom, #fafaf8 0%, #f5f1ed 100%);
	}

	.workinprogress {
		display: flex;
		flex-direction: column;
	}

	.workinprogress h1 {
		font-family: 'Pinyon Script', cursive;
		font-size: 4rem;
		color: #7a8b7f;
		line-height: 1;
		text-align: center;
	}

	.workinprogress img {
		width: 20rem;
	}

	.center {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 40rem;
		margin-top: 12%;
	}

	@keyframes heartbeat {
		0%,
		100% {
			transform: scale(1);
		}
		10%,
		30% {
			transform: scale(1.1);
		}
		20%,
		40% {
			transform: scale(1);
		}
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fadeInUp {
		animation: fadeInUp 0.8s ease-out forwards;
		opacity: 0;
	}
</style>
