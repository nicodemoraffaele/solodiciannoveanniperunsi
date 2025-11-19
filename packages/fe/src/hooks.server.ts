import { detectLocale, locales } from '$lib/i18n/i18n-util.js';
import { sequence } from '@sveltejs/kit/hooks';
import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors';

import type { Locales } from '$lib/i18n/i18n-types';
import type { Handle } from '@sveltejs/kit';

const DEFAULT_LOCALE: Locales = 'en';

const handleLocaleDetection = (async ({ event, resolve }) => {
	const detectAcceptLang = initAcceptLanguageHeaderDetector(event.request);
	const locale = detectLocale(detectAcceptLang);

	if (!locales.includes(locale)) {
		event.locals.locale = DEFAULT_LOCALE;
		return resolve(event, { transformPageChunk: ({ html }) => html.replace('%lang%', DEFAULT_LOCALE) });
	}

	event.locals.locale = locale;

	return resolve(event, { transformPageChunk: ({ html }) => html.replace('%lang%', locale) });
}) satisfies Handle;

export const handle = sequence(handleLocaleDetection);
