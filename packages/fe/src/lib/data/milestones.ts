import type { MilestonePosition, MilestoneType } from '$lib/types/milestone';

/**
 * Desktop layout positions for milestones
 * Each milestone has a different vertical offset to create visual interest
 * Dates are displayed horizontally from left to right at different heights
 */
export const MILESTONE_POSITIONS: Record<MilestoneType, MilestonePosition> = {
	firstMeeting: {
		id: 'firstMeeting',
		offsetY: 0, // Top position
	},
	engagement: {
		id: 'engagement',
		offsetY: 25, // Slightly lower
	},
	movingTogether: {
		id: 'movingTogether',
		offsetY: 15, // Medium-low
	},
	proposal: {
		id: 'proposal',
		offsetY: 35, // Lower
	},
	wedding: {
		id: 'wedding',
		offsetY: 10, // Prominent center position
	},
	honeymoon: {
		id: 'honeymoon',
		offsetY: 20, // Right side
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
