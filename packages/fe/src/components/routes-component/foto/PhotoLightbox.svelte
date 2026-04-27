<script lang="ts">
	import { fullUrl, type Photo } from '$lib/api/cloudinary';
	import { LL } from '$lib/i18n/i18n-svelte';

	interface Props {
		isOpen: boolean;
		photos: Photo[];
		currentIndex: number;
		onClose: () => void;
		onIndexChange: (index: number) => void;
	}

	let { isOpen, photos, currentIndex, onClose, onIndexChange }: Props = $props();

	let touchStartX = $state(0);
	let touchEndX = $state(0);

	const SWIPE_THRESHOLD = 50;

	const goPrev = () => {
		if (currentIndex > 0) onIndexChange(currentIndex - 1);
	};

	const goNext = () => {
		if (currentIndex < photos.length - 1) onIndexChange(currentIndex + 1);
	};

	const handleKeydown = (e: KeyboardEvent) => {
		if (!isOpen) return;
		if (e.key === 'Escape') onClose();
		if (e.key === 'ArrowLeft') goPrev();
		if (e.key === 'ArrowRight') goNext();
	};

	const handleTouchStart = (e: TouchEvent) => {
		touchStartX = e.touches[0].clientX;
	};

	const handleTouchEnd = (e: TouchEvent) => {
		touchEndX = e.changedTouches[0].clientX;
		const delta = touchEndX - touchStartX;
		if (Math.abs(delta) < SWIPE_THRESHOLD) return;
		if (delta > 0) goPrev();
		else goNext();
	};

	$effect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	});

	const currentPhoto = $derived(photos[currentIndex]);
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen && currentPhoto}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="lightbox-overlay"
		onclick={(e) => {
			if (e.target === e.currentTarget) onClose();
		}}
		ontouchstart={handleTouchStart}
		ontouchend={handleTouchEnd}
		role="dialog"
		aria-modal="true"
	>
		<button class="close-btn" onclick={onClose} aria-label={$LL.gallery.close()}>
			<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>

		{#if currentIndex > 0}
			<button class="nav-btn prev" onclick={goPrev} aria-label={$LL.gallery.previous()}>
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</button>
		{/if}

		{#if currentIndex < photos.length - 1}
			<button class="nav-btn next" onclick={goNext} aria-label={$LL.gallery.next()}>
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		{/if}

		<img class="photo" src={fullUrl(currentPhoto, 2000)} alt="" />

		<p class="counter">{currentIndex + 1} / {photos.length}</p>
	</div>
{/if}

<style>
	.lightbox-overlay {
		position: fixed;
		inset: 0;
		z-index: 200;
		background: rgba(0, 0, 0, 0.92);
		display: flex;
		align-items: center;
		justify-content: center;
		animation: fadeIn 0.2s ease;
	}

	.photo {
		max-width: 95vw;
		max-height: 90vh;
		object-fit: contain;
		user-select: none;
		-webkit-user-drag: none;
	}

	.close-btn {
		position: absolute;
		top: 1rem;
		right: 1rem;
		width: 44px;
		height: 44px;
		padding: 0.5rem;
		background: rgba(255, 255, 255, 0.15);
		border: none;
		border-radius: 50%;
		color: white;
		cursor: pointer;
		backdrop-filter: blur(4px);
		transition: background 0.2s ease;
	}

	.close-btn:active {
		background: rgba(255, 255, 255, 0.25);
	}

	.close-btn svg {
		width: 100%;
		height: 100%;
	}

	.nav-btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 44px;
		height: 44px;
		padding: 0.5rem;
		background: rgba(255, 255, 255, 0.15);
		border: none;
		border-radius: 50%;
		color: white;
		cursor: pointer;
		backdrop-filter: blur(4px);
		transition: background 0.2s ease;
	}

	.nav-btn:active {
		background: rgba(255, 255, 255, 0.25);
	}

	.nav-btn.prev {
		left: 1rem;
	}

	.nav-btn.next {
		right: 1rem;
	}

	.nav-btn svg {
		width: 100%;
		height: 100%;
	}

	.counter {
		position: absolute;
		bottom: 1rem;
		left: 50%;
		transform: translateX(-50%);
		font-family: 'Cormorant Garamond', serif;
		color: white;
		font-size: 1rem;
		background: rgba(0, 0, 0, 0.4);
		padding: 0.3rem 0.8rem;
		border-radius: 999px;
		backdrop-filter: blur(4px);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
