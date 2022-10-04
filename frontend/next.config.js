const { i18n } = require('./next-i18next.config');
const withPWA = require('next-pwa')({
    dest: 'public',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    i18n,
    trailingSlash: true,
};

module.exports = withPWA(nextConfig);
