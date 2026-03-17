/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{js,jsx,ts,tsx}',
		'./index.php',
		'./inc/**/*.php',
	],
	theme: {
		extend: {
			keyframes: {
				'hovercard-fade-in-up': {
					'0%': { opacity: '0', transform: 'translate(0, 20px)' },
					'100%': { opacity: '1', transform: 'translate(0, 0)' },
				},
				'hovercard-fade-out-down': {
					'0%': { opacity: '1', transform: 'translate(0, 0)' },
					'100%': { opacity: '0', transform: 'translate(0, 20px)' },
				},
			},
			animation: {
				'hovercard-in': 'hovercard-fade-in-up 0.1s ease forwards',
				'hovercard-out': 'hovercard-fade-out-down 0.1s ease forwards',
			},
			colors: {
				// Map to existing H2 brand colors
				'brand': {
					DEFAULT: 'var(--hm-red)',
					light: 'var(--hm-red-light)',
					dark: 'var(--hm-red-dark)',
				},
				'hm': {
					red: 'var(--hm-red)',
					blue: 'var(--hm-blue)',
					'warm-grey': 'var(--hm-warm-grey)',
					'dark-grey': 'var(--hm-dark-grey)',
					beige: 'var(--hm-beige)',
					'medium-grey': 'var(--hm-medium-grey)',
					'light-grey': 'var(--hm-light-grey)',
					brown: 'var(--hm-brown)',
					'vibrant-blue': 'var(--hm-vibrant-blue)',
					mint: 'var(--hm-mint)',
					'ash-grey': 'var(--hm-ash-grey)',
					'dark-red': 'var(--hm-dark-red)',
					'deep-blue': 'var(--hm-deep-blue)',
					'light-blue': 'var(--hm-light-blue)',
					'border-color': '#d9d9d9',
				},
			},
		},
	},
	plugins: [],
};
