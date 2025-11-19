<script lang="ts">
	import { setLocale } from '$lib/i18n/i18n-svelte';
	import type { Snippet } from 'svelte';
	import '../app.postcss';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	setLocale(data.locale);
</script>

{@render children()}
