<script lang="ts">
	import type { MilestoneType } from '$lib/types/milestone';
	import { base } from '$app/paths';

	interface Props {
		id: MilestoneType;
		date: string;
		location: string;
		offsetY: number;
		isSpecial?: boolean;
		onOpen: () => void;
		image?: string;
	}

	let { id, date, location, offsetY, isSpecial = false, onOpen, image }: Props = $props();

	let isHovered = $state(false);

	const handleMouseEnter = () => {
		isHovered = true;
	};

	const handleMouseLeave = () => {
		isHovered = false;
	};

	const handleClick = () => {
		onOpen();
	};
</script>

<div
	class="timeline-item {isSpecial ? 'special' : ''}"
	style="transform: translateY({offsetY}%);"
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onclick={handleClick}
	role="button"
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && handleClick()}
	data-milestone={id}
>
	<div class="date-card {isHovered ? 'hovered' : ''}">
		{#if image}
			<div class="date-image">
				<img src="{base}/{image}" alt="" />
			</div>
		{/if}
		<div class="date-content">
			<div class="date-info">
				<p class="date-location">{location}</p>
				<p class="date-text">{date}</p>
			</div>

			{#if isSpecial}
				<div class="special-indicator">
					<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
						<path
							d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
						/>
					</svg>
				</div>
			{/if}
		</div>

		<div class="pulse-ring {isSpecial ? 'special-pulse' : ''}"></div>
	</div>
</div>

<style>
	.timeline-item {
		position: relative;
		cursor: pointer;
		transition: transform 0.3s ease;
		flex-shrink: 0;
		min-width: 240px;
		z-index: 1;
	}

	.date-card {
		position: relative;
		padding: 1rem 1.5rem;
		background: #ffffff;
		border-radius: 0.5rem;
		box-shadow: 0 2px 8px -1px rgba(90, 107, 95, 0.25);
		transition: all 0.3s ease;
		border: 2px solid #d5cec5;
		font-family: 'Cormorant Garamond', serif;
		width: 100%;
	}

	.date-card.hovered,
	.date-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 20px -4px rgba(90, 107, 95, 0.35);
		border-color: #7a8b7f;
		background: #ffffff;
	}

	.date-image {
		width: 100%;
		margin-bottom: 0.75rem;
		border-radius: 0.375rem;
		overflow: hidden;
	}

	.date-image img {
		width: 100%;
		height: 160px;
		object-fit: cover;
		opacity: 0.85;
		transition: opacity 0.3s ease;
	}

	.date-card.hovered .date-image img {
		opacity: 1;
	}

	.date-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.date-text {
		font-size: 1.1rem;
		font-weight: 500;
		color: #4a5b4f;
		white-space: nowrap;
		font-family: 'Cormorant Garamond', serif;
		letter-spacing: 0.03em;
	}

	.date-location {
		font-size: 1.1rem;
		font-weight: 500;
		color: #4a5b4f;
		white-space: nowrap;
		font-family: 'Cormorant Garamond', serif;
		letter-spacing: 0.03em;
	}

	.date-info {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.special-indicator {
		color: #c17557;
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	.pulse-ring {
		position: absolute;
		inset: -4px;
		border-radius: 1rem;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.date-card.hovered .pulse-ring {
		opacity: 1;
		animation: pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	.pulse-ring.special-pulse {
		border: 2px solid #8b9f8c;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	@keyframes pulse-ring {
		0% {
			transform: scale(1);
			opacity: 0.5;
		}
		100% {
			transform: scale(1.1);
			opacity: 0;
		}
	}

	/* Mobile styles */
	@media (max-width: 768px) {
		.timeline-item {
			transform: none !important;
		}

		.date-card {
			width: 100%;
		}
	}
</style>
