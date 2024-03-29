const path = require('path');

module.exports = {
    stories: ['../src/**/stories.mdx', '../src/**/stories.@(js|jsx|ts|tsx)'],
    staticDirs: ['../public'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@chakra-ui/storybook-addon',
        {
            name: 'storybook-addon-next',
            options: {
                nextConfigPath: path.resolve(__dirname, '../next.config.js'),
            },
        },
    ],
    features: {
        emotionAlias: false,
    },
    framework: '@storybook/react',
    core: {
        builder: '@storybook/builder-webpack5',
    },
};
