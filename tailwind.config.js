const colors = require('tailwindcss/colors')

module.exports = {
	purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	darkMode: 'class', // or 'media' or 'class'
	theme: {
		fontFamily: {
			sans: ['Lato', 'sans-serif'],
			icons: ['Material Icons'],
		},
		colors: {
			primary: {
				light: '#192d66',
				DEFAULT: '#122049',
			},
			secondary: {
				xlight: '#FBD566',
				light: '#faa854',
				DEFAULT: '#ed5c30',
				dark: '#d64437',
			},
			accent: {
				light: '#2ab269',
				DEFAULT: '#208951'
			},
			white: colors.white,
			gray: colors.coolGray,
			pastel: {
				purple: '#a55eaa',
				pink: '#e84393',
				blue: '#0fbcf9'
			}
		},
		fill: {
			primary: {
				light: '#192d66',
				DEFAULT: '#122049',
			},
			secondary: {
				xlight: '#FBD566',
				light: '#faa854',
				DEFAULT: '#ed5c30',
				dark: '#d64437',
			},
			accent: {
				light: '#2ab269',
				DEFAULT: '#208951'
			},
			white: colors.white,
			gray: colors.blueGray,
			pastel: {
				purple: '#a55eaa',
				pink: '#e84393',
				blue: '#0fbcf9'
			}
		},
		extend: {},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};