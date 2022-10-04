import { type ThemeConfig, extendTheme } from '@chakra-ui/react';

const fonts = {
    body: `'JetBrains Mono', monospace`,
};

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};

const colors = {
    white: '#f1f1f1',
};

const theme = extendTheme({
    config,
    fonts,
    colors,
});

export default theme;
