import {
    Box,
    Flex,
    Heading,
    Stack,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Textarea,
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react';
import illustrationData from 'assets/lotties/close-illustration.json';
import Header from 'components/Header';
import Lottie from 'lottie-react';
import { GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffectOnce } from 'react-use';
import { selectUser, useAppSelector } from 'store/hooks';

function Banned() {
    const { t } = useTranslation('banned');
    const { logged, user } = useAppSelector(selectUser);
    const router = useRouter();

    useEffectOnce(() => {
        if (!logged || !user.banned || user.bans.length === 0) {
            router.push('/');
        }
    });

    return (
        <>
            <Header />
            <Stack align="center" p={20}>
                <Flex w="200px" h="200px">
                    <Lottie animationData={illustrationData} loop autoPlay />
                </Flex>
                <Heading as="h2" size="xl" mt={6} mb={2}>
                    {t('title')}
                </Heading>
                <Text color="gray.500">{t('description')}</Text>
                <TableContainer w="full" pt="5">
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>{t('reason')}</Th>
                                <Th>{t('date')}</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {user.bans.map((ban) => (
                                <Tr key={ban.created_at}>
                                    <Td>{ban.reason}</Td>
                                    <Td>
                                        {new Date(
                                            ban.created_at,
                                        ).toLocaleString()}
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
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
