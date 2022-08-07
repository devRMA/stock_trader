const path = require('path');

module.exports = {
    // https://www.i18next.com/overview/configuration-options#logging
    debug: process.env.NODE_ENV === 'development',
    i18n: {
        locales: ['en', 'pt'],
        defaultLocale: 'en',
    },
    reloadOnPrerender: process.env.NODE_ENV === 'development',
};
