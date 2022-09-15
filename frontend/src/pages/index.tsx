import {
    Button,
    Flex,
    Heading,
    Link,
    Stack,
    Text,
    useBreakpointValue,
} from '@chakra-ui/react';
import { GetStaticPropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Lottie from 'react-lottie';

import illustrationData from '../assets/lotties/analyze-illustration.json';
import Footer from '../components/Footer';
import Header from '../components/Header';

function Index() {
    const { t } = useTranslation('hero');

    return (
        <>
            <Header />
            <Stack minH="100vh" direction={{ base: 'column', md: 'row' }}>
                <Flex p={8} flex={1} align="center" justify="center">
                    <Stack spacing={6} w="full" maxW="lg">
                        <Heading
                            fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                        >
                            <Text
                                as="span"
                                position="relative"
                                _after={{
                                    content: "''",
                                    width: 'full',
                                    height: useBreakpointValue({
                                        base: '20%',
                                        md: '30%',
                                    }),
                                    position: 'absolute',
                                    bottom: 1,
                                    left: 0,
                                    bg: 'orange.400',
                                    zIndex: -1,
                                }}
                            >
                                Stock trader
                            </Text>
                        </Heading>
                        <Text
                            fontSize={{ base: 'md', lg: 'lg' }}
                            color="gray.500"
                        >
                            {t('project_description')}
                        </Text>
                        <Stack
                            direction={{ base: 'column', md: 'row' }}
                            spacing={4}
                        >
                            <Button
                                as={Link}
                                href="#register"
                                rounded="full"
                                bg="orange.400"
                                colorScheme="orange"
                                _hover={{
                                    textDecoration: 'none',
                                    bg: 'orange.500',
                                }}
                            >
                                {t('cta')}
                            </Button>
                        </Stack>
                    </Stack>
                </Flex>
                <Flex flex={1}>
                    <Lottie
                        isClickToPauseDisabled
                        options={{
                            loop: true,
                            autoplay: true,
                            animationData: illustrationData,
                        }}
                    />
                </Flex>
            </Stack>
            <Footer />
        </>
    );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'pt', [
                'hero',
                'header',
            ])),
        },
    };
}

export default Index;
