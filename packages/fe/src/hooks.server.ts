import { sequence } from '@sveltejs/kit/hooks';

import type { Locales } from '$lib/i18n/i18n-types';
import type { Handle } from '@sveltejs/kit';

const LOCALE: Locales = 'it';

const handleLocaleDetection = (async ({ event, resolve }) => {
	// Force Italian locale
	event.locals.locale = LOCALE;

	return resolve(event, { transformPageChunk: ({ html }) => html.replace('%lang%', LOCALE) });
}) satisfies Handle;

export const handle = sequence(handleLocaleDetection);
