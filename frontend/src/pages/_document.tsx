import { ColorModeScript } from '@chakra-ui/react';
import NextDocument, { Head, Html, Main, NextScript } from 'next/document';
import theme from 'theme';

export default class Document extends NextDocument {
    render() {
        return (
            <Html>
                <Head>
                    <meta name="application-name" content="Stock Trader" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta
                        name="apple-mobile-web-app-status-bar-style"
                        content="default"
                    />
                    <meta
                        name="apple-mobile-web-app-title"
                        content="Stock Trader"
                    />
                    <meta
                        name="description"
                        content="A small action game where the objective is to be the richest."
                    />
                    <meta name="format-detection" content="telephone=no" />
                    <meta name="mobile-web-app-capable" content="yes" />
                    <meta
                        name="msapplication-config"
                        content="/browserconfig.xml"
                    />
                    <meta name="msapplication-TileColor" content="#da532c" />
                    <meta name="msapplication-tap-highlight" content="no" />
                    <meta name="theme-color" content="#ed8936" />

                    <link
                        rel="apple-touch-icon"
                        sizes="180x180"
                        href="/apple-touch-icon.png"
                    />

                    <link
                        rel="icon"
                        type="image/png"
                        sizes="32x32"
                        href="/favicon-32x32.png"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="16x16"
                        href="/favicon-16x16.png"
                    />
                    <link rel="manifest" href="/manifest.json" />
                    <link
                        rel="mask-icon"
                        href="/safari-pinned-tab.svg"
                        color="#ed8936"
                    />
                    <link rel="shortcut icon" href="/favicon.ico" />

                    <meta name="twitter:card" content="summary" />
                    <meta
                        name="twitter:url"
                        content="https://stock-trader-blush.vercel.app/"
                    />
                    <meta name="twitter:title" content="Stock Trader" />
                    <meta
                        name="twitter:description"
                        content="A small action game where the objective is to be the richest."
                    />
                    <meta
                        name="twitter:image"
                        content="https://stock-trader-blush.vercel.app//android-chrome-192x192.png"
                    />
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content="Stock Trader" />
                    <meta
                        property="og:description"
                        content="A small action game where the objective is to be the richest."
                    />
                    <meta property="og:site_name" content="Stock Trader" />
                    <meta
                        property="og:url"
                        content="https://stock-trader-blush.vercel.app/"
                    />
                    <meta
                        property="og:image"
                        content="https://stock-trader-blush.vercel.app//apple-touch-icon.png"
                    />
                </Head>
                <body>
                    <ColorModeScript
                        initialColorMode={theme.config.initialColorMode}
                    />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
