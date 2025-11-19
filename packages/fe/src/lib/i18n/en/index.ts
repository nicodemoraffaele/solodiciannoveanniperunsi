import type { BaseTranslation } from '../i18n-types';

const en = {
	siteTitle: 'Sara and Raffaele',
	weddingDate: 'June 20, 2026',

	// Timeline milestones
	milestones: {
		firstMeeting: {
			date: 'April 24, 2007',
			title: 'Our first meeting',
			description:
				'The day our eyes met for the first time. Who would have thought that moment would change our lives forever?',
		},
		engagement: {
			date: 'September 14, 2007',
			title: 'The first "Yes"',
			description:
				'The day we decided to officially start this wonderful journey together. From that moment, every day has been a new adventure.',
		},
		movingTogether: {
			date: 'November 2018',
			title: 'Our home',
			description:
				'The month we decided to build our nest together. Finally under the same roof, every day became an opportunity to grow together.',
		},
		proposal: {
			date: 'August 21, 2025',
			title: 'The proposal',
			description:
				'The day Raffaele asked the most important question. With hearts racing and tears in our eyes, we said "Yes" to our future together.',
		},
		wedding: {
			date: 'June 20, 2026',
			title: 'Our wedding',
			description: 'The day we will celebrate our love in front of the people we cherish.',
			church: {
				title: 'The ceremony',
				name: 'Church [Church Name]',
				address: '[Church address]',
				time: '[Time]',
				description:
					'Here we will exchange the vows that will bind us forever. We look forward to sharing this magical moment with you.',
			},
			reception: {
				title: 'The reception',
				name: 'Venue [Venue Name]',
				address: '[Venue address]',
				time: 'Following the ceremony',
				description:
					'After the ceremony, we will celebrate together in this beautiful venue. Music, dancing and lots of joy to celebrate our love!',
			},
		},
		honeymoon: {
			date: 'September 2026',
			title: 'Honeymoon',
			description: 'Our first trip as husband and wife. An adventure that will mark the beginning of our new life together.',
			giftMessage: 'The greatest gift',
			giftDescription:
				'Your presence is the most precious gift we could receive. If you wish to contribute to our honeymoon, we would be happy to share the memories of this adventure with you.',
			ibanLabel: 'IBAN for gifts',
			ibanValue: 'IT00 X000 0000 0000 0000 0000 000',
			ibanNote: 'Account holder: Sara and Raffaele',
		},
	},

	// UI labels
	ui: {
		clickForDetails: 'Click for more details',
		hoverForDetails: 'Hover for more details',
		closePopup: 'Close',
		copyIban: 'Copy IBAN',
		ibanCopied: 'IBAN copied!',
	},
} satisfies BaseTranslation;

export default en;
