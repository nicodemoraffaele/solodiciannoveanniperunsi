<script lang="ts">
	import { listPhotos, type Photo } from '$lib/api/cloudinary';
	import { LL } from '$lib/i18n/i18n-svelte';
	import { photosAvailable } from '$lib/utils/photosGate';
	import PhotoGrid from '$components/routes-component/foto/PhotoGrid.svelte';
	import PhotoLightbox from '$components/routes-component/foto/PhotoLightbox.svelte';
	import PhotoUploader from '$components/routes-component/foto/PhotoUploader.svelte';

	let isAvailable = $state(photosAvailable());

	let photos = $state<Photo[]>([]);
	let isLoading = $state(true);
	let listError = $state<string | null>(null);

	let lightboxOpen = $state(false);
	let lightboxIndex = $state(0);

	const fetchList = async () => {
		isLoading = true;
		listError = null;
		try {
			photos = await listPhotos();
		} catch (err) {
			listError = err instanceof Error ? err.message : $LL.gallery.listError();
		} finally {
			isLoading = false;
		}
	};

	const handleUploaded = (photo: Photo) => {
		photos = [photo, ...photos.filter((p) => p.publicId !== photo.publicId)];
	};

	const openLightbox = (index: number) => {
		lightboxIndex = index;
		lightboxOpen = true;
	};

	$effect(() => {
		if (isAvailable) fetchList();
	});
</script>

<svelte:head>
	<title>{$LL.gallery.pageTitle()}</title>
	<meta name="robots" content="noindex, nofollow" />
	<meta name="googlebot" content="noindex, nofollow" />
</svelte:head>

<div class="overflow-hidden">
	<div class="mx-auto px-4">
		<div class="font-cormorand border-champagne page-card rounded-xl border-2 p-6 font-medium">
			{#if !isAvailable}
				<div class="pre-release">
					<div class="heart">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
							<path
								d="M50 85 C30 70, 10 55, 10 35 C10 20, 20 10, 30 10 C40 10, 45 15, 50 25 C55 15, 60 10, 70 10 C80 10, 90 20, 90 35 C90 55, 70 70, 50 85 Z"
								fill="#7A8B7F"
							/>
						</svg>
					</div>
					<h2 class="title">{$LL.gallery.preReleaseTitle()}</h2>
					<p class="message">{$LL.gallery.preReleaseMessage()}</p>
				</div>
			{:else}
				<header class="header">
					<h1 class="title">{$LL.gallery.heading()}</h1>
					<p class="intro">{$LL.gallery.intro()}</p>
				</header>

				<div class="uploader-wrapper">
					<PhotoUploader onUploaded={handleUploaded} />
				</div>

				<div class="gallery-section">
					<div class="gallery-header">
						<button
							class="refresh-btn"
							onclick={fetchList}
							disabled={isLoading}
							aria-label={$LL.gallery.refresh()}
						>
							<svg class:spinning={isLoading} fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
							<span>{$LL.gallery.refresh()}</span>
						</button>
					</div>

					{#if isLoading && photos.length === 0}
						<p class="state-message">{$LL.gallery.loadingPhotos()}</p>
					{:else if listError && photos.length === 0}
						<p class="state-message error">{listError}</p>
					{:else if photos.length === 0}
						<p class="state-message">{$LL.gallery.emptyState()}</p>
					{:else}
						<PhotoGrid {photos} onPhotoClick={openLightbox} />
					{/if}
				</div>

				<PhotoLightbox
					isOpen={lightboxOpen}
					{photos}
					currentIndex={lightboxIndex}
					onClose={() => (lightboxOpen = false)}
					onIndexChange={(i) => (lightboxIndex = i)}
				/>
			{/if}
		</div>
	</div>
</div>

<style>
	.font-cormorand {
		font-family: 'Cormorant Garamond', serif;
		color: #5a6b5f;
		line-height: 1.8;
		font-size: 1.05rem;
	}

	.border-champagne {
		border-color: #c17557;
	}

	.page-card {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.header {
		text-align: center;
	}

	.title {
		font-family: 'Pinyon Script', cursive;
		font-size: 2.4rem;
		color: #7a8b7f;
		margin: 0 0 0.5rem 0;
		line-height: 1.2;
	}

	.intro {
		font-size: 1rem;
		margin: 0;
	}

	.uploader-wrapper {
		padding: 1rem;
		background: #fafaf8;
		border-radius: 0.75rem;
	}

	.gallery-section {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.gallery-header {
		display: flex;
		justify-content: flex-end;
	}

	.refresh-btn {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.4rem 0.9rem;
		background: white;
		border: 1px solid #d5cec5;
		border-radius: 999px;
		color: #5a6b5f;
		font-family: 'Cormorant Garamond', serif;
		font-size: 0.95rem;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.refresh-btn:not(:disabled):hover {
		background: #f5f1ed;
	}

	.refresh-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.refresh-btn svg {
		width: 16px;
		height: 16px;
	}

	.refresh-btn svg.spinning {
		animation: spin 1s linear infinite;
	}

	.state-message {
		text-align: center;
		padding: 2rem 1rem;
		color: #8b9f8c;
		font-style: italic;
	}

	.state-message.error {
		color: #b0413e;
	}

	.pre-release {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		text-align: center;
		padding: 2rem 1rem;
	}

	.heart {
		width: 60px;
		height: 60px;
		animation: heartbeat 1.5s ease-in-out infinite;
	}

	.heart svg {
		width: 100%;
		height: 100%;
	}

	.message {
		font-size: 1.05rem;
		color: #5a6b5f;
		max-width: 320px;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
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
