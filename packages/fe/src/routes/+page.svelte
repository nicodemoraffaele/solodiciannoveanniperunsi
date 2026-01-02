<script lang="ts">
	import TimelineContainer from '$components/routes-component/home/timeline/TimelineContainer.svelte';
</script>

<svelte:head>
	<title>Solo Diciannove Anni Per Un Si</title>
</svelte:head>

<div class="page-background min-h-screen overflow-hidden">
	<div class="mx-auto px-4">
		<!-- Header -->
		<header class="py-4 text-center md:py-8">
			<h1
				class="animate-fadeInUp mb-6"
				style="font-family: 'Pinyon Script', cursive; font-size: 4rem; color: #7A8B7F; line-height: 1;"
			>
				Sara e Raffaele
			</h1>
			<div class="animate-fadeInUp" style="animation-delay: 0.2s;">
				<p
					style="font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; color: #8B9F8C; font-weight: 300; letter-spacing: 0.15em; margin-bottom: 0.5rem;"
				>
					Sabato 20 Giugno 2026
				</p>
			</div>
		</header>

		<!-- Timeline -->
		<main class="timeline-main">
			<TimelineContainer />
		</main>

		<!-- Footer text -->
		<footer class="footer-text">
			<p>
				Fatto con
				<svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
					<path
						d="M50 85 C30 70, 10 55, 10 35 C10 20, 20 10, 30 10 C40 10, 45 15, 50 25 C55 15, 60 10, 70 10 C80 10, 90 20, 90 35 C90 55, 70 70, 50 85 Z"
						fill="#7A8B7F"
					/>
				</svg>
				da Sara e Raffaele
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

	.footer-text {
		text-align: center;
		padding: 2rem 1rem;
		margin-top: 2rem;
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
