<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		title: string;
		date: string;
		children: Snippet;
		size?: 'small' | 'medium' | 'large';
	}

	let { isOpen = false, onClose, title, date, children, size = 'medium' }: Props = $props();

	const sizeClasses = {
		small: 'max-w-md',
		medium: 'max-w-2xl',
		large: 'max-w-4xl',
	};

	const handleBackdropClick = (e: MouseEvent) => {
		// Only close if clicking directly on the backdrop, not on the popup content
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	const handlePopupClick = (e: MouseEvent) => {
		// Prevent the click from bubbling up to the backdrop
		e.stopPropagation();
	};

	// Disable body scroll when popup is open
	$effect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		// Cleanup: restore scroll on unmount
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		onclick={handleBackdropClick}
		role="dialog"
		aria-modal="true"
	>
		<div
			class="relative w-full {sizeClasses[size]} animate-fadeIn rounded-2xl bg-white p-6 shadow-2xl md:p-8"
			onclick={handlePopupClick}
		>
			<!-- Close button -->
			<button
				onclick={onClose}
				class="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
				aria-label="Chiudi popup"
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<!-- Header -->
			<div class="mb-6 border-b border-gray-200 pb-4">
				<p class="mb-2 text-sm font-medium uppercase tracking-wider text-pink-600">{date}</p>
				<h2 class="text-3xl font-serif text-gray-800">{title}</h2>
			</div>

			<!-- Content -->
			<div class="text-gray-700">
				{@render children()}
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.animate-fadeIn {
		animation: fadeIn 0.2s ease-out;
	}
</style>
