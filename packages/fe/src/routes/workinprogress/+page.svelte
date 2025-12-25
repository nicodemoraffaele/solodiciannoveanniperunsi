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

		<!-- Footer text -->
		<footer class="footer-text">
			<p>
				Con
				<svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
					<path
						d="M50 85 C30 70, 10 55, 10 35 C10 20, 20 10, 30 10 C40 10, 45 15, 50 25 C55 15, 60 10, 70 10 C80 10, 90 20, 90 35 C90 55, 70 70, 50 85 Z"
						fill="#7A8B7F"
					/>
				</svg>
				Sara e Raffaele
			</p>
		</footer>
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

	.footer-text {
		text-align: center;
		padding: 2rem 1rem;
		margin-top: 2rem;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.footer-text p {
		font-family: 'Cormorant Garamond', serif;
		font-size: 1.5rem;
		color: #7a8b7f;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.center {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 40rem;
		margin-top: 12%;
	}

	.heart-icon {
		width: 20px;
		height: 20px;
		display: inline-block;
		animation: heartbeat 1.5s ease-in-out infinite;
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
