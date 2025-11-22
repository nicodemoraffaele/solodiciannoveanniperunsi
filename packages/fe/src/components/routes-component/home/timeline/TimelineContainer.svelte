<script lang="ts">
	import { LL } from '$lib/i18n/i18n-svelte';
	import { MILESTONE_ORDER, MILESTONE_POSITIONS } from '$lib/data/milestones';
	import type { MilestoneType } from '$lib/types/milestone';
	import TimelineDateItem from './TimelineDateItem.svelte';
	import DatePopup from '$components/common/popup/DatePopup.svelte';
	import WeddingDatePopup from './WeddingDatePopup.svelte';
	import HoneymoonPopup from './HoneymoonPopup.svelte';

	let openPopup = $state<MilestoneType | null>(null);
	let isMobile = $state(false);
	let isTablet = $state(false);
	let timelineContainer: HTMLElement | undefined = $state();
	let arrows = $state<Record<string, { path: string; arrowTransform: string }>>({});
	let arrowsVisible = $state(false);

	const openMilestonePopup = (id: MilestoneType) => {
		openPopup = id;
	};

	const closePopup = () => {
		openPopup = null;
	};

	// Calculate arrow paths after elements are rendered
	const calculateArrows = () => {
		if (!timelineContainer) return;

		const newArrows: Record<string, { path: string; arrowTransform: string }> = {};

		for (let i = 0; i < MILESTONE_ORDER.length - 1; i++) {
			const fromId = MILESTONE_ORDER[i];
			const toId = MILESTONE_ORDER[i + 1];

			const fromElement = timelineContainer.querySelector(`[data-milestone="${fromId}"]`);
			const toElement = timelineContainer.querySelector(`[data-milestone="${toId}"]`);

			if (fromElement && toElement) {
				const fromRect = fromElement.getBoundingClientRect();
				const toRect = toElement.getBoundingClientRect();
				const containerRect = timelineContainer.getBoundingClientRect();

				// Calculate relative positions with offset from buttons
				let startX, startY, endX, endY;
				const gap = 15; // Gap between arrow and button

				if (isMobile) {
					// Mobile: from bottom of current to top of next
					startX = fromRect.left + fromRect.width / 2 - containerRect.left;
					startY = fromRect.bottom - containerRect.top + gap;
					endX = toRect.left + toRect.width / 2 - containerRect.left;
					endY = toRect.top - containerRect.top - gap;
				} else if (isTablet) {
					// Tablet: handle both horizontal (within row) and diagonal (between rows)
					const isInSameRow = Math.abs(fromRect.top - toRect.top) < 50;

					if (isInSameRow) {
						// Horizontal within same row: right to left
						startX = fromRect.right - containerRect.left + gap;
						startY = fromRect.top + fromRect.height / 2 - containerRect.top;
						endX = toRect.left - containerRect.left - gap;
						endY = toRect.top + toRect.height / 2 - containerRect.top;
					} else {
						// Between rows: from bottom-right to top-left
						startX = fromRect.right - containerRect.left;
						startY = fromRect.bottom - containerRect.top + gap;
						endX = toRect.left - containerRect.left;
						endY = toRect.top - containerRect.top - gap;
					}
				} else {
					// Desktop: from right of current to left of next (middle height)
					startX = fromRect.right - containerRect.left + gap;
					startY = fromRect.top + fromRect.height / 2 - containerRect.top;
					endX = toRect.left - containerRect.left - gap;
					endY = toRect.top + toRect.height / 2 - containerRect.top;
				}

				// Control points for cubic bezier curve (two control points for S-curve)
				const verticalDiff = endY - startY;
				const horizontalDiff = endX - startX;

				let controlX1, controlY1, controlX2, controlY2;

				if (isMobile) {
					// Mobile: S-curve with two control points
					const midX = (startX + endX) / 2;

					controlX1 = midX;
					controlY1 = startY + (endY - startY) * 0.25;
					controlX2 = midX;
					controlY2 = startY + (endY - startY) * 0.75;
				} else if (isTablet) {
					// Tablet: different curves for same row vs between rows
					const isInSameRow = Math.abs(verticalDiff) < 50;

					if (isInSameRow) {
						// Same row: exaggerated wavy horizontal curve
						controlX1 = startX + horizontalDiff * 0.33;
						controlY1 = startY + verticalDiff * 2.5; // Much more vertical deviation
						controlX2 = startX + horizontalDiff * 0.66;
						controlY2 = endY - verticalDiff * 2; // Opposite direction
					} else {
						// Between rows: S-curve diagonal
						controlX1 = startX + horizontalDiff * 0.3;
						controlY1 = startY + verticalDiff * 0.3;
						controlX2 = endX - horizontalDiff * 0.3;
						controlY2 = endY - verticalDiff * 0.3;
					}
				} else {
					// Desktop: exaggerated wavy S-curve with vertical emphasis
					const midY = (startY + endY) / 2;
					// First control point goes DOWN (or UP opposite to natural flow)
					controlX1 = startX + horizontalDiff * 0.33;
					controlY1 = midY + verticalDiff * 1.2; // Exaggerate opposite direction
					// Second control point continues the wave
					controlX2 = startX + horizontalDiff * 0.66;
					controlY2 = midY - verticalDiff * 1.2; // Opposite to first control point
				}

				// Create the path with cubic bezier (C command)
				const path = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;

				// Calculate angle for arrow head based on the last control point
				const angle = (Math.atan2(endY - controlY2, endX - controlX2) * 180) / Math.PI;
				const arrowTransform = `translate(${endX}, ${endY}) rotate(${angle})`;

				newArrows[`${fromId}-${toId}`] = { path, arrowTransform };
			}
		}

		arrows = newArrows;
		arrowsVisible = true;
	};

	// Helper to get milestone data
	const getMilestone = (id: MilestoneType) => {
		const milestones = $LL.milestones;
		switch (id) {
			case 'firstMeeting':
				return milestones.firstMeeting;
			case 'engagement':
				return milestones.engagement;
			case 'movingTogether':
				return milestones.movingTogether;
			case 'proposal':
				return milestones.proposal;
			case 'wedding':
				return milestones.wedding;
			case 'honeymoon':
				return milestones.honeymoon;
		}
	};

	// Detect viewport size on mount and window resize
	$effect(() => {
		const checkViewport = () => {
			const width = window.innerWidth;
			isMobile = width < 768;
			isTablet = width >= 768 && width < 1200;
			// Recalculate arrows when switching views
			setTimeout(calculateArrows, 200);
		};

		checkViewport();
		window.addEventListener('resize', checkViewport);

		return () => {
			window.removeEventListener('resize', checkViewport);
		};
	});

	// Calculate arrows after timeline is rendered
	$effect(() => {
		if (timelineContainer) {
			setTimeout(calculateArrows, 200);
		}
	});
</script>

<div class="timeline-container">
	{#if isMobile}
		<!-- Mobile: Vertical timeline with alternating sides -->
		<div class="mobile-timeline" bind:this={timelineContainer}>
			{#each MILESTONE_ORDER as milestoneId, index}
				{@const milestone = getMilestone(milestoneId)}
				{@const isLeft = index % 2 === 0}
				<div class="mobile-timeline-item {isLeft ? 'left' : 'right'}">
					<TimelineDateItem
						id={milestoneId}
						date={milestone.date()}
						offsetY={0}
						isSpecial={milestoneId === 'wedding'}
						onOpen={() => openMilestonePopup(milestoneId)}
					/>
				</div>
			{/each}

			<!-- SVG layer for mobile arrows -->
			{#if arrowsVisible}
				<svg class="arrows-svg">
					{#each MILESTONE_ORDER as milestoneId, index}
						{#if index < MILESTONE_ORDER.length - 1}
							{@const nextMilestoneId = MILESTONE_ORDER[index + 1]}
							{@const arrow = arrows[`${milestoneId}-${nextMilestoneId}`]}
							{#if arrow}
								<path
									d={arrow.path}
									fill="none"
									stroke="#8B9F8C"
									stroke-width="2.5"
									stroke-dasharray="8,5"
									opacity="0.6"
								/>
								<path
									d="M 0 0 L -8 -4 L -8 4 Z"
									fill="#8B9F8C"
									opacity="0.6"
									transform={arrow.arrowTransform}
								/>
							{/if}
						{/if}
					{/each}
				</svg>
			{/if}
		</div>
	{:else if isTablet}
		<!-- Tablet: Two rows of 3 buttons -->
		<div class="tablet-timeline" bind:this={timelineContainer}>
			<div class="tablet-row top-row">
				{#each MILESTONE_ORDER.slice(0, 3) as milestoneId}
					{@const milestone = getMilestone(milestoneId)}
					<TimelineDateItem
						id={milestoneId}
						date={milestone.date()}
						offsetY={0}
						isSpecial={milestoneId === 'wedding'}
						onOpen={() => openMilestonePopup(milestoneId)}
					/>
				{/each}
			</div>
			<div class="tablet-row bottom-row">
				{#each MILESTONE_ORDER.slice(3, 6) as milestoneId}
					{@const milestone = getMilestone(milestoneId)}
					<TimelineDateItem
						id={milestoneId}
						date={milestone.date()}
						offsetY={0}
						isSpecial={milestoneId === 'wedding'}
						onOpen={() => openMilestonePopup(milestoneId)}
					/>
				{/each}
			</div>

			<!-- SVG layer for tablet arrows -->
			{#if arrowsVisible}
				<svg class="arrows-svg">
					{#each MILESTONE_ORDER as milestoneId, index}
						{#if index < MILESTONE_ORDER.length - 1}
							{@const nextMilestoneId = MILESTONE_ORDER[index + 1]}
							{@const arrow = arrows[`${milestoneId}-${nextMilestoneId}`]}
							{#if arrow}
								<path
									d={arrow.path}
									fill="none"
									stroke="#8B9F8C"
									stroke-width="3"
									stroke-dasharray="10,6"
									opacity="0.7"
								/>
								<path
									d="M 0 0 L -10 -5 L -10 5 Z"
									fill="#8B9F8C"
									opacity="0.7"
									transform={arrow.arrowTransform}
								/>
							{/if}
						{/if}
					{/each}
				</svg>
			{/if}
		</div>
	{:else}
		<!-- Desktop: Horizontal timeline with different heights -->
		<div class="desktop-timeline" bind:this={timelineContainer}>
			{#each MILESTONE_ORDER as milestoneId, index}
				{@const milestone = getMilestone(milestoneId)}
				{@const position = MILESTONE_POSITIONS[milestoneId]}
				<TimelineDateItem
					id={milestoneId}
					date={milestone.date()}
					offsetY={position.offsetY}
					isSpecial={milestoneId === 'wedding'}
					onOpen={() => openMilestonePopup(milestoneId)}
				/>
			{/each}

			<!-- SVG layer for all arrows -->
			{#if arrowsVisible}
				<svg class="arrows-svg">
					{#each MILESTONE_ORDER as milestoneId, index}
						{#if index < MILESTONE_ORDER.length - 1}
							{@const nextMilestoneId = MILESTONE_ORDER[index + 1]}
							{@const arrow = arrows[`${milestoneId}-${nextMilestoneId}`]}
							{#if arrow}
								<path
									d={arrow.path}
									fill="none"
									stroke="#8B9F8C"
									stroke-width="3"
									stroke-dasharray="10,6"
									opacity="0.7"
								/>
								<path
									d="M 0 0 L -10 -5 L -10 5 Z"
									fill="#8B9F8C"
									opacity="0.7"
									transform={arrow.arrowTransform}
								/>
							{/if}
						{/if}
					{/each}
				</svg>
			{/if}
		</div>
	{/if}

	<!-- Popups -->
	{#each MILESTONE_ORDER as milestoneId}
		{#if milestoneId === 'wedding'}
			{@const wedding = $LL.milestones.wedding}
			<WeddingDatePopup
				isOpen={openPopup === 'wedding'}
				onClose={closePopup}
				date={wedding.date()}
				title={wedding.title()}
				description={wedding.description()}
				church={{
					title: wedding.church.title(),
					name: wedding.church.name(),
					address: wedding.church.address(),
					time: wedding.church.time(),
					description: wedding.church.description(),
				}}
				reception={{
					title: wedding.reception.title(),
					name: wedding.reception.name(),
					address: wedding.reception.address(),
					time: wedding.reception.time(),
					description: wedding.reception.description(),
				}}
			/>
		{:else if milestoneId === 'honeymoon'}
			{@const honeymoon = $LL.milestones.honeymoon}
			<HoneymoonPopup
				isOpen={openPopup === 'honeymoon'}
				onClose={closePopup}
				date={honeymoon.date()}
				title={honeymoon.title()}
				description={honeymoon.description()}
				giftMessage={honeymoon.giftMessage()}
				giftDescription={honeymoon.giftDescription()}
				ibanLabel={honeymoon.ibanLabel()}
				ibanValue={honeymoon.ibanValue()}
				ibanNote={honeymoon.ibanNote()}
			/>
		{:else}
			{@const milestone = getMilestone(milestoneId)}
			<DatePopup
				isOpen={openPopup === milestoneId}
				onClose={closePopup}
				date={milestone.date()}
				title={milestone.title()}
			>
				<p class="leading-relaxed">{milestone.description()}</p>
			</DatePopup>
		{/if}
	{/each}
</div>

<style>
	.timeline-container {
		width: 100%;
		margin: 0 auto;
		overflow-x: auto;
	}

	.desktop-timeline {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		flex-wrap: nowrap;
		gap: 0;
		padding: 4rem 3rem 0rem 3rem;
		min-height: 500px;
		width: 100%;
	}

	.mobile-timeline {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 4rem;
		padding: 2rem 1rem;
	}

	.mobile-timeline-item {
		display: flex;
		width: 100%;
	}

	.mobile-timeline-item.left {
		justify-content: flex-start;
		padding-right: 50%;
	}

	.mobile-timeline-item.right {
		justify-content: flex-end;
		padding-left: 50%;
	}

	.mobile-timeline-item :global(.timeline-item) {
		width: 100%;
		max-width: 160px;
	}

	.tablet-timeline {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 5rem;
		padding: 3rem 2rem;
		min-height: 400px;
	}

	.tablet-row {
		display: flex;
		justify-content: space-around;
		align-items: center;
		gap: 1.5rem;
	}

	.tablet-row :global(.timeline-item) {
		flex-shrink: 0;
	}

	.arrows-svg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 0;
		overflow: visible;
	}

	@media (max-width: 768px) {
		.timeline-container {
			padding: 1rem 0.5rem;
		}
	}
</style>
