module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				bg: '#F5F5F5',
				primary: '#3DBFBF',
				primary_dark: '#2B8DBF',
				secondary: '#00a4ef',
				secondary_dark: '#0048ff',

				white: '#FFFFFF',
				black: '#000000',

				icon: '#BDC3C9',
				error: '#FB5B63',
				error_dark: '#c7484e',
				success: '#79f3b0',
			},
		},
		screens: {
			'2xl': { max: '1535px' },
			xl: { max: '1279px' },
			lg: { max: '1023px' },
			md: { max: '767px' },
			sm: { max: '639px' },
		},
	},
	plugins: [],
};
