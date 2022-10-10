const { i18n } = require('./next-i18next.config');
const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    i18n,
    trailingSlash: true,
    env: {
        API_URL: process.env.API_URL,
    },
};

module.exports = withPWA(nextConfig);
