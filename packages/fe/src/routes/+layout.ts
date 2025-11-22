import { loadLocaleAsync } from '$lib/i18n/i18n-util.async';

import type { LayoutLoad } from './$types';

export const prerender = true;
export const ssr = false;

export const load = (async (event) => {
	const { locale } = event.data;
	await loadLocaleAsync(locale);

	return event.data;
}) satisfies LayoutLoad;
