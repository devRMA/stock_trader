import {
    Box,
    Container,
    Flex,
    Heading,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import illustrationData from 'assets/lotties/close-illustration.json';
import DarkModeSwitch from 'components/DarkModeSwitch';
import Header from 'components/Header';
import Lottie from 'lottie-react';
import { GetStaticPropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { selectUser, useAppSelector } from 'store/hooks';

function Banned() {
    const { t } = useTranslation('banned');
    const { user } = useAppSelector(selectUser);
    const mutedColor = useColorModeValue('gray.600', 'gray.500');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <>
            <Header />
            <Stack align="center">
                <Flex w="200px" h="200px">
                    <Lottie animationData={illustrationData} loop={false} />
                </Flex>
                <Heading size="xl">{t('title')}</Heading>
                <Container>
                    <Text color={mutedColor} mb={2} textAlign="justify">
                        {t('description')}
                    </Text>
                    <Text as="span" color={mutedColor}>
                        {t('date')}
                    </Text>
                    <Text as="span">
                        {new Date(
                            user.bans[user.bans.length - 1]?.created_at,
                        ).toLocaleString()}
                    </Text>
                    <Box
                        boxShadow="xl"
                        border="1px"
                        borderColor={borderColor}
                        rounded="md"
                        mt="2"
                        p="2"
                        textAlign="justify"
                    >
                        <Text color={mutedColor}>{t('reason')}</Text>
                        <Text>{user.bans[user.bans.length - 1]?.reason}</Text>
                    </Box>
                </Container>
                <DarkModeSwitch />
            </Stack>
        </>
    );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'pt', [
                'banned',
                'header',
            ])),
        },
    };
}

export default Banned;
