import { type ThemeConfig, extendTheme } from '@chakra-ui/react';

const fonts = {
    body: `'JetBrains Mono', monospace`,
};

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};

const theme = extendTheme({
    config,
    fonts,
});

export default theme;
