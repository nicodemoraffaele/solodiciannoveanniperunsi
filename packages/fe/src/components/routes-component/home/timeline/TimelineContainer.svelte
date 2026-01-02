<script lang="ts">
	import { base } from '$app/paths';
	import { LL } from '$lib/i18n/i18n-svelte';
	import { MILESTONE_ORDER, MILESTONE_POSITIONS, MILESTONE_IMAGES } from '$lib/data/milestones';
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
	const showArrows = false; // Set to true to re-enable arrows

	// Road paths
	let roadPath = $state<string>('');
	let roadVisible = $state(false);
	const showRoad = true; // Toggle for road

	// Calculate the serpentine road path
	const calculateRoad = () => {
		if (!timelineContainer) return;

		const containerRect = timelineContainer.getBoundingClientRect();
		const points: { x: number; y: number }[] = [];

		// Collect center points of all milestone cards
		for (const milestoneId of MILESTONE_ORDER) {
			const element = timelineContainer.querySelector(`[data-milestone="${milestoneId}"]`);
			if (element) {
				const rect = element.getBoundingClientRect();
				points.push({
					x: rect.left + rect.width / 2 - containerRect.left,
					y: rect.top + rect.height / 2 - containerRect.top,
				});
			}
		}

		if (points.length < 2) return;

		// Build a smooth path through all points using cubic bezier curves
		let path = `M ${points[0].x} ${points[0].y}`;

		for (let i = 0; i < points.length - 1; i++) {
			const current = points[i];
			const next = points[i + 1];

			if (isMobile) {
				// Mobile: S-curve with vertical movement
				const midY = (current.y + next.y) / 2;
				const controlX1 = current.x;
				const controlY1 = midY;
				const controlX2 = next.x;
				const controlY2 = midY;
				path += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${next.x} ${next.y}`;
			} else {
				// Desktop: wavy S-curve with alternating direction
				const waveAmplitude = 100; // Height of the wave
				// Alternate wave direction for each segment
				const waveDirection = i % 2 === 0 ? 1 : -1;

				const controlX1 = current.x + (next.x - current.x) * 0.3;
				const controlY1 = current.y + waveAmplitude * waveDirection;
				const controlX2 = current.x + (next.x - current.x) * 0.7;
				const controlY2 = next.y - waveAmplitude * waveDirection;
				path += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${next.x} ${next.y}`;
			}
		}

		roadPath = path;
		roadVisible = true;
	};

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
			// Recalculate arrows and road when switching views
			setTimeout(() => {
				calculateArrows();
				calculateRoad();
			}, 200);
		};

		checkViewport();
		window.addEventListener('resize', checkViewport);

		return () => {
			window.removeEventListener('resize', checkViewport);
		};
	});

	// Calculate arrows and road after timeline is rendered
	$effect(() => {
		if (timelineContainer) {
			setTimeout(() => {
				calculateArrows();
				calculateRoad();
			}, 200);
		}
	});
</script>

<div class="timeline-container">
	{#if isMobile}
		<!-- Mobile: Vertical timeline with alternating sides -->
		<div class="mobile-timeline" bind:this={timelineContainer}>
			<!-- SVG layer for serpentine road -->
			{#if showRoad && roadVisible && roadPath}
				<svg class="road-svg">
					<!-- Road background (wider, darker) -->
					<path
						d={roadPath}
						fill="none"
						stroke="#D5CEC5"
						stroke-width="24"
						stroke-linecap="round"
						stroke-linejoin="round"
						opacity="0.6"
					/>
					<!-- Road center line (dashed) -->
					<path
						d={roadPath}
						fill="none"
						stroke="#8B9F8C"
						stroke-width="4"
						stroke-dasharray="14,10"
						stroke-linecap="round"
						opacity="0.8"
					/>
				</svg>
			{/if}

			{#each MILESTONE_ORDER as milestoneId, index}
				{@const milestone = getMilestone(milestoneId)}
				{@const isLeft = index % 2 === 0}
				<div class="mobile-timeline-item {isLeft ? 'left' : 'right'}">
					<TimelineDateItem
						id={milestoneId}
						date={milestone.date()}
						location={milestone.location()}
						offsetY={0}
						isSpecial={milestoneId === 'wedding'}
						onOpen={() => openMilestonePopup(milestoneId)}
						image={MILESTONE_IMAGES[milestoneId]}
					/>
				</div>
			{/each}

			<!-- SVG layer for mobile arrows -->
			{#if showArrows && arrowsVisible}
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
						location={milestone.location()}
						offsetY={0}
						isSpecial={milestoneId === 'wedding'}
						onOpen={() => openMilestonePopup(milestoneId)}
						image={MILESTONE_IMAGES[milestoneId]}
					/>
				{/each}
			</div>
			<div class="tablet-row bottom-row">
				{#each MILESTONE_ORDER.slice(3, 6) as milestoneId}
					{@const milestone = getMilestone(milestoneId)}
					<TimelineDateItem
						id={milestoneId}
						date={milestone.date()}
						location={milestone.location()}
						offsetY={0}
						isSpecial={milestoneId === 'wedding'}
						onOpen={() => openMilestonePopup(milestoneId)}
						image={MILESTONE_IMAGES[milestoneId]}
					/>
				{/each}
			</div>

			<!-- SVG layer for tablet arrows -->
			{#if showArrows && arrowsVisible}
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
			<!-- SVG layer for serpentine road -->
			{#if showRoad && roadVisible && roadPath}
				<svg class="road-svg">
					<!-- Road background (wider, darker) -->
					<path
						d={roadPath}
						fill="none"
						stroke="#D5CEC5"
						stroke-width="24"
						stroke-linecap="round"
						stroke-linejoin="round"
						opacity="0.6"
					/>
					<!-- Road center line (dashed) -->
					<path
						d={roadPath}
						fill="none"
						stroke="#8B9F8C"
						stroke-width="4"
						stroke-dasharray="14,10"
						stroke-linecap="round"
						opacity="0.8"
					/>
				</svg>
			{/if}

			{#each MILESTONE_ORDER as milestoneId, index}
				{@const milestone = getMilestone(milestoneId)}
				{@const position = MILESTONE_POSITIONS[milestoneId]}
				<TimelineDateItem
					id={milestoneId}
					date={milestone.date()}
					location={milestone.location()}
					offsetY={position.offsetY}
					isSpecial={milestoneId === 'wedding'}
					onOpen={() => openMilestonePopup(milestoneId)}
					image={MILESTONE_IMAGES[milestoneId]}
				/>
			{/each}

			<!-- SVG layer for all arrows -->
			{#if showArrows && arrowsVisible}
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
					imageUrl: `${base}/pieve_1.jpg`,
				}}
				reception={{
					title: wedding.reception.title(),
					name: wedding.reception.name(),
					address: wedding.reception.address(),
					time: wedding.reception.time(),
					description: wedding.reception.description(),
					imageUrl: `${base}/borgo_1.png`,
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
		padding-top: 4rem;
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

	.road-svg {
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
