import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import svelteParser from 'svelte-eslint-parser';

export default [
	js.configs.recommended,
	...ts.configs.strict,
	...ts.configs.stylistic,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	{
		languageOptions: {
			parser: ts.parser,
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
			},
		},
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: ts.parser,
				svelteFeatures: {
					runes: true,
					experimentalGenerics: true,
				},
			},
			globals: {
				$page: 'readonly',
			},
		},
	},
	{
		rules: {
			'no-var': 'error',
			semi: ['error', 'always'],
			quotes: ['error', 'single', { avoidEscape: true }],
			'@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '.*', varsIgnorePattern: '^_' }],
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/require-await': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
		},
	},
	{
		ignores: [
			'./eslint.config.js',
			'.DS_Store',
			'node_modules',
			'README.md',
			'.svelte-kit',
			'**/i18n /*',
			'/package',
			'.env',
			'.env.*',
			'!.env.example',
			'schemas',
			'build',
			'**/vite.config.ts',
			'**/svelte.config.js',
			'pnpm-lock.yaml',
			'package-lock.json',
			'yarn.lock',
			'.yarn',
		],
	},
];
