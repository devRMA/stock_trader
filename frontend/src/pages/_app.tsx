import '@fontsource/jetbrains-mono';

import { ChakraProvider } from '@chakra-ui/react';
import ProtectedRoutes from 'components/ProtectedRoutes';
import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { Provider } from 'react-redux';
import store from 'store';
import theme from 'theme';

function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider theme={theme}>
            <Provider store={store}>
                <ProtectedRoutes>
                    <Component {...pageProps} />
                </ProtectedRoutes>
            </Provider>
        </ChakraProvider>
    );
}

export default appWithTranslation(App);
