import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			$lib: './src/lib',
			$components: './src/components',
			$services: './src/services',
			$app: '../../node_modules/@sveltejs/kit/types',
			'$project/ui': '../ui/src/',
		},
	},
	vitePlugin: {
		inspector: {
			toggleKeyCombo: 'meta-shift',
			showToggleButton: 'never',
		},
	},
};

export default config;
