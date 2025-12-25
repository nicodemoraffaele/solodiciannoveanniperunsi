import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import type { Locales } from '$lib/i18n/i18n-types';
import type { Handle } from '@sveltejs/kit';

const LOCALE: Locales = 'it';

// Set to true to enable redirect to /workinprogress
const WORK_IN_PROGRESS = true;

const handleWorkInProgress = (async ({ event, resolve }) => {
	if (WORK_IN_PROGRESS && !event.url.pathname.startsWith('/workinprogress')) {
		throw redirect(302, '/workinprogress');
	}
	return resolve(event);
}) satisfies Handle;

const handleLocaleDetection = (async ({ event, resolve }) => {
	// Force Italian locale
	event.locals.locale = LOCALE;

	return resolve(event, { transformPageChunk: ({ html }) => html.replace('%lang%', LOCALE) });
}) satisfies Handle;

export const handle = sequence(handleWorkInProgress, handleLocaleDetection);
