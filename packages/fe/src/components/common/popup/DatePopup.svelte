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

	const handleBackdropKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			onClose();
		}
	};

	const handlePopupClick = (e: MouseEvent) => {
		// Prevent the click from bubbling up to the backdrop
		e.stopPropagation();
	};

	const handlePopupKeydown = (e: KeyboardEvent) => {
		// Prevent the keydown from bubbling up to the backdrop
		e.stopPropagation();
	};

	let closeButtonRef: HTMLButtonElement | undefined = $state();

	const handleCloseHover = () => {
		if (closeButtonRef) {
			closeButtonRef.style.backgroundColor = '#F0EDE9';
		}
	};

	const handleCloseLeave = () => {
		if (closeButtonRef) {
			closeButtonRef.style.backgroundColor = 'transparent';
		}
	};
</script>

{#if isOpen}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		onclick={handleBackdropClick}
		onkeydown={handleBackdropKeydown}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			class="relative w-full {sizeClasses[size]} animate-fadeIn flex max-h-[90vh] flex-col rounded-lg"
			style="background: #FAFAF8; box-shadow: 0 20px 40px rgba(122, 139, 127, 0.15); border: 1px solid #E8E5E1;"
			onclick={handlePopupClick}
			onkeydown={handlePopupKeydown}
			role="document"
			tabindex="0"
		>
			<!-- Close button -->
			<button
				bind:this={closeButtonRef}
				onclick={onClose}
				onmouseenter={handleCloseHover}
				onmouseleave={handleCloseLeave}
				class="absolute right-4 top-4 z-10 rounded-full p-2 transition-colors"
				style="color: #8B9F8C;"
				aria-label="Chiudi popup"
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<div class="overflow-y-auto p-6 md:p-8">
				<!-- Header -->
				<div class="mb-6 border-b pb-4" style="border-color: #E8E5E1;">
					<p
						class="mb-2"
						style="font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; color: #C17557; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 300;"
					>
						{date}
					</p>
					<h2
						style="font-family: 'Pinyon Script', cursive; font-size: 2.5rem; color: #7A8B7F; line-height: 1.2;"
					>
						{title}
					</h2>
				</div>

				<!-- Content -->
				<div
					style="font-family: 'Cormorant Garamond', serif; color: #5A6B5F; line-height: 1.8; font-size: 1.05rem;"
				>
					{@render children()}
				</div>
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
