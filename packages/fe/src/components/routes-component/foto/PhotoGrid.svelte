<script lang="ts">
	import { thumbnailUrl, type Photo } from '$lib/api/cloudinary';

	interface Props {
		photos: Photo[];
		onPhotoClick: (index: number) => void;
	}

	let { photos, onPhotoClick }: Props = $props();
</script>

<div class="grid">
	{#each photos as photo, index (photo.publicId)}
		<button class="cell" onclick={() => onPhotoClick(index)} aria-label="Apri foto">
			<img src={thumbnailUrl(photo, 400)} alt="" loading="lazy" decoding="async" />
		</button>
	{/each}
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.4rem;
	}

	.cell {
		position: relative;
		aspect-ratio: 1;
		padding: 0;
		border: none;
		background: #e8e5e1;
		border-radius: 0.5rem;
		overflow: hidden;
		cursor: pointer;
		transition: transform 0.15s ease;
	}

	.cell:active {
		transform: scale(0.97);
	}

	.cell img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	@media (max-width: 480px) {
		.grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (min-width: 481px) and (max-width: 767px) {
		.grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}
</style>
