import type { BaseTranslation } from '../i18n-types';

const it = {
	siteTitle: 'Sara e Raffaele',
	weddingDate: '20 Giugno 2026',

	// Timeline milestones
	milestones: {
		firstMeeting: {
			date: '24 Aprile 2007',
			title: 'Il nostro primo incontro',
			description: 'Il giorno in cui Sara, con la mano fasciata ed il dito steccato, chiese a Raffaele il numero fuori la sua classe. Indossava un jeans ed un maglioncino azzurro. Chi avrebbe mai pensato che quel momento avrebbe cambiato tutto?',
		},
		engagement: {
			date: '14 Settembre 2007',
			title: 'Il primo "Sì"',
			description:
				'Il giorno in cui abbiamo deciso di iniziare ufficialmente questo meraviglioso viaggio insieme. Da quel momento, ogni giorno è stata una nuova avventura.',
		},
		movingTogether: {
			date: 'Novembre 2018',
			title: 'La nostra casa',
			description:
				"Il mese in cui abbiamo deciso di costruire il nostro nido insieme. Finalmente sotto lo stesso tetto, ogni giorno è diventato un'occasione per crescere insieme.",
		},
		proposal: {
			date: '21 Agosto 2025',
			title: 'La proposta',
			description:
				'Il giorno in cui Raffaele ha fatto la domanda più importante. Con il cuore che batteva forte e gli occhi lucidi, abbiamo detto "Sì" al nostro futuro insieme.',
		},
		wedding: {
			date: '20 Giugno 2026',
			title: 'Il nostro matrimonio',
			description: 'Il giorno in cui celebreremo il nostro amore davanti alle persone che amiamo.',
			church: {
				title: 'La cerimonia',
				name: 'Pieve San Giovanni Battista a Ponte allo Spino',
				address: 'Strada Provinciale di Sovicille, 10, 53018 Sovicille SI',
				time: 'Ore 16:30',
				description:
					'Qui ci scambieremo le promesse che ci legheranno per sempre. Vi aspettiamo per condividere con noi questo momento magico.',
			},
			reception: {
				title: 'Il ricevimento',
				name: 'Fattoria Cerreto a Merse',
				address: 'Strada Comunale di Recenza, 53018 Siena SI',
				time: 'A seguire',
				description:
					'Dopo la cerimonia, festeggeremo insieme in questa splendida location. Musica, balli e tanta allegria per celebrare il nostro amore!',
			},
		},
		honeymoon: {
			date: 'Settembre 2026',
			title: 'Viaggio di nozze',
			description:
				"Il nostro primo viaggio come marito e moglie. Un'avventura che segnerà l'inizio della nostra nuova vita insieme.",
			giftMessage: 'Il regalo più grande',
			giftDescription:
				'La vostra presenza è il regalo più prezioso che potremmo ricevere. Se vorrete contribuire al nostro viaggio di nozze, saremo felici di condividere con voi i ricordi di questa avventura.',
			ibanLabel: 'IBAN per il regalo',
			ibanValue: 'IT00 X000 0000 0000 0000 0000 000',
			ibanNote: 'Intestato a: Sara e Raffaele',
		},
	},

	// UI labels
	ui: {
		clickForDetails: 'Clicca per scoprire di più',
		hoverForDetails: 'Passa il mouse per scoprire di più',
		closePopup: 'Chiudi',
		copyIban: 'Copia IBAN',
		ibanCopied: 'IBAN copiato!',
	},
} satisfies BaseTranslation;

export default it;
