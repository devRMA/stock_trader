import { Box, Center, Container, Heading } from '@chakra-ui/react';
import { GetStaticPropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Footer from '../components/Footer';
import Header from '../components/Header';

function Index() {
    const { t } = useTranslation('common');
    const router = useRouter();

    return (
        <>
            <Header />
            <Container>
                <Box>
                    <Center>
                        <Heading>{t('hello-world')}</Heading>
                    </Center>
                </Box>
                <Box>
                    <Center>
                        <Link href={router.pathname} locale="en">
                            English
                        </Link>
                    </Center>
                </Box>
                <Box>
                    <Center>
                        <Link href={router.pathname} locale="pt">
                            Português
                        </Link>
                    </Center>
                </Box>
            </Container>
            <Footer />
        </>
    );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'pt', [
                'common',
                'header',
            ])),
        },
    };
}

export default Index;
