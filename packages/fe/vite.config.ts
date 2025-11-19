import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ mode, command }) => {
	console.log(`CURRENT COMMAND: \x1b[1m\x1b[36m${command}\x1b[0m`);
	console.log(`CURRENT MODE: \x1b[1m\x1b[32m${mode}\x1b[0m`);

	return {
		resolve: {},
		plugins: [sveltekit()],
	};
});
