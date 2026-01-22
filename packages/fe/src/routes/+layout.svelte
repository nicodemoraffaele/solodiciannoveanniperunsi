<script lang="ts">
	import { goto } from '$app/navigation';
	import { page, navigating } from '$app/stores';
	import { base } from '$app/paths';
	import { setLocale } from '$lib/i18n/i18n-svelte';
	import type { Snippet } from 'svelte';
	import '../app.postcss';
	import type { LayoutData } from './$types';
	import HamburgerMenu from '$components/common/HamburgerMenu.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	setLocale(data.locale);

	// Set to true to redirect all pages to /workinprogress
	const WORK_IN_PROGRESS = false;

	// Loader state with minimum display time
	let showLoader = $state(true); // Start with loader visible
	let loaderTimeout: ReturnType<typeof setTimeout> | null = null;

	// Hide loader after initial page load
	$effect(() => {
		if (showLoader && !$navigating) {
			loaderTimeout = setTimeout(() => {
				showLoader = false;
				// Remove loading class from body to show header/footer
				document.body.classList.remove('loading');
			}, 1500);
		}

		return () => {
			if (loaderTimeout) clearTimeout(loaderTimeout);
		};
	});

	// Show loader during navigation
	$effect(() => {
		if ($navigating) {
			showLoader = true;
			document.body.classList.add('loading');
			if (loaderTimeout) clearTimeout(loaderTimeout);
		}
	});

	$effect(() => {
		if (WORK_IN_PROGRESS && !$page.url.pathname.endsWith('/workinprogress')) {
			goto(`${base}/workinprogress`, { replaceState: true });
		}
	});
</script>

<!-- Page Loader -->
{#if showLoader}
	<div class="loader-overlay">
		<div class="loader">
			<div class="loader-heart">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
					<path
						d="M50 85 C30 70, 10 55, 10 35 C10 20, 20 10, 30 10 C40 10, 45 15, 50 25 C55 15, 60 10, 70 10 C80 10, 90 20, 90 35 C90 55, 70 70, 50 85 Z"
						fill="#7A8B7F"
					/>
				</svg>
			</div>
			<p class="loader-text">Caricamento...</p>
		</div>
	</div>
{:else}
	<!-- Desktop message -->
	<div class="desktop-only-message">
		<div class="desktop-message-content">
			<div class="desktop-heart">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
					<path
						d="M50 85 C30 70, 10 55, 10 35 C10 20, 20 10, 30 10 C40 10, 45 15, 50 25 C55 15, 60 10, 70 10 C80 10, 90 20, 90 35 C90 55, 70 70, 50 85 Z"
						fill="#7A8B7F"
					/>
				</svg>
			</div>
			<h1 class="desktop-title">Sara e Raffaele</h1>
			<p class="desktop-date">20 Giugno 2026</p>
			<div class="desktop-divider"></div>
			<p class="desktop-text">
				L'amore si vive da vicino,<br />
				come questo sito.<br />
				Aprilo dal tuo <strong>smartphone</strong>
			</p>
			<div class="desktop-phone-icon">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
					/>
				</svg>
			</div>
		</div>
	</div>

	<!-- Mobile/Tablet content -->
	<div class="mobile-content">
		<HamburgerMenu />
		{@render children()}
	</div>
{/if}

<style>
	/* Desktop message - hidden on mobile/tablet */
	.desktop-only-message {
		display: none;
	}

	/* Mobile content - visible by default */
	.mobile-content {
		display: contents;
	}

	/* Show desktop message and hide mobile content on tablet/desktop */
	@media (min-width: 768px) {
		.desktop-only-message {
			display: flex;
			position: fixed;
			inset: 0;
			z-index: 300;
			align-items: center;
			justify-content: center;
			background: linear-gradient(to bottom, #fafaf8 0%, #f5f1ed 100%);
		}

		.mobile-content {
			display: none;
		}
	}

	.desktop-message-content {
		text-align: center;
		padding: 2rem;
		max-width: 400px;
	}

	.desktop-heart {
		width: 80px;
		height: 80px;
		margin: 0 auto 1.5rem;
		animation: heartbeat 1.5s ease-in-out infinite;
	}

	.desktop-heart svg {
		width: 100%;
		height: 100%;
	}

	.desktop-title {
		font-family: 'Pinyon Script', cursive;
		font-size: 3rem;
		color: #7a8b7f;
		margin-bottom: 0.5rem;
		line-height: 1.2;
	}

	.desktop-date {
		font-family: 'Cormorant Garamond', serif;
		font-size: 1.1rem;
		color: #8b9f8c;
		letter-spacing: 0.15em;
		margin-bottom: 2rem;
	}

	.desktop-divider {
		width: 60px;
		height: 2px;
		background: linear-gradient(to right, transparent, #c17557, transparent);
		margin: 0 auto 2rem;
	}

	.desktop-text {
		font-family: 'Cormorant Garamond', serif;
		font-size: 1.3rem;
		color: #5a6b5f;
		line-height: 1.8;
		margin-bottom: 2rem;
	}

	.desktop-text strong {
		color: #7a8b7f;
	}

	.desktop-phone-icon {
		width: 50px;
		height: 50px;
		margin: 0 auto;
		color: #c17557;
		animation: bounce 2s ease-in-out infinite;
	}

	.desktop-phone-icon svg {
		width: 100%;
		height: 100%;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}
	.loader-overlay {
		position: fixed;
		inset: 0;
		z-index: 200;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(to bottom, #fafaf8 0%, #f5f1ed 100%);
	}

	.loader {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.loader-heart {
		width: 60px;
		height: 60px;
		animation: heartbeat 1s ease-in-out infinite;
	}

	.loader-heart svg {
		width: 100%;
		height: 100%;
	}

	.loader-text {
		font-family: 'Cormorant Garamond', serif;
		font-size: 1.2rem;
		color: #7a8b7f;
		letter-spacing: 0.1em;
	}

	@keyframes heartbeat {
		0%,
		100% {
			transform: scale(1);
		}
		15%,
		35% {
			transform: scale(1.15);
		}
		25%,
		45% {
			transform: scale(1);
		}
	}
</style>
