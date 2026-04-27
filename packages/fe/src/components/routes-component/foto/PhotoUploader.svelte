<script lang="ts">
	import { uploadPhoto, type Photo } from '$lib/api/cloudinary';
	import { ACCEPTED_MIME_TYPES, MAX_UPLOAD_SIZE_BYTES } from '$lib/config/cloudinary';
	import { LL } from '$lib/i18n/i18n-svelte';

	interface Props {
		onUploaded: (photo: Photo) => void;
	}

	let { onUploaded }: Props = $props();

	let cameraInput: HTMLInputElement | undefined = $state();
	let fileInput: HTMLInputElement | undefined = $state();

	let queue = $state<File[]>([]);
	let currentIndex = $state(0);
	let currentPercent = $state(0);
	let isUploading = $state(false);
	let errorMessage = $state<string | null>(null);

	const validate = (file: File): string | null => {
		if (file.size > MAX_UPLOAD_SIZE_BYTES) return $LL.gallery.uploadErrorTooLarge();
		if (!file.type.startsWith('image/')) return $LL.gallery.uploadErrorWrongType();
		return null;
	};

	const processQueue = async (files: File[]) => {
		if (files.length === 0) return;
		queue = files;
		currentIndex = 0;
		isUploading = true;
		errorMessage = null;

		for (let i = 0; i < files.length; i++) {
			currentIndex = i;
			currentPercent = 0;
			const file = files[i];
			const validationError = validate(file);
			if (validationError) {
				errorMessage = validationError;
				continue;
			}
			try {
				const photo = await uploadPhoto(file, (p) => {
					currentPercent = p.percent;
				});
				onUploaded(photo);
			} catch (err) {
				errorMessage = err instanceof Error ? err.message : $LL.gallery.uploadErrorGeneric();
			}
		}

		isUploading = false;
		queue = [];
		currentPercent = 0;
		if (cameraInput) cameraInput.value = '';
		if (fileInput) fileInput.value = '';
	};

	const handleCameraChange = (e: Event) => {
		const input = e.currentTarget as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			processQueue(Array.from(input.files));
		}
	};

	const handleFileChange = (e: Event) => {
		const input = e.currentTarget as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			processQueue(Array.from(input.files));
		}
	};
</script>

<div class="uploader">
	<div class="buttons">
		<button class="btn primary" onclick={() => cameraInput?.click()} disabled={isUploading}>
			<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
				/>
			</svg>
			<span>{$LL.gallery.takePhoto()}</span>
		</button>

		<button class="btn secondary" onclick={() => fileInput?.click()} disabled={isUploading}>
			<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
				/>
			</svg>
			<span>{$LL.gallery.uploadFromGallery()}</span>
		</button>
	</div>

	<input
		bind:this={cameraInput}
		type="file"
		accept="image/*"
		capture="environment"
		onchange={handleCameraChange}
		hidden
	/>
	<input bind:this={fileInput} type="file" accept={ACCEPTED_MIME_TYPES} multiple onchange={handleFileChange} hidden />

	{#if isUploading}
		<div class="progress-wrapper">
			<p class="progress-label">
				{$LL.gallery.uploadingLabel()} —
				{$LL.gallery.uploadProgress({ current: currentIndex + 1, total: queue.length })}
			</p>
			<div class="progress-bar">
				<div class="progress-fill" style="width: {currentPercent}%"></div>
			</div>
		</div>
	{/if}

	{#if errorMessage && !isUploading}
		<p class="error-message">{errorMessage}</p>
	{/if}
</div>

<style>
	.uploader {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.buttons {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
		padding: 0.85rem 1.2rem;
		font-family: 'Cormorant Garamond', serif;
		font-size: 1.15rem;
		font-weight: 600;
		border-radius: 0.75rem;
		border: 2px solid transparent;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn .icon {
		width: 22px;
		height: 22px;
		flex-shrink: 0;
	}

	.btn.primary {
		background: linear-gradient(135deg, #7a8b7f 0%, #8b9f8c 100%);
		color: white;
	}

	.btn.primary:not(:disabled):hover {
		box-shadow: 0 4px 12px rgba(122, 139, 127, 0.3);
	}

	.btn.secondary {
		background: white;
		color: #5a6b5f;
		border-color: #c17557;
	}

	.btn.secondary:not(:disabled):hover {
		background: #fef8f5;
	}

	.progress-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding: 0.6rem 0;
	}

	.progress-label {
		font-family: 'Cormorant Garamond', serif;
		color: #5a6b5f;
		font-size: 0.95rem;
	}

	.progress-bar {
		width: 100%;
		height: 8px;
		background: #e8e5e1;
		border-radius: 4px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #c17557 0%, #d68b6e 100%);
		transition: width 0.2s ease;
	}

	.error-message {
		font-family: 'Cormorant Garamond', serif;
		color: #b0413e;
		font-size: 0.95rem;
		padding: 0.5rem 0.75rem;
		background: #fdecea;
		border-radius: 0.5rem;
	}
</style>
