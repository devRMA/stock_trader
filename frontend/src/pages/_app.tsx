import '@fontsource/jetbrains-mono';

import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { Provider } from 'react-redux';
import store from 'store';
import theme from 'theme';

function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider theme={theme}>
            <Provider store={store}>
                <Component {...pageProps} />
            </Provider>
        </ChakraProvider>
    );
}

export default appWithTranslation(App);
