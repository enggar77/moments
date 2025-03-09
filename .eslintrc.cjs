// .eslintrc.cjs
module.exports = {
	root: true,
	env: {
		browser: true,
		es2020: true,
		'vitest-globals/env': true, // <--- add new env
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:react-hooks/recommended',
		'plugin:vitest-globals/recommended', // <---- add new plugin
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
};
