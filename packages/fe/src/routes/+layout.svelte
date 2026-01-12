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
	<HamburgerMenu />
	{@render children()}
{/if}

<style>
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
