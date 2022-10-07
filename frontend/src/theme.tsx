import { theme as proTheme } from '@chakra-ui/pro-theme';
import { type ThemeConfig, extendTheme } from '@chakra-ui/react';

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
    disableTransitionOnChange: false,
};

const colors = {
    ...proTheme.colors,
    brand: proTheme.colors.orange,
};

const styles = {
    ...proTheme.styles,
    global: {
        '*::placeholder': {
            opacity: 0.5,
            color: 'muted',
        },
        body: {
            transitionProperty: 'background-color',
            transitionDuration: 'ultra-slow',
        },
    },
};

const theme = extendTheme(
    {
        config,
        colors,
        styles,
    },
    proTheme,
);

export default theme;
