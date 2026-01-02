<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { setLocale } from '$lib/i18n/i18n-svelte';
	import type { Snippet } from 'svelte';
	import '../app.postcss';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	setLocale(data.locale);

	// Set to true to redirect all pages to /workinprogress
	const WORK_IN_PROGRESS = false;

	$effect(() => {
		if (WORK_IN_PROGRESS && !$page.url.pathname.endsWith('/workinprogress')) {
			goto(`${base}/workinprogress`, { replaceState: true });
		}
	});
</script>

{@render children()}
