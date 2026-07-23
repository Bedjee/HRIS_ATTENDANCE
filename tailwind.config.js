import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                navy: {
                    50: '#e8edf3',
                    100: '#c5d0df',
                    200: '#9eb3c9',
                    300: '#7696b3',
                    400: '#4f7a9c',
                    500: '#2a5e85',
                    600: '#1e4b6e',
                    700: '#1a3a56',
                    800: '#152a3f',
                    900: '#0e1a28',
                    950: '#0a1119',
                },
            },
        },
    },

    plugins: [forms, animate],
};
