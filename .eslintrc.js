module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		'plugin:vue/vue3-recommended',
		'eslint:recommended',
		'@vue/typescript',
	],
	plugins: ['vue'],
	parserOptions: {
		ecmaVersion: 2021,
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		"indent": ['error', "tab"],
		"no-tabs": ["error", { "allowIndentationTabs": true }],
		"max-len": 0,
		'vue/html-indent': ['error', 'tab']
	},
};