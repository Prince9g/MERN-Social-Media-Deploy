/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}', // Modify this based on your project structure
	  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

