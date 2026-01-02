import type { MilestonePosition, MilestoneType } from '$lib/types/milestone';

/**
 * Images for each milestone
 */
export const MILESTONE_IMAGES: Record<MilestoneType, string | undefined> = {
	firstMeeting: 'scuola_verde.webp',
	engagement: 'siena_duomo_verde.webp',
	movingTogether: 'duomo_milano_verde.webp',
	proposal: 'miliscola_verde.webp',
	wedding: 'borgo_verde.webp',
	honeymoon: 'honeymoon_6.webp',
};

/**
 * Desktop layout positions for milestones
 * Each milestone has a different vertical offset to create visual interest
 * Dates are displayed horizontally from left to right at different heights
 */
export const MILESTONE_POSITIONS: Record<MilestoneType, MilestonePosition> = {
	firstMeeting: {
		id: 'firstMeeting',
		offsetY: 50, // Much higher
	},
	engagement: {
		id: 'engagement',
		offsetY: -50, // Much lower
	},
	movingTogether: {
		id: 'movingTogether',
		offsetY: 50, // Medium high
	},
	proposal: {
		id: 'proposal',
		offsetY: -50, // Very low
	},
	wedding: {
		id: 'wedding',
		offsetY: 50, // Center - most important
	},
	honeymoon: {
		id: 'honeymoon',
		offsetY: -50, // Medium low
	},
};

/**
 * Order of milestones for mobile (vertical timeline)
 */
export const MILESTONE_ORDER: MilestoneType[] = [
	'firstMeeting',
	'engagement',
	'movingTogether',
	'proposal',
	'wedding',
	'honeymoon',
];

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
	mobile: 768, // < 768px
	tablet: 1024, // 768px - 1024px
	desktop: 1024, // > 1024px
} as const;
