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

	const openMilestonePopup = (id: MilestoneType) => {
		openPopup = id;
	};

	const closePopup = () => {
		openPopup = null;
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

	// Detect mobile on mount and window resize
	$effect(() => {
		const checkMobile = () => {
			isMobile = window.innerWidth < 768;
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);

		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	});
</script>

<div class="timeline-container">
	{#if isMobile}
		<!-- Mobile: Vertical timeline -->
		<div class="mobile-timeline">
			{#each MILESTONE_ORDER as milestoneId}
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
	{:else}
		<!-- Desktop: Horizontal timeline with different heights -->
		<div class="desktop-timeline">
			{#each MILESTONE_ORDER as milestoneId}
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
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.desktop-timeline {
		display: flex;
		justify-content: space-around;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: 1.5rem;
		padding: 4rem 1rem;
		min-height: 400px;
	}

	@media (min-width: 1200px) {
		.desktop-timeline {
			flex-wrap: nowrap;
			gap: 2rem;
		}
	}

	.mobile-timeline {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 2rem 0;
	}

	@media (max-width: 768px) {
		.timeline-container {
			padding: 1rem 0.5rem;
		}
	}
</style>
