export type MilestoneType = 'firstMeeting' | 'engagement' | 'movingTogether' | 'proposal' | 'wedding' | 'honeymoon';

export interface BaseMilestone {
	id: MilestoneType;
	date: string;
	title: string;
	location: string;
	description: string;
}

export interface WeddingLocation {
	title: string;
	name: string;
	address: string;
	time: string;
	description: string;
	imageUrl?: string;
}

export interface WeddingMilestone extends BaseMilestone {
	id: 'wedding';
	church: WeddingLocation;
	reception: WeddingLocation;
}

export interface HoneymoonMilestone extends BaseMilestone {
	id: 'honeymoon';
	giftMessage: string;
	giftDescription: string;
	ibanLabel: string;
	ibanValue: string;
	ibanNote: string;
}

export type StandardMilestone = BaseMilestone & {
	id: 'firstMeeting' | 'engagement' | 'movingTogether' | 'proposal';
};

export type Milestone = StandardMilestone | WeddingMilestone | HoneymoonMilestone;

export interface MilestonePosition {
	id: MilestoneType;
	// Desktop positioning (horizontal layout with different heights)
	offsetY: number; // Vertical offset in percentage or pixels
	offsetX?: number; // Optional horizontal offset
	// Mobile: will be ordered chronologically by default
}
