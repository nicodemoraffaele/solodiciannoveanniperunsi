import type { MilestonePosition, MilestoneType } from '$lib/types/milestone';

/**
 * Desktop layout positions for milestones
 * Each milestone has a different vertical offset to create visual interest
 * Dates are displayed horizontally from left to right at different heights
 */
export const MILESTONE_POSITIONS: Record<MilestoneType, MilestonePosition> = {
	firstMeeting: {
		id: 'firstMeeting',
		offsetY: 350, // Much higher
	},
	engagement: {
		id: 'engagement',
		offsetY: -50, // Much lower
	},
	movingTogether: {
		id: 'movingTogether',
		offsetY: 250, // Medium high
	},
	proposal: {
		id: 'proposal',
		offsetY: 0, // Very low
	},
	wedding: {
		id: 'wedding',
		offsetY: 300, // Center - most important
	},
	honeymoon: {
		id: 'honeymoon',
		offsetY: -100, // Medium low
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
